# Auditoria frontend — ConectaTI Senac

> **Estado:** a análise detalhada abaixo é histórica (4 de novembro de 2026) e foi superada pela reauditoria de 9 de novembro de 2026. Consulte primeiro a seção “Reauditoria atual”; os defeitos antigos não devem ser tratados como estado atual.

## Reauditoria atual — 9 de novembro de 2026 (12:21 UTC)

- O JavaScript do desktop passa em `node --check` e o fluxo de login mockado termina em `/admin.html`.
- Playwright percorreu 198 combinações de página e viewport: zero erros de página/console, zero requisições com falha, zero overflow horizontal e zero alvos pequenos nas larguras de 360 a 820px.
- axe-core percorreu as 22 páginas do desktop a 390px e 1440px e encontrou zero violações WCAG nas regras executadas. A coleta complementar foi feita pelo `auditoria/supplement.cjs`.
- Não foram detectados campos abaixo de 16px entre 360 e 820px. O teste de orientação reportou largura documental igual à viewport em retrato (390px) e paisagem (844px).
- O app web-mobile e a API compilam; o lint mobile conclui sem erros, com seis avisos preexistentes de Fast Refresh.
- A auditoria do desktop usa fixtures HTTP e não prova a disponibilidade da API publicada. O fluxo mobile de suporte foi compilado e ligado aos endpoints existentes, mas ainda precisa de validação integrada com API e banco ativos. O Lighthouse continuou sem coletar métricas porque não conseguiu conectar ao Chrome DevTools nesta máquina.

O restante deste arquivo preserva a primeira análise para contexto, não como lista vigente de defeitos.

## 1. Resumo executivo

- **Nota geral: 2/10.** O bloqueio principal é erro de sintaxe que impede o JavaScript desktop de executar.
- Foram capturadas 171 combinações tela × viewport e 171 screenshots full-page.
- 81/171 combinações tiveram overflow horizontal; todos os arquivos HTML que carregam o script registraram erro JavaScript.
- O login não completou; outras ações dependentes de JavaScript não são confiáveis até corrigir o parse.
- axe identificou problemas de contraste e nomes acessíveis; Lighthouse não conectou ao Chrome DevTools.
- WEB-MOBILE é um app React/TanStack em rotas; DESKTOP é um conjunto de páginas HTML/CSS/JS separado, com CSS de aviso em telas menores.
- As rotas React não foram renderizadas: dependências do app não instaladas; isso limita comparação visual e teste funcional direto.

## 2. Mapeamento do projeto

### Como são entregues as experiências

- **DESKTOP:** `frontend/desktop/ConectaTI Senac/` contém páginas HTML separadas, uma folha local `css/style.css` e scripts `js/api.js` e `js/script.js`. A regra `@media (max-width: 768px)` na linha 900 de `style.css` acrescenta aviso para acessar a versão Mobile; a estrutura desktop permanece com sidebar de 250px e margem equivalente. As páginas não são a mesma SPA responsiva.
- **WEB-MOBILE:** `frontend/web-mobile/conectati-senac-react (1)/` contém app React 19 + TanStack Router/Start, Vite e rotas em `src/routes/`; `src/routeTree.gen.ts` declara /, /admin, /chamados, /dashboard, /equipamentos, /home, /login, /mapa-salas, /minhas-turmas, /novo-chamado, /relatorios, /unidades, /usuarios. É uma experiência separada. O diretório `public/` também contém HTML/CSS/JS estático; ele não substitui as rotas React.

### Telas e rotas

- DESKTOP — acompanhar-chamado, auditoria, categorias, chamados, chat, configuracoes, criar-unidade, criar-usuario, dashboard, duvidas-frequentes, equipamentos, gerenciar-chamado, index, login, manutencao, novo-chamado, relatorios, unidades, usuarios. `configuracoes.html` redireciona para `auditoria.html`; `manutencao.html` redireciona para `gerenciar-chamado.html`. `index.html` é tela de entrada/atalho; `login.html` autentica.
- WEB-MOBILE — /, /admin, /chamados, /dashboard, /equipamentos, /home, /login, /mapa-salas, /minhas-turmas, /novo-chamado, /relatorios, /unidades, /usuarios. A rota `/` redireciona para `/home`.
- Componentes de produto WEB-MOBILE: AppLayout, Sidebar.
- Componentes UI WEB-MOBILE: accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group, toggle, tooltip (base Radix/shadcn/Tailwind). Hook: `src/hooks/use-mobile.tsx`. Serviços e estado: `src/services/{api,conectati,session}.ts`, `src/lib/conectati/{data,permissions,store}.ts`.

### Componentes, arquivos CSS/JS e dependências

- DESKTOP: CSS `css/style.css`; JS `js/api.js`, `js/script.js`; logo raster `assets/logo-senac.png`; ícones são em grande parte SVG inline. Várias páginas referenciam Google Fonts (Inter); API remota está codificada em `js/api.js` (`conectati-api.onrender.com`). Não foi encontrada biblioteca CDN de ícones.
- WEB-MOBILE: CSS `src/styles.css` + `public/css/style.css`; código de UI em TSX (componentes acima); ícones `lucide-react`, gráficos `recharts`, React Hook Form/Zod e TanStack Query; dependências são npm, não CDN de runtime evidenciada na estrutura. `public/js/api.js` e `public/js/script.js` pertencem ao conjunto estático público.
- Fluxos identificados no código: login → home/dashboard; menu por papel; chamados → novo chamado → acompanhamento/gerenciamento; equipamentos; relatórios; usuários/unidades/admin; mapa de salas/minhas turmas no WEB-MOBILE; chat/dúvidas/auditoria no DESKTOP. Formulários e ações principais dependem do `js/script.js` no Desktop.

### Escopo/ambiente

Playwright em Chrome instalado, servidor estático local e API interceptada com fixtures; não foi chamado backend. Screenshots e resultados pertencem à execução atual do Desktop estático. WEB-MOBILE não foi iniciado por falta de `node_modules`; não instalamos dependências fora de `auditoria/`.

## 3. Resultados de responsividade

Legenda: **JS** = erro de parse na consola; **H** = scrollWidth > clientWidth; **JS+H** = ambos. A matriz dá o resultado medido por tela e largura (resoluções definidas no cabeçalho). `H` não significa automaticamente conteúdo ilegível; o overflow foi medido e a imagem da tela serve para interpretação visual.

| Tela HTML (desktop estático) | 360 | 375 | 390 | 414 | 768 | 820 | 1280 | 1440 | 1920 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| acompanhar-chamado.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| auditoria.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| categorias.html | JS+H | JS+H | JS+H | JS+H | JS+H | JS+H | JS | JS | JS |
| chamados.html | JS+H | JS+H | JS+H | JS+H | JS+H | JS+H | JS | JS | JS |
| chat.html | JS+H | JS+H | JS+H | JS+H | JS | JS+H | JS | JS | JS |
| configuracoes.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| criar-unidade.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| criar-usuario.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| dashboard.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| duvidas-frequentes.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| equipamentos.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| gerenciar-chamado.html | JS+H | JS+H | JS+H | JS+H | JS+H | JS+H | JS | JS | JS |
| index.html | JS | JS | JS | JS | JS | JS | JS | JS | JS |
| login.html | JS | JS | JS | JS | JS | JS | JS | JS | JS |
| manutencao.html | JS+H | JS+H | JS+H | JS+H | JS+H | JS+H | JS | JS | JS |
| novo-chamado.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| relatorios.html | JS+H | JS+H | JS+H | JS+H | JS | JS | JS | JS | JS |
| unidades.html | JS+H | JS+H | JS+H | JS+H | JS+H | JS+H | JS | JS | JS |
| usuarios.html | JS+H | JS+H | JS+H | JS+H | JS+H | JS+H | JS | JS | JS |

- Tela × viewport: 360×640, 375×667, 390×844, 414×896, 768×1024, 820×1180, 1280×720, 1440×900 e 1920×1080.
- Retrato/paisagem, dashboard: [{"orientation":"portrait","width":390,"height":844,"scrollWidth":577,"clientWidth":390},{"orientation":"landscape","width":844,"height":390,"scrollWidth":844,"clientWidth":844}].
- Alvos de toque menores que 44×44 a 390px: 272 medições somadas em 19 telas; inputs abaixo de 16px: 50. A contagem de alvos é por elemento e exige revisão visual para diferenciar ícone decorativo de controle clicável.
- Overflow em imagens/vídeos: 0 medições acima dos limites dos contêineres. Elementos interativos com interseção geométrica heurística: 0; elementos com borda direita fora da viewport: 2745. Estes dois últimos são sinais para inspeção, não confirmação semântica de sobreposição/corte.
- Nenhuma requisição de recurso falhou ou retornou 4xx/5xx nas visitas locais observadas (0 registros). A API foi mockada e não valida disponibilidade do backend real.

Screenshots: `auditoria/screenshots/<tela>_<largura>.png`, por exemplo `auditoria/screenshots/dashboard_390.png`. Foram geradas capturas para 19 páginas × 9 larguras.

## 4. Resultados de paridade WEB-MOBILE x DESKTOP

### Identidade visual

As duas experiências parecem parte do mesmo produto pelo nome ConectaTI/Senac e escopo. A implementação visual, porém, diverge: Desktop declara Inter, roxo `#6C63FF`, gradiente roxo/coral, bordas de 16px e tema escuro padrão; WEB-MOBILE usa tokens Tailwind/shadcn em oklch, neutros claros/escuros e radius base de 10px, além de ícones Lucide em React. **Similaridade visual: 3/10** (comparação de código; app React não renderizado nesta auditoria). As animações/componentes e comportamento de navegação não puderam ser comparados em execução.

### Cobertura de telas

| Área/tela | WEB-MOBILE | DESKTOP | Diferença observada | Gravidade |
|---|---|---|---|---|
| Login e início | `/login`, `/home`, `/` | `login.html`, `index.html` | Rotas e casca diferentes; login Desktop não executou JS | Alta |
| Dashboard | `/dashboard` | `dashboard.html` | Mesmo propósito; componentes e estilo distintos | Alta |
| Chamados / novo | `/chamados`, `/novo-chamado` | `chamados.html`, `novo-chamado.html` | Núcleo comum; comportamento desktop bloqueado pelo parse | Alta |
| Equipamentos / relatórios | `/equipamentos`, `/relatorios` | `equipamentos.html`, `relatorios.html` | Presentes em ambas; estilos diferentes | Média |
| Usuários / unidades | `/usuarios`, `/unidades` | `usuarios.html`, `unidades.html`, telas criar-* | Desktop tem telas de criação separadas | Média |
| Admin / categorias | `/admin` | `categorias.html`, `criar-usuario.html`, `criar-unidade.html` | Não há mapeamento 1:1 verificável | Alta |
| Salas e turmas | `/mapa-salas`, `/minhas-turmas` | — | Exclusivo WEB-MOBILE | Média |
| Chat, acompanhar e dúvidas | — | `chat.html`, `acompanhar-chamado.html`, `duvidas-frequentes.html` | Exclusivo DESKTOP | Média |
| Auditoria/configuração e manutenção | — | `auditoria.html`, aliases `configuracoes.html`/`manutencao.html` | Exclusivo DESKTOP; aliases fazem redirect | Baixa |

- **Paridade funcional: 2/10.** Há núcleo de fluxos equivalente, mas funções exclusivas e diferenças de navegação/perfil; além disso, a experiência desktop não passou do carregamento JavaScript. WEB-MOBILE ficou sem teste dinâmico, então esta nota se apoia no inventário de rotas e não em teste comparativo completo.

## 5. Acessibilidade e performance

### axe-core (HTML estático Desktop)

Foram analisadas 17 páginas em 390px e 1440px; os dois arquivos de redirecionamento perdem o contexto antes da injeção do axe. Achados somados entre larguras:

- **color-contrast (serious)**: 17 páginas, 585 nós somando as duas larguras; contagens duplicam achados vistos nos dois viewports.
- **select-name (critical)**: 8 páginas, 24 nós somando as duas larguras; contagens duplicam achados vistos nos dois viewports.
- **label (critical)**: 1 páginas, 2 nós somando as duas larguras; contagens duplicam achados vistos nos dois viewports.
- **meta-viewport (moderate)**: 6 páginas, 12 nós somando as duas larguras; contagens duplicam achados vistos nos dois viewports.
- **scrollable-region-focusable (serious)**: 1 páginas, 1 nós somando as duas larguras; contagens duplicam achados vistos nos dois viewports.

Além disso, inspeção geométrica apontou alvos menores e inputs com tipografia abaixo de 16px. A sequência de foco via Tab no login foi Tema → e-mail → senha → perfil → unidade → Entrar, retornando ao início; o link lateral Chamados navegou para /chamados.html. O submit do login, por outro lado, permaneceu em /login.html por causa do erro de parse. Evidência adicional: fluxos-resultados.json.

### Lighthouse

- Lighthouse mobile: **não executado** — Failed to fetch browser webSocket URL from http://127.0.0.1:9222/json/version: fetch failed
- Lighthouse desktop: **não executado** — Failed to fetch browser webSocket URL from http://127.0.0.1:9222/json/version: fetch failed

## 6. Bugs encontrados

### QA-01 — JavaScript Desktop não faz parse (Crítica)

- **Tela:** todas que incluem `js/script.js`; observada em todas as larguras testadas.
- **Passos:** abrir login ou dashboard pelo servidor estático; observar console. Resultado: `Unexpected token '}'`. `node --check` aponta `frontend/desktop/ConectaTI Senac/js/script.js:206`.
- **Evidência:** `auditoria/resultados.json` (171 pageerrors); `auditoria/screenshots/login_390.png` e `dashboard_390.png`.
- **Efeito verificado:** o formulário de login com email/senha preenchidos e POST de API mockado não navegou e permaneceu em `/login.html`; funções onsubmit/toggleTheme e init deixam de ser definidas.

### QA-02 — Conteúdo desktop excede a largura disponível (Alta)

- **Tela/viewport:** 81/171 combinações; em todas as telas com overflow, as larguras mais afetadas são 360–414px; tabelas também excedem em algumas telas a 768/820px. Em `dashboard.html` a 390px: 577px de largura documental para viewport 390px.
- **Passos:** abrir `dashboard.html` com viewport 390×844 e consultar `documentElement.scrollWidth`; rolar horizontalmente.
- **Evidência:** `auditoria/screenshots/dashboard_390.png`; matriz na seção 3 e `resultados.json`.
- **Arquivo provável:** `css/style.css:33, 68-78, 241-250, 891-920` (sidebar fixa e regra mobile só adiciona aviso/top margin).

### QA-03 — Contraste, nomes acessíveis e zoom (Alta)

- **Telas:** contraste detectado em 17 páginas; `select-name` em 8, `label` em 1; meta viewport em 6; chat tem `scrollable-region-focusable`.
- **Passos:** axe por página nas larguras 390 e 1440; reproduzir alvos no `axe-resultados.json`.
- **Evidência:** `auditoria/axe-resultados.json`; `login.html:5` restringe viewport via `maximum-scale=1.0`.
- **Arquivos prováveis:** HTMLs de formulário e `css/style.css` tokens/estados de cor. Gravidade reportada pelo axe: critical para nome de select/label, serious para contraste/região de rolagem, moderate para meta viewport.

### QA-04 — Controles pequenos em viewport mobile (Média)

- **Tela/viewport:** formulários e menus em 390×844; 272 elementos medidos abaixo de 44×44 e 50 campos com fonte <16px no agregado por página.
- **Passos:** rodar `auditoria/run-audit.cjs` e consultar `touchSmall`/`smallInputs` em `resultados.json`; comparar screenshots mobile.
- **Evidência:** `auditoria/screenshots/criar-usuario_390.png`, `novo-chamado_390.png`, `dashboard_390.png`.
- **Arquivo provável:** `css/style.css:143-155, 347-350` e estilos de formulário.

### QA-05 — Renderização e Lighthouse do WEB-MOBILE não verificados (Suspeita/limitação)

- **Tela:** todas as 13 rotas React.
- **Motivo:** `node_modules` ausente e não foi permitido gravar build/dependências na pasta do projeto. O erro do Lighthouse em conexão CDP impediu suas notas. Não é um defeito funcional confirmado.
- **Evidência:** `frontend/web-mobile/conectati-senac-react (1)/package.json`, ausência de `node_modules`; `lighthouse-resultados.json`.

## 7. Sugestões de melhoria priorizadas

### MEL-01 — Remover o erro de sintaxe que interrompe todo o JavaScript desktop

- **Problema (evidência):** O Playwright registrou “Unexpected token }” em 171/171 visitas (todas as páginas e viewports). `node --check` aponta `js/script.js:206`, onde há uma chave de fechamento sobrando depois de `verificarPermissoes()`. O login submetido com API mockada continuou em `/login.html` porque `validarLogin` não foi definido.
- **Arquivos afetados:** frontend/desktop/ConectaTI Senac/js/script.js:206 (chave extra); frontend/desktop/ConectaTI Senac/login.html (onsubmit); frontend/desktop/ConectaTI Senac/dashboard.html.
- **Correção proposta:** Remover somente a chave de fechamento excedente e validar o parse de `script.js` antes de servir a aplicação. Confirmar que as funções do script carregam antes dos fluxos.
- **Critério de aceite:** `node --check js/script.js` termina sem erro; login com API mockada navega ao destino do perfil; consola sem `pageerror` nas telas principais.
- **Esforço:** P | **Impacto:** Alto
- **Riscos/efeitos colaterais:** Uma chave removida do bloco errado pode deixar a função aberta; validar escopo e executar checagem sintática.

### MEL-02 — Eliminar overflow horizontal nas larguras de celular e tablet

- **Problema (evidência):** Foi observado 81/171 verificações com scrollWidth > clientWidth; no dashboard a 390 px o documento mede 577px para viewport de 390px. A folha mantém sidebar e margem do conteúdo de desktop e mostra apenas uma faixa “acesse a versão Mobile”. Evidência: auditoria/screenshots/dashboard_390.png (caminho correto: screenshots/dashboard_390.png).
- **Arquivos afetados:** frontend/desktop/ConectaTI Senac/css/style.css:33, 68-78, 241-250, 891-920; telas HTML com `.sidebar` e `.main-content`.
- **Correção proposta:** Definir comportamento mobile explícito: recolher/transformar sidebar em navegação acessível, remover margem fixa de conteúdo e permitir que tabelas/cartões se ajustem ao contêiner. Manter a faixa apenas se a decisão de produto for bloquear o uso mobile da versão web.
- **Critério de aceite:** Em 360/375/390/414/768/820 px, `documentElement.scrollWidth <= clientWidth`; verificar screenshots de todas as telas, sem conteúdo cortado.
- **Esforço:** M | **Impacto:** Alto
- **Riscos/efeitos colaterais:** Refluxo do menu e tabelas, precisa conferir teclado e navegação em paisagem.

### MEL-03 — Aumentar alvos de toque e tamanho dos campos

- **Problema (evidência):** A 390px, a verificação geométrica encontrou 272 elementos interativos menores que 44×44 px somando todas as telas, e 50 inputs/selects/textarea com fonte abaixo de 16px. A regra btn-sm usa fonte 0.75rem (style.css:347-350); login.html contém inputs pequenos.
- **Arquivos afetados:** frontend/desktop/ConectaTI Senac/css/style.css:143-155, 347-350 e regras de formulário; HTMLs dos formulários, especialmente login.html, criar-usuario.html, criar-unidade.html, novo-chamado.html.
- **Correção proposta:** Definir altura/largura mínima de 44px para alvos clicáveis sem ampliar ícones decorativos, e `font-size:16px` para inputs/selects/textarea em viewport mobile. Preservar espaçamento para alvos adjacentes.
- **Critério de aceite:** Relatório Playwright mostra zero alvos interativos abaixo de 44×44 px e zero campos abaixo de 16px em 360–414 px; validar zoom nativo e layout.
- **Esforço:** M | **Impacto:** Alto
- **Riscos/efeitos colaterais:** Botões maiores podem aumentar a altura dos formulários e exigir mais rolagem.

### MEL-04 — Corrigir achados de acessibilidade de contraste, nomes e zoom

- **Problema (evidência):** axe-core em 17 HTMLs (390 e 1440px) encontrou falhas serious de contraste, nomes acessíveis ausentes em selects e label, além de meta viewport que limita zoom. A origem de cada nó está em auditoria/axe-resultados.json. Login usa `maximum-scale=1.0` no meta viewport (login.html:5).
- **Arquivos afetados:** frontend/desktop/ConectaTI Senac/css/style.css (tokens e estados de texto); HTMLs com selects sem nome associado, label/aria; login.html:5 e demais meta viewport.
- **Correção proposta:** Ajustar combinações de cor ao contraste WCAG AA; associar cada select a `<label for>` ou `aria-label`; remover limite de escala do viewport e manter zoom do usuário.
- **Critério de aceite:** axe sem violações de contraste/label/select-name/meta-viewport nas 17 páginas auditadas e teste de zoom manual sem bloqueio.
- **Esforço:** M | **Impacto:** Alto
- **Riscos/efeitos colaterais:** Mudanças de cor podem alterar hierarquia visual; manter estados e identidade ConectaTI.

### MEL-05 — Definir e fechar a paridade funcional entre WEB-MOBILE e DESKTOP

- **Problema (evidência):** As experiências são implementadas separadamente e têm telas exclusivas: WEB-MOBILE inclui mapa de salas, minhas turmas e admin; DESKTOP inclui categorias, chat, acompanhar chamado, dúvidas, auditoria/configurações, manutenção e telas de criação administrativa. Não há evidência de paridade para esses fluxos; o web-mobile não pôde ser renderizado neste ambiente por falta de dependências locais.
- **Arquivos afetados:** frontend/web-mobile/conectati-senac-react (1)/src/routes/*.tsx; frontend/desktop/ConectaTI Senac/*.html; navegação em `src/components/conectati/Sidebar.tsx` e `.sidebar-nav`.
- **Correção proposta:** Criar uma matriz produto aprovada de funcionalidades por perfil e plataforma. Para cada item exclusivo, marcar explicitamente “exclusivo” ou implementar tela/fluxo equivalente na outra plataforma; sincronizar rótulos e navegação.
- **Critério de aceite:** Toda função central tem estado documentado em ambas as plataformas; cada diferença intencional está listada; fluxos prioritários validados em browser nas duas versões.
- **Esforço:** G | **Impacto:** Alto
- **Riscos/efeitos colaterais:** Ampliar escopo pode duplicar funções ou divergir regras de autorização; validar com produto/backend.

### MEL-06 — Tornar o conjunto de testes reproduzível e executar o app React em auditorias

- **Problema (evidência):** O web-mobile não tem `node_modules` e seu Vite/TanStack não pôde ser iniciado sem gravar dependências/build fora de auditoria/. Lighthouse também não produziu scores: falhou ao conectar ao endpoint Chrome DevTools 127.0.0.1:9222. Assim, a paridade visual e performance do app React permanecem não confirmadas.
- **Arquivos afetados:** frontend/web-mobile/conectati-senac-react (1)/package.json; auditoria/run-audit.cjs; auditoria/supplement.cjs.
- **Correção proposta:** Em ambiente de CI ou checkout isolado, instalar dependências do web-mobile, iniciar Vite em servidor estático/de desenvolvimento e configurar Playwright/Lighthouse para usar o binário Chrome com porta DevTools disponível; guardar relatórios e screenshots em auditoria.
- **Critério de aceite:** Testes abrem as 13 rotas React nos nove viewports, capturam console/rede/axe e Lighthouse gera categorias mobile e desktop com números reproduzíveis.
- **Esforço:** M | **Impacto:** Médio
- **Riscos/efeitos colaterais:** Dependências, SSR/servidor TanStack e versão do Chrome podem exigir configuração de CI.
