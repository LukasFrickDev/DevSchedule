import uuid

from django.contrib.auth import get_user_model
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db import IntegrityError, transaction
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import Appointment, Service
from core.serializers import (
    SCHEDULING_STARTS,
    AdminAppointmentListQuerySerializer,
    AdminLoginSerializer,
    AppointmentSerializer,
    AvailabilityQuerySerializer,
    CreateAppointmentSerializer,
    ServiceSerializer,
    UpdateAppointmentStatusSerializer,
    slot_end,
)

DEMO_ADMIN_USERNAME = "admin"
DEMO_ADMIN_PASSWORD = "devschedule"


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


def authentication_error_response():
    return error_response(
        "authentication_failed",
        "Autenticação administrativa necessária.",
        status.HTTP_401_UNAUTHORIZED,
    )


def is_authenticated_admin(request):
    return request.user.is_authenticated and request.user.username == DEMO_ADMIN_USERNAME


def get_appointment_or_error(appointment_id):
    appointment = Appointment.objects.select_related("service").filter(id=appointment_id).first()
    if appointment is None:
        return None, error_response(
            "not_found",
            "Agendamento não encontrado.",
            status.HTTP_404_NOT_FOUND,
        )
    return appointment, None


def page_url(request, page_number):
    query_params = request.query_params.copy()
    query_params["page"] = page_number
    return f"{request.path}?{query_params.urlencode()}"


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

    current_time = timezone.localtime().time()
    is_today = selected_date == timezone.localdate()
    occupied_starts = set(
        Appointment.objects.filter(date=selected_date)
        .exclude(status=Appointment.Status.CANCELLED)
        .values_list("start", flat=True)
    )
    slots = [
        {
            "start": start.strftime("%H:%M"),
            "end": slot_end(start).strftime("%H:%M"),
            "available": start not in occupied_starts
            and not (is_today and start <= current_time),
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


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def admin_login(request):
    credentials = AdminLoginSerializer(data=request.data)
    if not credentials.is_valid():
        return serializer_error_response(credentials)

    if (
        credentials.validated_data["username"] != DEMO_ADMIN_USERNAME
        or credentials.validated_data["password"] != DEMO_ADMIN_PASSWORD
    ):
        return error_response(
            "authentication_failed",
            "Usuário ou senha inválidos.",
            status.HTTP_401_UNAUTHORIZED,
        )

    user_model = get_user_model()
    user, created = user_model.objects.get_or_create(username=DEMO_ADMIN_USERNAME)
    if (
        created
        or not user.check_password(DEMO_ADMIN_PASSWORD)
        or not user.is_active
        or not user.is_staff
    ):
        user.set_password(DEMO_ADMIN_PASSWORD)
        user.is_active = True
        user.is_staff = True
        user.save()

    refresh = RefreshToken.for_user(user)
    return Response({"access": str(refresh.access_token), "refresh": str(refresh)})


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
def list_admin_appointments(request):
    if not is_authenticated_admin(request):
        return authentication_error_response()

    query = AdminAppointmentListQuerySerializer(data=request.query_params)
    if not query.is_valid():
        return serializer_error_response(query)

    appointments = Appointment.objects.select_related("service")
    selected_date = query.validated_data.get("date")
    if selected_date:
        appointments = appointments.filter(date=selected_date)
    selected_service_id = query.validated_data.get("service_id")
    if selected_service_id:
        appointments = appointments.filter(service_id=selected_service_id)
    selected_status = query.validated_data.get("status")
    if selected_status:
        appointments = appointments.filter(status=selected_status)

    summary = appointments.aggregate(
        total=Count("id"),
        scheduled=Count("id", filter=Q(status=Appointment.Status.SCHEDULED)),
        confirmed=Count("id", filter=Q(status=Appointment.Status.CONFIRMED)),
        completed=Count("id", filter=Q(status=Appointment.Status.COMPLETED)),
        cancelled=Count("id", filter=Q(status=Appointment.Status.CANCELLED)),
    )
    appointments = appointments.order_by("date", "start")

    paginator = Paginator(appointments, query.validated_data["page_size"])
    try:
        page = paginator.page(query.validated_data["page"])
    except (EmptyPage, PageNotAnInteger):
        return error_response(
            "validation_error",
            "Verifique os dados informados.",
            status.HTTP_400_BAD_REQUEST,
            {"page": ["Página inválida."]},
        )

    return Response(
        {
            "count": paginator.count,
            "next": page_url(request, page.next_page_number()) if page.has_next() else None,
            "previous": (
                page_url(request, page.previous_page_number()) if page.has_previous() else None
            ),
            "summary": summary,
            "results": AppointmentSerializer(page.object_list, many=True).data,
        }
    )


@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
def update_admin_appointment_status(request, appointment_id):
    if not is_authenticated_admin(request):
        return authentication_error_response()

    payload = UpdateAppointmentStatusSerializer(data=request.data)
    if not payload.is_valid():
        return serializer_error_response(payload)

    appointment, error = get_appointment_or_error(appointment_id)
    if error:
        return error

    appointment.status = payload.validated_data["status"]
    try:
        with transaction.atomic():
            appointment.save(update_fields=["status", "updated_at"])
    except IntegrityError:
        return error_response(
            "slot_unavailable",
            "O horário escolhido não está mais disponível.",
            status.HTTP_409_CONFLICT,
        )
    return Response({"data": AppointmentSerializer(appointment).data})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
def cancel_admin_appointment(request, appointment_id):
    if not is_authenticated_admin(request):
        return authentication_error_response()

    appointment, error = get_appointment_or_error(appointment_id)
    if error:
        return error

    appointment.status = Appointment.Status.CANCELLED
    appointment.save(update_fields=["status", "updated_at"])
    return Response({"data": AppointmentSerializer(appointment).data})


@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
def delete_admin_appointment(request, appointment_id):
    if not is_authenticated_admin(request):
        return authentication_error_response()

    appointment, error = get_appointment_or_error(appointment_id)
    if error:
        return error

    appointment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
