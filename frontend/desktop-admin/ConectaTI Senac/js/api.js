/* ============================================================
 * Cliente da API ConectaTI.
 * Autenticação: token opaco via header "Authorization: Bearer <token>".
 * Sessão local: localStorage["sessaoConectaTI"] = { usuario, token, tipoToken }.
 * Endpoints usados aqui EXISTEM no backend (Spring Boot):
 *   POST /auth/login
 *   GET  /dashboard       (autenticado; escopo calculado no backend)
 *   GET  /chamados        (backend já devolve só o que o perfil pode ver)
 *   POST /chamados        (criar chamado)
 *   PATCH /chamados/{id}/assumir e /status   (TECNICO no backend)
 *   GET  /equipamentos    (ADMINISTRADOR, COORDENADOR, TECNICO; INSTRUTOR recebe 403)
 *   GET  /categorias e /salas
 *   GET/POST /chat/chamados/{chamadoId}/mensagens   (ADMIN recebe 403)
 * Os dados de usuarios, unidades, salas de estudo (mapa), turmas e
 * solicitacoes sao LOCAIS (mesmo modelo do web-mobile) — ver js/script.js.
 * ============================================================ */

const ConectaTIAPI = (() => {
    // Defina window.CONECTATI_API_URL pela configuração do ambiente antes deste script.
    const apiUrl = window.CONECTATI_API_URL;
    const baseUrl = apiUrl ? apiUrl.replace(/\/$/, '') : '';
    const CHAVE_SESSAO = 'sessaoConectaTI';

    function getSessao() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null');
        } catch {
            return null;
        }
    }

    function salvarSessao(sessao) {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    }

    /* Igual ao clearSession do web-mobile: remove só a sessão.
     * As chaves antigas do tema/dados simulados são limpas por higiene. */
    function limparSessao() {
        localStorage.removeItem(CHAVE_SESSAO);
        localStorage.removeItem('unidadeUsuario');
        localStorage.removeItem('theme');
        localStorage.removeItem('chamadosConectaTI');
        localStorage.removeItem('equipamentosConectaTI');
    }

    function estaAutenticado() {
        return Boolean(getSessao()?.token);
    }

    /* Sessão inválida/expirada: limpa tudo e volta ao login.
     * Evita redirecionamento em loop quando já estamos no login/index. */
    function encerrarSessaoLocal() {
        const pagina = window.location.pathname.split('/').pop();
        limparSessao();
        if (pagina !== 'login.html' && pagina !== 'index.html' && pagina !== '') {
            window.location.replace('login.html');
        }
    }

    async function request(path, options = {}) {
        if (!baseUrl) {
            throw new Error('Configure window.CONECTATI_API_URL para conectar à API ConectaTI.');
        }

        const sessao = getSessao();
        const authHeader = sessao?.token
            ? { Authorization: `${sessao.tipoToken || 'Bearer'} ${sessao.token}` }
            : {};

        let response;

        try {
            response = await fetch(`${baseUrl}${path}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader,
                    ...(options.headers || {})
                },
                ...options
            });
        } catch {
            throw new Error('Não foi possível conectar à API. Verifique sua conexão e tente novamente.');
        }

        if (response.status === 204) return null;

        const body = await response.json().catch(() => null);

        if (!response.ok) {
            /* 401: token ausente, inválido ou expirado -> sessão encerrada no servidor;
             * sai daqui mesmo (fail-closed) e volta ao login uma única vez. */
            if (response.status === 401) {
                encerrarSessaoLocal();
                throw new Error('Sua sessão expirou. Faça login novamente.');
            }
            /* 403 e demais erros: usa a mensagem estável do backend
             * (mesmo formato do GlobalExceptionHandler). */
            throw new Error(
                body?.message ||
                body?.errors?.[0]?.defaultMessage ||
                'Não foi possível concluir a operação.'
            );
        }

        return body;
    }

    return {
        getSessao,
        salvarSessao,
        limparSessao,
        estaAutenticado,
        encerrarSessaoLocal,

        login: (email, senha) =>
            request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha })
            }),

        /* Indicadores do dashboard (escopo do perfil calculado no backend). */
        obterDashboard: () => request('/dashboard'),

        listarChamados: () => request('/chamados'),

        criarChamado: (dados) =>
            request('/chamados', {
                method: 'POST',
                body: JSON.stringify(dados)
            }),

        assumirChamado: (id) =>
            request(`/chamados/${encodeURIComponent(id)}/assumir`, {
                method: 'PATCH'
            }),

        /* Body: { status, solucao?, justificativaCancelamento? } */
        atualizarStatusChamado: (id, corpo) =>
            request(`/chamados/${encodeURIComponent(id)}/status`, {
                method: 'PATCH',
                body: JSON.stringify(corpo)
            }),

        listarEquipamentos: () => request('/equipamentos'),

        listarCategorias: () => request('/categorias'),

        listarSalas: () => request('/salas'),

        /* Chat real por chamado (solicitante <-> tecnico). */
        listarMensagens: (chamadoId) =>
            request(`/chat/chamados/${encodeURIComponent(chamadoId)}/mensagens`),

        enviarMensagem: (chamadoId, mensagem) =>
            request(`/chat/chamados/${encodeURIComponent(chamadoId)}/mensagens`, {
                method: 'POST',
                body: JSON.stringify({ mensagem })
            })
    };
})();
