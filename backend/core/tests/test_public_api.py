from datetime import date, time
from uuid import uuid4

import pytest
from django.urls import reverse

from core.models import Appointment, Service

MONDAY = date(2026, 7, 20)
SATURDAY = date(2026, 7, 25)


@pytest.fixture
def service() -> Service:
    return Service.objects.create(
        name="Mentoria individual",
        description="Encontro individual para orientar os próximos passos de estudo.",
        duration_minutes=60,
    )


def appointment_payload(service: Service, **overrides):
    payload = {
        "service_id": str(service.id),
        "date": "20-07-2026",
        "time": "09:00",
        "customer_name": "Ana Silva",
        "customer_phone": "(11) 99999-9999",
    }
    payload.update(overrides)
    return payload


@pytest.mark.django_db
def test_list_services_returns_only_active_services_in_contract_shape(client, service: Service):
    Service.objects.create(
        name="Serviço inativo",
        description="Não deve ser público.",
        duration_minutes=60,
        is_active=False,
    )

    response = client.get(reverse("core:services"))

    assert response.status_code == 200
    assert response.json() == {
        "data": [
            {
                "id": str(service.id),
                "name": "Mentoria individual",
                "description": service.description,
                "duration_minutes": 60,
            }
        ]
    }


@pytest.mark.django_db
def test_availability_returns_hourly_slots_and_marks_occupied_slot(client, service: Service):
    Appointment.objects.create(
        confirmation_code="DEV-EXISTING",
        customer_name="Cliente existente",
        customer_phone="11999999999",
        service=service,
        date=MONDAY,
        start=time(10),
        end=time(11),
    )

    response = client.get(
        reverse("core:availability"),
        {"service_id": service.id, "date": "20-07-2026"},
    )

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["service_id"] == str(service.id)
    assert data["date"] == "20-07-2026"
    assert data["timezone"] == "America/Sao_Paulo"
    assert len(data["slots"]) == 9
    assert data["slots"][0] == {"start": "09:00", "end": "10:00", "available": True}
    assert data["slots"][1] == {"start": "10:00", "end": "11:00", "available": False}
    assert data["slots"][-1] == {"start": "17:00", "end": "18:00", "available": True}


@pytest.mark.django_db
def test_availability_returns_empty_slots_on_weekend(client, service: Service):
    response = client.get(
        reverse("core:availability"),
        {"service_id": service.id, "date": "25-07-2026"},
    )

    assert response.status_code == 200
    assert response.json()["data"]["date"] == "25-07-2026"
    assert response.json()["data"]["slots"] == []


@pytest.mark.django_db
def test_public_endpoints_return_not_found_for_an_unknown_service(client):
    service_id = str(uuid4())

    availability_response = client.get(
        reverse("core:availability"),
        {"service_id": service_id, "date": "20-07-2026"},
    )
    appointment_response = client.post(
        reverse("core:appointments"),
        {
            "service_id": service_id,
            "date": "20-07-2026",
            "time": "09:00",
            "customer_name": "Ana Silva",
            "customer_phone": "11999999999",
        },
        content_type="application/json",
    )

    assert availability_response.status_code == 404
    assert appointment_response.status_code == 404
    assert availability_response.json()["error"]["code"] == "not_found"
    assert appointment_response.json()["error"]["code"] == "not_found"


@pytest.mark.django_db
def test_create_appointment_returns_contract_and_normalized_phone(client, service: Service):
    response = client.post(
        reverse("core:appointments"),
        appointment_payload(service),
        content_type="application/json",
    )

    assert response.status_code == 201
    data = response.json()["data"]
    assert data["customer_name"] == "Ana Silva"
    assert data["customer_phone"] == "11999999999"
    assert data["service"] == {
        "id": str(service.id),
        "name": service.name,
        "duration_minutes": 60,
    }
    assert data["scheduled_at"] == "2026-07-20T09:00:00-03:00"
    assert data["status"] == "SCHEDULED"
    assert data["confirmation_code"].startswith("DEV-")
    assert Appointment.objects.get().end == time(10)


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("customer_name", ""),
        ("customer_phone", "119999"),
        ("date", "2026-07-20"),
        ("date", "25-07-2026"),
        ("time", "09:30"),
    ],
)
def test_create_appointment_validates_payload(client, service: Service, field: str, value: str):
    response = client.post(
        reverse("core:appointments"),
        appointment_payload(service, **{field: value}),
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "validation_error"
    assert field in response.json()["error"]["fields"]


@pytest.mark.django_db
def test_conflict_returns_409_and_cancelled_appointment_releases_slot(client, service: Service):
    Appointment.objects.create(
        confirmation_code="DEV-CANCELLED",
        customer_name="Cliente cancelado",
        customer_phone="11999999999",
        service=service,
        date=MONDAY,
        start=time(9),
        end=time(10),
        status=Appointment.Status.CANCELLED,
    )
    released_slot = client.post(
        reverse("core:appointments"),
        appointment_payload(service),
        content_type="application/json",
    )
    assert released_slot.status_code == 201

    conflict = client.post(
        reverse("core:appointments"),
        appointment_payload(service),
        content_type="application/json",
    )

    assert conflict.status_code == 409
    assert conflict.json() == {
        "error": {
            "code": "slot_unavailable",
            "message": "O horário escolhido não está mais disponível.",
        }
    }
