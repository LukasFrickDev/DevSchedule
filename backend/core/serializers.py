import re
from datetime import datetime, time, timedelta

from django.utils import timezone
from rest_framework import serializers

from core.models import Appointment, Service

SCHEDULING_STARTS = tuple(time(hour=hour) for hour in range(9, 18))


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("id", "name", "description", "duration_minutes")


class AvailabilityQuerySerializer(serializers.Serializer):
    service_id = serializers.UUIDField()
    date = serializers.DateField(input_formats=["%d-%m-%Y"])

    def validate_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError(
                "Escolha uma data igual ou posterior a hoje."
            )
        return value


class CreateAppointmentSerializer(serializers.Serializer):
    service_id = serializers.UUIDField()
    date = serializers.DateField(input_formats=["%d-%m-%Y"])
    time = serializers.TimeField(input_formats=["%H:%M"])
    customer_name = serializers.CharField(max_length=120, trim_whitespace=True)
    customer_phone = serializers.CharField(max_length=20, trim_whitespace=True)

    def validate_customer_name(self, value):
        parts = value.split()
        if len(parts) < 2 or any(len(part) < 2 for part in parts):
            raise serializers.ValidationError("Informe seu nome completo, com nome e sobrenome.")
        return value

    def validate_customer_phone(self, value):
        phone = re.sub(r"\D", "", value)
        if len(phone) not in {10, 11}:
            raise serializers.ValidationError("Informe um telefone com DDD válido.")
        return phone

    def validate_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError(
                "Escolha uma data igual ou posterior a hoje."
            )
        if value.weekday() >= 5:
            raise serializers.ValidationError(
                "Atendimentos ocorrem somente de segunda a sexta-feira."
            )
        return value

    def validate_time(self, value):
        if value not in SCHEDULING_STARTS:
            raise serializers.ValidationError("Escolha um horário entre 09:00 e 17:00.")
        return value

    def validate(self, attrs):
        if (
            attrs["date"] == timezone.localdate()
            and attrs["time"] <= timezone.localtime().time()
        ):
            raise serializers.ValidationError(
                {"time": "Escolha um horário posterior ao horário atual."}
            )
        return attrs


class AppointmentServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("id", "name", "duration_minutes")


class AppointmentSerializer(serializers.ModelSerializer):
    service = AppointmentServiceSerializer(read_only=True)
    scheduled_at = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = (
            "id",
            "confirmation_code",
            "customer_name",
            "customer_phone",
            "service",
            "scheduled_at",
            "status",
            "created_at",
            "updated_at",
        )

    def get_scheduled_at(self, appointment):
        scheduled_at = datetime.combine(appointment.date, appointment.start)
        return timezone.make_aware(scheduled_at, timezone.get_current_timezone())


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, trim_whitespace=True)
    password = serializers.CharField(trim_whitespace=False)


class AdminAppointmentListQuerySerializer(serializers.Serializer):
    date = serializers.DateField(input_formats=["%d-%m-%Y"], required=False)
    service_id = serializers.UUIDField(required=False)
    status = serializers.ChoiceField(choices=Appointment.Status.values, required=False)
    page = serializers.IntegerField(min_value=1, required=False, default=1)
    page_size = serializers.ChoiceField(choices=[10, 25, 50, 100], required=False, default=10)


class UpdateAppointmentStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Appointment.Status.values)


def slot_end(start: time) -> time:
    return (datetime.combine(timezone.localdate(), start) + timedelta(hours=1)).time()
