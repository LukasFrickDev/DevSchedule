from django.urls import path

from core.views import availability, create_appointment, health_check, list_services

app_name = "core"

urlpatterns = [
    path("health/", health_check, name="health"),
    path("services/", list_services, name="services"),
    path("availability/", availability, name="availability"),
    path("appointments/", create_appointment, name="appointments"),
]
