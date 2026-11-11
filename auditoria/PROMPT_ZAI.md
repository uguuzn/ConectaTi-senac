# Prompt para Z.ai — histórico, não executar sem revisão

> Este prompt foi gerado a partir da auditoria de 4 de novembro de 2026, antes das correções e da reauditoria. As sugestões abaixo podem estar resolvidas ou obsoletas. Consulte `RELATORIO.md` e `resultados.json` atualizados antes de usar ou pedir novas alterações.

## Contexto do projeto (5 linhas)
1. ConectaTI Senac mantém duas experiências frontend em pastas diferentes.
2. DESKTOP usa páginas HTML separadas, CSS/JS vanilla e ícones SVG inline.
3. WEB-MOBILE usa React/TanStack Router/Start, Vite, Tailwind/shadcn e componentes Lucide.
4. A auditoria está em `auditoria/RELATORIO.md`; as sugestões completas vêm abaixo.
5. Preserve a identidade visual existente e não adicione frameworks ao código vanilla desktop.

## Instruções de trabalho

Revise cada sugestão e declare **concordo**, **discordo** ou **ajusto**, com justificativa baseada nos arquivos/evidências. Faça primeiro a revisão de todas as sugestões e apresente o plano; só depois execute as aprovadas, uma por vez, em commits ou etapas pequenas. Preserve a identidade visual e o código vanilla existente, sem adicionar frameworks. Ao final, liste o que mudou e como validar cada mudança. Não execute uma sugestão que você tenha classificado como discordo.

## Sugestões priorizadas

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
