from django.core.management.base import BaseCommand

from core.models import Service

INITIAL_SERVICES = (
    {
        "name": "Mentoria individual",
        "description": (
            "Encontro individual para esclarecer dúvidas técnicas e definir os próximos "
            "passos de estudo."
        ),
    },
    {
        "name": "Revisão de projeto",
        "description": (
            "Análise de código, estrutura e boas práticas com feedback objetivo para "
            "evolução do projeto."
        ),
    },
    {
        "name": "Orientação de carreira",
        "description": (
            "Conversa focada em currículo, portfólio, posicionamento profissional e "
            "próximos passos."
        ),
    },
)


class Command(BaseCommand):
    help = "Cria ou atualiza os três serviços iniciais do DevSchedule."

    def handle(self, *args, **options):
        for service in INITIAL_SERVICES:
            Service.objects.update_or_create(
                name=service["name"],
                defaults={
                    "description": service["description"],
                    "duration_minutes": 60,
                    "is_active": True,
                },
            )

        self.stdout.write(self.style.SUCCESS("Serviços iniciais sincronizados."))
