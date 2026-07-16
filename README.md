# DevSchedule

Aplicação de agendamento de serviços criada para o desafio técnico do DevClub. O projeto separa a experiência do cliente da área administrativa e utiliza um frontend React consumindo uma API REST em Django.

## Estado atual

Fase 1 — fundação do código. Neste ponto, o objetivo é garantir que frontend e backend possuam uma estrutura executável e verificável antes de implementar as regras de agendamento.

## Estrutura

```text
devschedule/
├── frontend/   # React, TypeScript e Vite
├── backend/    # Django e Django REST Framework
├── docs/       # Decisões e evidências técnicas do repositório
└── compose.yaml
```

O monorepo mantém as duas aplicações no mesmo histórico do Git, facilita a revisão do desafio e permite documentar uma única sequência de instalação.

## Pré-requisitos

- Node.js 22 ou superior
- Python 3.12 ou superior
- PostgreSQL 17 ou Docker com Compose

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Rotas iniciais:

- `/`: área do cliente
- `/admin`: área administrativa

Comandos de qualidade:

```bash
npm run lint
npm run test
npm run build
npm run format:check
```

## Backend

Primeiro, inicie o PostgreSQL local se estiver utilizando Docker:

```bash
docker compose up -d db
```

Depois, prepare a aplicação:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
python manage.py check
python manage.py runserver
```

Endpoint inicial:

- `GET /api/devschedule/health/`

Comandos de qualidade:

```bash
ruff check .
ruff format --check .
python -m pytest
```

## Decisões desta fundação

- O frontend e o backend são aplicações independentes dentro do mesmo repositório.
- A base da API é `/api/devschedule`.
- Datas simples do contrato usam `DD-MM-YYYY`; timestamps completos usam ISO 8601 com fuso.
- O PostgreSQL é configurado por variáveis de ambiente.
- Segredos e arquivos `.env` não são versionados; somente exemplos seguros entram no Git.
- As rotas ainda são shells. As funcionalidades serão adicionadas nas próximas etapas, após esta fundação passar nas validações.
