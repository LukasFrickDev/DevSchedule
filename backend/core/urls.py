from django.urls import path

from core.views import (
    admin_login,
    availability,
    cancel_admin_appointment,
    create_appointment,
    delete_admin_appointment,
    health_check,
    list_admin_appointments,
    list_services,
    update_admin_appointment_status,
)

app_name = "core"

urlpatterns = [
    path("health/", health_check, name="health"),
    path("services/", list_services, name="services"),
    path("availability/", availability, name="availability"),
    path("appointments/", create_appointment, name="appointments"),
    path("admin/login/", admin_login, name="admin-login"),
    path("admin/appointments/", list_admin_appointments, name="admin-appointments"),
    path(
        "admin/appointments/<uuid:appointment_id>/status/",
        update_admin_appointment_status,
        name="admin-appointment-status",
    ),
    path(
        "admin/appointments/<uuid:appointment_id>/cancel/",
        cancel_admin_appointment,
        name="admin-appointment-cancel",
    ),
    path(
        "admin/appointments/<uuid:appointment_id>/",
        delete_admin_appointment,
        name="admin-appointment-delete",
    ),
]
