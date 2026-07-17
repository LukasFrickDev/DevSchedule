from datetime import date, time

import pytest
from django.urls import reverse

from core.models import Appointment, Service

MONDAY = date(2026, 7, 20)
TUESDAY = date(2026, 7, 21)


@pytest.fixture
def service() -> Service:
    return Service.objects.create(
        name="Mentoria individual",
        description="Encontro individual para orientar os próximos passos de estudo.",
        duration_minutes=60,
    )


@pytest.fixture
def admin_client(client):
    response = client.post(
        reverse("core:admin-login"),
        {"username": "admin", "password": "devschedule"},
        content_type="application/json",
    )

    assert response.status_code == 200
    return client


def create_appointment(service: Service, code: str, selected_date: date, start: time):
    return Appointment.objects.create(
        confirmation_code=code,
        customer_name=f"Cliente {code}",
        customer_phone="11999999999",
        service=service,
        date=selected_date,
        start=start,
        end=time(start.hour + 1),
    )


@pytest.mark.django_db
def test_admin_endpoints_require_authentication(client):
    response = client.get(reverse("core:admin-appointments"))

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "authentication_failed",
            "message": "Autenticação administrativa necessária.",
        }
    }


@pytest.mark.django_db
def test_admin_login_rejects_invalid_credentials(client):
    response = client.post(
        reverse("core:admin-login"),
        {"username": "admin", "password": "senha-incorreta"},
        content_type="application/json",
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "authentication_failed"


@pytest.mark.django_db
def test_admin_login_allows_demo_credentials(client):
    response = client.post(
        reverse("core:admin-login"),
        {"username": "admin", "password": "devschedule"},
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.json() == {"data": {"username": "admin"}}


@pytest.mark.django_db
def test_admin_list_filters_by_date_and_orders_slots_ascending(admin_client, service: Service):
    create_appointment(service, "DEV-0900", MONDAY, time(9))
    create_appointment(service, "DEV-1300", MONDAY, time(13))
    create_appointment(service, "DEV-1000", TUESDAY, time(10))

    response = admin_client.get(
        reverse("core:admin-appointments"),
        {"date": "20-07-2026", "page": 1},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 2
    assert data["next"] is None
    assert data["previous"] is None
    assert [item["confirmation_code"] for item in data["results"]] == [
        "DEV-0900",
        "DEV-1300",
    ]


@pytest.mark.django_db
def test_admin_list_without_date_orders_appointments_descending(admin_client, service: Service):
    create_appointment(service, "DEV-0900", MONDAY, time(9))
    create_appointment(service, "DEV-1000", TUESDAY, time(10))

    response = admin_client.get(reverse("core:admin-appointments"))

    assert response.status_code == 200
    assert [item["confirmation_code"] for item in response.json()["results"]] == [
        "DEV-1000",
        "DEV-0900",
    ]


@pytest.mark.django_db
def test_admin_list_validates_date_format(admin_client):
    response = admin_client.get(
        reverse("core:admin-appointments"),
        {"date": "2026-07-20"},
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "validation_error"
    assert "date" in response.json()["error"]["fields"]


@pytest.mark.django_db
@pytest.mark.parametrize(
    "new_status",
    [
        Appointment.Status.SCHEDULED,
        Appointment.Status.CONFIRMED,
        Appointment.Status.COMPLETED,
        Appointment.Status.CANCELLED,
    ],
)
def test_admin_updates_to_each_approved_status(admin_client, service: Service, new_status: str):
    appointment = create_appointment(service, "DEV-STATUS", MONDAY, time(9))

    response = admin_client.patch(
        reverse("core:admin-appointment-status", args=[appointment.id]),
        {"status": new_status},
        content_type="application/json",
    )

    appointment.refresh_from_db()
    assert response.status_code == 200
    assert response.json()["data"]["status"] == new_status
    assert appointment.status == new_status


@pytest.mark.django_db
def test_admin_status_update_validates_status(admin_client, service: Service):
    appointment = create_appointment(service, "DEV-INVALID", MONDAY, time(9))

    response = admin_client.patch(
        reverse("core:admin-appointment-status", args=[appointment.id]),
        {"status": "INVALID"},
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "validation_error"


@pytest.mark.django_db
def test_admin_status_update_preserves_slot_conflict(admin_client, service: Service):
    cancelled = create_appointment(service, "DEV-CANCELLED", MONDAY, time(9))
    cancelled.status = Appointment.Status.CANCELLED
    cancelled.save(update_fields=["status", "updated_at"])
    create_appointment(service, "DEV-SCHEDULED", MONDAY, time(9))

    response = admin_client.patch(
        reverse("core:admin-appointment-status", args=[cancelled.id]),
        {"status": "SCHEDULED"},
        content_type="application/json",
    )

    cancelled.refresh_from_db()
    assert response.status_code == 409
    assert response.json()["error"]["code"] == "slot_unavailable"
    assert cancelled.status == Appointment.Status.CANCELLED


@pytest.mark.django_db
def test_admin_cancel_releases_slot_for_public_availability(admin_client, service: Service):
    appointment = create_appointment(service, "DEV-CANCEL", MONDAY, time(9))

    cancel_response = admin_client.post(
        reverse("core:admin-appointment-cancel", args=[appointment.id]),
        content_type="application/json",
    )
    availability_response = admin_client.get(
        reverse("core:availability"),
        {"service_id": service.id, "date": "20-07-2026"},
    )

    appointment.refresh_from_db()
    assert cancel_response.status_code == 200
    assert cancel_response.json()["data"]["status"] == "CANCELLED"
    assert appointment.status == Appointment.Status.CANCELLED
    assert availability_response.json()["data"]["slots"][0]["available"] is True


@pytest.mark.django_db
def test_admin_delete_removes_appointment(admin_client, service: Service):
    appointment = create_appointment(service, "DEV-DELETE", MONDAY, time(9))

    response = admin_client.delete(reverse("core:admin-appointment-delete", args=[appointment.id]))

    assert response.status_code == 204
    assert not Appointment.objects.filter(id=appointment.id).exists()
