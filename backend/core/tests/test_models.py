from datetime import date, time
from uuid import UUID

import pytest
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.db.migrations.recorder import MigrationRecorder

from core.models import Appointment, Service


@pytest.fixture
def service() -> Service:
    return Service.objects.create(
        name="Mentoria individual",
        description="Encontro individual para orientar os próximos passos de estudo.",
        duration_minutes=60,
    )


@pytest.mark.django_db
def test_creates_service_and_appointment_with_uuid_and_timestamps(service: Service):
    appointment = Appointment.objects.create(
        confirmation_code="DEV-123456",
        customer_name="Ana Silva",
        customer_phone="11999999999",
        service=service,
        date=date(2026, 7, 20),
        start=time(9),
        end=time(10),
    )

    assert isinstance(service.id, UUID)
    assert service.created_at is not None
    assert service.updated_at is not None
    assert isinstance(appointment.id, UUID)
    assert appointment.status == Appointment.Status.SCHEDULED
    assert appointment.created_at is not None
    assert appointment.updated_at is not None


@pytest.mark.django_db
def test_appointment_exposes_only_approved_statuses():
    assert set(Appointment.Status.values) == {
        "SCHEDULED",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
    }


@pytest.mark.django_db
def test_appointment_rejects_an_invalid_status(service: Service):
    appointment = Appointment(
        confirmation_code="DEV-123456",
        customer_name="Ana Silva",
        customer_phone="11999999999",
        service=service,
        date=date(2026, 7, 20),
        start=time(9),
        end=time(10),
        status="INVALID",
    )

    with pytest.raises(ValidationError):
        appointment.full_clean()


@pytest.mark.django_db
def test_initial_services_have_sixty_minute_duration():
    call_command("seed_initial_services")

    assert set(Service.objects.values_list("duration_minutes", flat=True)) == {60}


@pytest.mark.django_db
def test_seed_creates_the_three_initial_services_idempotently():
    call_command("seed_initial_services")
    call_command("seed_initial_services")

    assert list(Service.objects.order_by("name").values_list("name", flat=True)) == [
        "Mentoria individual",
        "Orientação de carreira",
        "Revisão de projeto",
    ]
    assert Service.objects.count() == 3


@pytest.mark.django_db
def test_initial_migration_is_applied():
    applied_migrations = MigrationRecorder.Migration.objects.values_list("app", "name")

    assert ("core", "0001_initial") in applied_migrations
