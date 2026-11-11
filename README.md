# ConectaTI Senac

Sistema de chamados de manutencao com backend Spring Boot e frontend React/Vite.

## Requisitos

- Java 17+
- Node.js 20+
- Docker

## Rodar o backend

```powershell
cd backend/conectati-api/conectati-api
docker compose up -d
$env:APP_DEMO_DATA_ENABLED = "true"
$env:SWAGGER_ENABLED = "true"
.\gradlew.bat bootRun
```

No macOS/Linux, use no mesmo diretório:

```sh
docker compose up -d
export APP_DEMO_DATA_ENABLED=true
export SWAGGER_ENABLED=true
./gradlew bootRun
```

A API fica em `http://localhost:8080`.

Swagger local: `http://localhost:8080/swagger-ui/index.html` (habilite com `SWAGGER_ENABLED=true`; fica desativado por padrão).

## Rodar o frontend

```powershell
cd "frontend/web-chamados/conectati-senac-react (1)"
npm.cmd install
npm.cmd run dev
```

O frontend fica em `http://127.0.0.1:5173`.

## Usuarios demo (somente desenvolvimento)

As contas abaixo são criadas somente quando `APP_DEMO_DATA_ENABLED=true`. Mantenha essa opção desativada em qualquer ambiente público ou de produção.

Para habilitar essas contas no ambiente local, defina `APP_DEMO_DATA_ENABLED=true` antes de iniciar o backend. O deploy Render define o valor como `false`.

- Administrador: `admin@conectati.local` / `Admin@123`
- Instrutor: `instrutor@conectati.local` / `Instrutor@123`
- Tecnico: `tecnico@conectati.local` / `Tecnico@123`
- Coordenador: `coordenador@conectati.local` / `Coordenador@123`

## Deploy gratuito para apresentação

Arquitetura sugerida para o mockup:

- **Web-mobile:** Vercel, com a raiz do projeto em `frontend/web-chamados/conectati-senac-react (1)`.
- **Desktop:** outro projeto Vercel, usando `frontend/desktop-admin/ConectaTI Senac` como raiz e sem comando de build.
- **API:** Render Free, configurada pelo `render.yaml` na raiz do repositório.
- **Postgres:** Neon Free. O arquivo `docker-compose.yml` continua sendo apenas o banco local de desenvolvimento.

### Configurar o banco Neon

Crie um projeto Postgres no Neon e mantenha host, nome do banco, usuário e senha à mão. No Render, preencha as variáveis pedidas pelo Blueprint:

- `DB_URL`: `jdbc:postgresql://HOST_DO_NEON/NOME_DO_BANCO?sslmode=require&connectTimeout=10&socketTimeout=30`
- `DB_USERNAME`: usuário informado pelo Neon.
- `DB_PASSWORD`: senha informada pelo Neon.
- `APP_AUTH_TOKEN_SECRET`: segredo aleatório com pelo menos 32 bytes, igual em todas as instâncias da API. Gere um valor novo para cada ambiente e não reutilize o segredo local.
- `APP_CORS_ALLOWED_ORIGINS`: domínios HTTPS exatos dos dois frontends, separados por vírgula e sem barra final.

Não use a URL `postgresql://...` do Neon diretamente em `DB_URL`; a aplicação espera uma URL JDBC `jdbc:postgresql://...`. Nunca coloque usuário/senha em arquivos versionados.

O Hibernate cria/atualiza as tabelas e o inicializador insere os dados de demonstração no primeiro boot quando `APP_DEMO_DATA_ENABLED=true`. Não há migrações SQL separadas neste projeto. No Render, o perfil `production` exige `APP_AUTH_TOKEN_SECRET`, mantém contas de demonstração e Swagger desativados, e assina tokens com expiração de 12 horas. Use o mesmo segredo em todas as instâncias para manter as sessões válidas entre reinicializações e réplicas.

### Publicar a API e os frontends

1. Crie o banco Neon e copie as credenciais.
2. Na Vercel, crie o projeto web-chamados apontando para `frontend/web-chamados/conectati-senac-react (1)`. Use `npm run build`; o framework TanStack Start/Nitro e o preset Vercel estão configurados no projeto.
3. Configure `VITE_API_URL` na Vercel como a URL pública do serviço Render, por exemplo `https://conectati-api.onrender.com`, nos ambientes Production e Preview. Faça um novo deploy após salvar a variável.
4. Crie outro projeto Vercel para o desktop com raiz `frontend/desktop-admin/ConectaTI Senac`, framework Other e diretório publicado `.`. O cliente usa `js/config.js`; defina `window.CONECTATI_API_URL` com a URL pública da API se o serviço tiver outro endereço.
5. Se ainda não houver serviço da API no Render, crie um Blueprint importando este repositório e preenchendo as variáveis pedidas (incluindo `APP_AUTH_TOKEN_SECRET`). Se o serviço `conectati-api` já existir, configure nele as mesmas variáveis e o health check `/actuator/health/liveness` em vez de criar outro serviço.
6. Depois de obter os dois domínios Vercel, configure `APP_CORS_ALLOWED_ORIGINS` com as origens exatas; não use `*.vercel.app`. Se alterar a variável no Render, aplique o deploy das alterações.
7. Abra primeiro a URL da API para acordar o serviço gratuito do Render e só depois apresente os frontends.

**Limitações gratuitas:** o serviço Render dorme após 15 minutos sem tráfego e pode levar cerca de um minuto para acordar. O Neon Free permite 1 GB de dados e 100 CU-horas de compute por projeto/mês e suspende o banco após cinco minutos ocioso. Faça uma chamada à API alguns minutos antes da apresentação e mantenha uma cópia local dos dados importantes.

O build do desktop é estático. O web-chamados usa SSR via Nitro; a configuração antiga de rewrite para `/rota-bloqueada` foi removida porque essa rota não existe.

## Validacao

### Builds e lint

```powershell
cd backend/conectati-api/conectati-api
.\gradlew.bat build

cd "../../../frontend/web-chamados/conectati-senac-react (1)"
npm.cmd run lint
npm.cmd run build
```

Em 9 de novembro de 2026, `gradlew build` passou, incluindo o teste existente `ConectatiApiApplicationTests.contextLoads`; o build de produção do Vite/Nitro passou; e o lint passou sem erros. O lint ainda imprime seis avisos `react-refresh/only-export-components` em componentes UI existentes. O build mobile imprime avisos do bundler/dependências, mas conclui com código zero.

### Auditoria do desktop

```powershell
node --check "frontend\desktop\ConectaTI Senac\js\script.js"
cd auditoria
node --check run-audit.cjs
node run-audit.cjs
node supplement.cjs
```

Resultados desta rodada: 22 páginas × 9 larguras (198 verificações), sem overflow horizontal, erro de console ou falha de requisição; login com API mockada navega para `/admin.html`; nenhum alvo interativo abaixo de 44px nem campo abaixo de 16px nas larguras verificadas de 360 a 820px. Retrato 390px e paisagem 844px não apresentaram overflow. axe-core não encontrou violações WCAG configuradas nas 22 páginas a 390px e 1440px. Os dados completos estão em `auditoria/resultados.json` e `auditoria/axe-resultados.json`.

O Lighthouse não produziu métricas nesta máquina: falhou ao conectar ao endpoint local do Chrome DevTools. A auditoria de interface usa fixtures/mock da API e não substitui teste integrado com Render/Postgres.

### Mudanças desta rodada

- Desktop: layout e controles ajustados para celular/tablet, inclusive alvos de toque, tamanho de campos e filtros; o script da auditoria agora procura Chrome/Chromium disponível, aceita `CHROME_PATH` e valida caminhos servidos pelo servidor local.
- Web-mobile: o perfil técnico recebe uma **Central de suporte** em Chamados, com ações para assumir e iniciar atendimento, registrar relatório técnico e concluir/cancelar chamados. Os campos e ações usam os endpoints existentes da API.
- API: tokens de sessão HMAC com expiração de 12 horas, válidos entre reinicializações/instâncias que compartilham `APP_AUTH_TOKEN_SECRET`; no perfil de produção o segredo é obrigatório. Dados demo e Swagger ficam desativados por padrão e só devem ser habilitados localmente.
- Relatórios: a análise anterior em `auditoria/RELATORIO.md` está preservada abaixo da nota de reauditoria e marcada como histórica; não use seus defeitos antigos como estado atual.

### Pontos operacionais conhecidos

- Ainda não há migrações SQL/Flyway; o Hibernate usa `ddl-auto=update`. Planeje migrações antes de tratar a API como produção crítica.
- O token é stateless: limpar a sessão no navegador não revoga o token emitido no servidor; ele pode ser aceito até expirar (12 horas). Uma futura necessidade de logout/revogação imediata pede endpoint e armazenamento de revogação.
- A fila mobile foi compilada e revisada contra os contratos do backend, mas não foi exercitada contra uma API e banco publicados. Configure `DB_URL`, usuário/senha, `APP_AUTH_TOKEN_SECRET`, `APP_CORS_ALLOWED_ORIGINS` e `VITE_API_URL` antes de validar o deploy real.
