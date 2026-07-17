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


class CreateAppointmentSerializer(serializers.Serializer):
    service_id = serializers.UUIDField()
    date = serializers.DateField(input_formats=["%d-%m-%Y"])
    time = serializers.TimeField(input_formats=["%H:%M"])
    customer_name = serializers.CharField(max_length=120, trim_whitespace=True)
    customer_phone = serializers.CharField(max_length=20, trim_whitespace=True)

    def validate_customer_name(self, value):
        if not value:
            raise serializers.ValidationError("Informe o nome.")
        return value

    def validate_customer_phone(self, value):
        phone = re.sub(r"\D", "", value)
        if len(phone) not in {10, 11}:
            raise serializers.ValidationError("Informe um telefone com DDD válido.")
        return phone

    def validate_date(self, value):
        if value.weekday() >= 5:
            raise serializers.ValidationError(
                "Atendimentos ocorrem somente de segunda a sexta-feira."
            )
        return value

    def validate_time(self, value):
        if value not in SCHEDULING_STARTS:
            raise serializers.ValidationError("Escolha um horário entre 09:00 e 17:00.")
        return value


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


def slot_end(start: time) -> time:
    return (datetime.combine(timezone.localdate(), start) + timedelta(hours=1)).time()
