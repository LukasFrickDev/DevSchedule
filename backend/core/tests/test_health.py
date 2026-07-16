from django.urls import reverse


def test_health_check_is_public_and_returns_ok(client):
    response = client.get(reverse("core:health"))

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
