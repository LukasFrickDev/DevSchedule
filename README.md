# DevSchedule

Aplicação web de agendamento de serviços desenvolvida para o desafio técnico do DevClub.

O sistema possui duas áreas:

- Área do cliente: consulta serviços, verifica horários disponíveis e realiza agendamentos.
- Área administrativa: visualiza e gerencia os agendamentos realizados.

## Demonstração

- Frontend: https://projetolukasfrick-devschedule.vercel.app/
- Backend: https://devschedule-api.onrender.com/
- Health check: https://devschedule-api.onrender.com/api/devschedule/health/
- Repositório: https://github.com/LukasFrickDev/DevSchedule

## Funcionalidades

### Área do cliente

- Listagem de serviços disponíveis.
- Seleção de data por calendário customizado.
- Consulta de horários disponíveis.
- Agenda global compartilhada e bloqueio de horários ocupados.
- Cadastro de nome completo e telefone.
- Revisão dos dados, criação de agendamento e código de confirmação.
- Tratamento de conflito de horário.
- Estados de carregamento, erro e vazio.
- Interface responsiva.

### Área administrativa

- Login com autenticação JWT.
- Listagem, filtros por data, serviço e status e ordenação cronológica.
- Indicadores de total, agendados, confirmados, concluídos e cancelados.
- Paginação com opções de 10, 25, 50 e 100 registros e botão “Ver mais”.
- Alteração de status, cancelamento e exclusão de agendamentos.
- Confirmação para ações sensíveis e logout com remoção dos tokens da sessão.
- Tabela para desktop e cards para dispositivos móveis.

## Regras de negócio

- Os serviços funcionam de segunda a sexta-feira, das `09:00` às `17:00`.
- Todos os serviços possuem duração de 60 minutos.
- A agenda é global e compartilhada: um horário ocupado fica indisponível para todos os serviços.
- Agendamentos `SCHEDULED`, `CONFIRMED` e `COMPLETED` ocupam o horário; `CANCELLED` o libera.
- O cancelamento preserva o histórico e a exclusão remove o registro definitivamente.
- Datas são exibidas como `DD/MM/YYYY`; a API utiliza `DD-MM-YYYY`.

## Tecnologias utilizadas

### Frontend

- React, TypeScript, Vite e React Router.
- Styled Components e TanStack Query.
- React Testing Library, Vitest, ESLint e Prettier.
- Albert Sans, Aldrich e Lucide React.

### Backend

- Python, Django e Django REST Framework.
- PostgreSQL, Simple JWT, WhiteNoise e Gunicorn.
- Pytest e Ruff.

### Infraestrutura e ferramentas

- Docker, Docker Compose, Git, GitHub e Postman.
- Vercel e Render.
- Notion, ChatGPT Work e Codex integrado ao Visual Studio Code.

## Estrutura do projeto

```text
DevSchedule/
├── backend/
│   ├── config/
│   ├── core/
│   ├── build.sh
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── types.ts
│   │   └── utils/
│   ├── package.json
│   └── vercel.json
├── compose.yaml
├── render.yaml
└── README.md
```

## Pré-requisitos

- Node.js 22.12 ou superior
- Python 3.12 ou superior
- Docker Desktop
- Git

## Configuração local

### 1. Clonar o repositório

```bash
git clone https://github.com/LukasFrickDev/DevSchedule.git
cd DevSchedule
```

### 2. Iniciar o PostgreSQL

```bash
docker compose up -d db
```

Caso a porta `5432` esteja ocupada:

```bash
POSTGRES_HOST_PORT=15432 docker compose up -d db
```

No Windows PowerShell:

```powershell
$env:POSTGRES_HOST_PORT=15432
docker compose up -d db
```

### 3. Configurar o backend

```bash
python -m venv backend/.venv
```

Ative o ambiente virtual antes de instalar as dependências:

```powershell
.\backend\.venv\Scripts\Activate.ps1
```

```bash
source backend/.venv/bin/activate
```

Instalar as dependências e copiar o arquivo de ambiente:

```bash
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
```

No Windows, copie manualmente `backend/.env.example` para `backend/.env` e ajuste os valores locais.

### 4. Executar migrations e seed

```bash
python backend/manage.py migrate
python backend/manage.py seed_initial_services
```

### 5. Iniciar o backend

```bash
python backend/manage.py runserver
```

O backend estará disponível em `http://127.0.0.1:8000`.

### 6. Configurar o frontend

Criar `frontend/.env.local` com:

```env
VITE_API_URL=http://localhost:8000/api/devschedule
```

### 7. Instalar e iniciar o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Comandos disponíveis

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run test
npm run format:check
```

### Backend

```bash
cd backend
python manage.py check
python -m pytest
ruff check .
ruff format --check .
```

## Credenciais administrativas

Credenciais de demonstração:

- Usuário: `admin`
- Senha: `devschedule`

Essas credenciais existem apenas para demonstração do desafio técnico.

## API

Base: `/api/devschedule/`

### Endpoints públicos

- `GET /api/devschedule/health/`
- `GET /api/devschedule/services/`
- `GET /api/devschedule/availability/`
- `POST /api/devschedule/appointments/`

### Endpoints administrativos

- `POST /api/devschedule/admin/login/`
- `GET /api/devschedule/admin/appointments/`
- `PATCH /api/devschedule/admin/appointments/<uuid>/status/`
- `POST /api/devschedule/admin/appointments/<uuid>/cancel/`
- `DELETE /api/devschedule/admin/appointments/<uuid>/`

As requisições administrativas utilizam:

```http
Authorization: Bearer <access_token>
```

O login retorna:

```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

## Variáveis de ambiente

### Frontend local

```env
VITE_API_URL=http://localhost:8000/api/devschedule
```

### Frontend em produção

```env
VITE_API_URL=https://devschedule-api.onrender.com/api/devschedule
```

### Backend local

As variáveis estão documentadas em `backend/.env.example`.

### Backend em produção

```env
DATABASE_URL=
DJANGO_DEBUG=false
DJANGO_SECRET_KEY=
DJANGO_ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://projetolukasfrick-devschedule.vercel.app
CSRF_TRUSTED_ORIGINS=https://projetolukasfrick-devschedule.vercel.app
```

Arquivos `.env` locais não devem ser versionados.

## Deploy

### Frontend

O frontend é publicado na Vercel:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend e banco

O backend e o PostgreSQL são publicados no Render por meio de `render.yaml`.

O script de build executa:

- Instalação das dependências
- `collectstatic`
- Migrations
- Seed dos serviços iniciais

## Decisões técnicas

- React e TypeScript criam uma interface componentizada e tipada.
- Styled Components mantém os estilos próximos dos componentes.
- A estrutura utiliza componentes com `index.tsx` e `styles.ts`.
- Django REST Framework expõe a API e PostgreSQL realiza a persistência.
- A disponibilidade considera as regras de funcionamento e os agendamentos existentes.
- A agenda é global e compartilhada entre todos os serviços.
- Simple JWT realiza a autenticação administrativa.
- Access e refresh tokens ficam somente no `sessionStorage`.
- O frontend usa uma variável de ambiente para se comunicar com a API.
- O calendário é customizado para manter o padrão visual da aplicação.
- Cliente e administração permanecem separados.
- Fixtures são mantidas somente para testes de contrato e regressão.

## Uso de Inteligência Artificial

Durante o desenvolvimento foram utilizadas:

- ChatGPT Work para planejamento, decisões técnicas, organização das fases e documentação.
- Codex integrado ao Visual Studio Code para análise, implementação, refatoração e revisão de código.

A Inteligência Artificial foi utilizada como ferramenta de apoio. Todas as alterações foram revisadas, testadas manualmente e ajustadas conforme os requisitos do desafio.

## Validações realizadas

- Fluxo completo de agendamento e bloqueio de horários ocupados.
- Agenda global compartilhada e conflito de agendamento com resposta HTTP `409`.
- Cancelamento liberando horário.
- Login administrativo com JWT e logout com remoção dos tokens.
- Listagem, filtros, alteração de status, cancelamento e exclusão administrativos.
- Paginação, botão “Ver mais” e indicadores independentes da paginação.
- Responsividade em celular, tablet e desktop.
- Navegação por teclado, calendário customizado e favicon.
- Deploy do frontend e backend.

## Limitações conhecidas

- As credenciais administrativas são demonstrativas.
- O Render utiliza plano gratuito, sujeito a suspensão por inatividade.
- O PostgreSQL gratuito do Render possui limitações de retenção e disponibilidade.
- Não há notificações por e-mail, SMS ou WhatsApp.
- Não há cadastro de conta para clientes.
- Não há integração com Google Calendar ou pagamentos.

## Links

- Aplicação: https://projetolukasfrick-devschedule.vercel.app/
- API: https://devschedule-api.onrender.com/
- Health check: https://devschedule-api.onrender.com/api/devschedule/health/
- Repositório: https://github.com/LukasFrickDev/DevSchedule
