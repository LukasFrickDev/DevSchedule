import uuid

from django.db import IntegrityError, transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.models import Appointment, Service
from core.serializers import (
    SCHEDULING_STARTS,
    AppointmentSerializer,
    AvailabilityQuerySerializer,
    CreateAppointmentSerializer,
    ServiceSerializer,
    slot_end,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok"})


def error_response(code, message, response_status, fields=None):
    error = {"code": code, "message": message}
    if fields:
        error["fields"] = fields
    return Response({"error": error}, status=response_status)


def serializer_error_response(serializer):
    fields = {
        field: [str(message) for message in messages]
        for field, messages in serializer.errors.items()
    }
    return error_response(
        "validation_error",
        "Verifique os dados informados.",
        status.HTTP_400_BAD_REQUEST,
        fields,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def list_services(request):
    services = Service.objects.filter(is_active=True).order_by("name")
    return Response({"data": ServiceSerializer(services, many=True).data})


@api_view(["GET"])
@permission_classes([AllowAny])
def availability(request):
    query = AvailabilityQuerySerializer(data=request.query_params)
    if not query.is_valid():
        return serializer_error_response(query)

    service = Service.objects.filter(id=query.validated_data["service_id"], is_active=True).first()
    if service is None:
        return error_response("not_found", "Serviço não encontrado.", status.HTTP_404_NOT_FOUND)

    selected_date = query.validated_data["date"]
    if selected_date.weekday() >= 5:
        return Response(
            {
                "data": {
                    "service_id": str(service.id),
                    "date": selected_date.strftime("%d-%m-%Y"),
                    "timezone": "America/Sao_Paulo",
                    "slots": [],
                }
            }
        )

    occupied_starts = set(
        Appointment.objects.filter(service=service, date=selected_date)
        .exclude(status=Appointment.Status.CANCELLED)
        .values_list("start", flat=True)
    )
    slots = [
        {
            "start": start.strftime("%H:%M"),
            "end": slot_end(start).strftime("%H:%M"),
            "available": start not in occupied_starts,
        }
        for start in SCHEDULING_STARTS
    ]
    return Response(
        {
            "data": {
                "service_id": str(service.id),
                "date": selected_date.strftime("%d-%m-%Y"),
                "timezone": "America/Sao_Paulo",
                "slots": slots,
            }
        }
    )


def create_confirmation_code():
    return f"DEV-{uuid.uuid4().hex[:8].upper()}"


@api_view(["POST"])
@permission_classes([AllowAny])
def create_appointment(request):
    payload = CreateAppointmentSerializer(data=request.data)
    if not payload.is_valid():
        return serializer_error_response(payload)

    service = Service.objects.filter(
        id=payload.validated_data["service_id"], is_active=True
    ).first()
    if service is None:
        return error_response("not_found", "Serviço não encontrado.", status.HTTP_404_NOT_FOUND)

    selected_date = payload.validated_data["date"]
    selected_start = payload.validated_data["time"]
    occupied_slot = Appointment.objects.filter(
        service=service,
        date=selected_date,
        start=selected_start,
    ).exclude(status=Appointment.Status.CANCELLED)
    if occupied_slot.exists():
        return error_response(
            "slot_unavailable",
            "O horário escolhido não está mais disponível.",
            status.HTTP_409_CONFLICT,
        )

    try:
        with transaction.atomic():
            appointment = Appointment.objects.create(
                confirmation_code=create_confirmation_code(),
                customer_name=payload.validated_data["customer_name"],
                customer_phone=payload.validated_data["customer_phone"],
                service=service,
                date=selected_date,
                start=selected_start,
                end=slot_end(selected_start),
                status=Appointment.Status.SCHEDULED,
            )
    except IntegrityError:
        return error_response(
            "slot_unavailable",
            "O horário escolhido não está mais disponível.",
            status.HTTP_409_CONFLICT,
        )

    return Response(
        {"data": AppointmentSerializer(appointment).data},
        status=status.HTTP_201_CREATED,
    )
