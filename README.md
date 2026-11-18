# ConectaTI Senac

Sistema de chamados com backend Spring Boot e frontends React/Vite.

## Requisitos

- Java 17+
- Node.js 20+
- Docker

## Rodar o backend localmente

```powershell
cd backend/conectati-api/conectati-api
docker compose up -d
.\gradlew.bat bootRun
```

O `bootRun` usa o perfil `local`, com segredo de token exclusivo para desenvolvimento. A API fica em `http://localhost:8080`.

Swagger fica desligado por padrão. Para ativá-lo localmente, defina `SWAGGER_ENABLED=true`; a interface fica em `/swagger-ui/index.html`.

## Configuração de produção

O Docker ativa o perfil `production`. Configure no serviço da API:

- `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`: conexão PostgreSQL.
- `APP_AUTH_TOKEN_SECRET`: segredo privado com pelo menos 32 bytes. A aplicação falha ao iniciar se estiver ausente, curto ou igual ao segredo público de desenvolvimento.
- `APP_CORS_ALLOWED_ORIGINS`: origens exatas, separadas por vírgula e sem curingas, por exemplo `https://seu-front.vercel.app`.
- `APP_DEMO_DATA_ENABLED` (opcional, padrão `false`): habilita os dados e usuários de demonstração.
- `SWAGGER_ENABLED` (opcional, padrão `false`): habilita Swagger/OpenAPI.
- `SERVER_SERVLET_CONTEXT_PATH` (opcional): prefixo da API, como `/api`; vazio por padrão.

Com `APP_DEMO_DATA_ENABLED=false`, um banco novo não tem usuários. Para criar o primeiro administrador sem endpoint público de cadastro, habilite `APP_DEMO_DATA_ENABLED=true` temporariamente, inicialize a API uma vez e use `admin@conectati.local` / `Admin@123` para entrar. Em seguida, crie ou ajuste as credenciais administrativas necessárias e desative a flag. Os quatro usuários demo só são criados com essa flag ativa; mantenha-a desligada em operação normal.

As contas de demonstração são:

- Administrador: `admin@conectati.local` / `Admin@123`
- Instrutor: `instrutor@conectati.local` / `Instrutor@123`
- Técnico: `tecnico@conectati.local` / `Tecnico@123`
- Coordenador: `coordenador@conectati.local` / `Coordenador@123`

## Aplicativos

O projeto tem três aplicativos separados:

- **Web** — `frontend/web-chamados/conectati-senac-react`: para coordenação, instrutores e administração. É o frontend publicado pela Vercel.
- **Mobile de suporte** — `frontend/mobile-sup`: aplicativo Expo/React Native independente para a equipe de suporte.
- **Desktop** — `frontend/desktop/ConectaTI Senac`: aplicativo Electron para administração.

### Web

```powershell
cd frontend/web-chamados/conectati-senac-react
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

O servidor local usa a porta `5173`. `.env.example` mostra `http://localhost:3000`; se estiver rodando o backend Spring local deste repositório, ajuste `VITE_API_URL` em `.env` para `http://localhost:8080`.

### Mobile de suporte

```powershell
cd frontend/mobile-sup
npm.cmd install
npm.cmd start
```

### Desktop

```powershell
cd "frontend/desktop/ConectaTI Senac"
npm.cmd install
npm.cmd start
```

## Testes e build

```powershell
cd backend/conectati-api/conectati-api
.\gradlew.bat test
.\gradlew.bat clean build
```

Os testes usam H2 em memória e não precisam de PostgreSQL.
