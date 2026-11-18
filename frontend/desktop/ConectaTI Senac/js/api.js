/* Cliente da API ConectaTI. */
const ConectaTIAPI = (() => {
    const baseUrl = 'https://conectati-api.onrender.com';

    async function request(path, options = {}) {
        const sessao = JSON.parse(localStorage.getItem('sessaoConectaTI') || 'null');
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
            throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.');
        }

        if (response.status === 204) return null;

        const body = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                body?.message ||
                body?.errors?.[0]?.defaultMessage ||
                'Não foi possível concluir a operação.'
            );
        }

        return body;
    }

    return {
        login: (email, senha, signal) =>
            request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
                signal
            }),

        listarUsuarios: () => request('/usuarios'),

        criarUsuario: (usuario) =>
            request('/usuarios', {
                method: 'POST',
                body: JSON.stringify(usuario)
            }),

        atualizarUsuario: (id, usuario) =>
            request(`/usuarios/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: JSON.stringify(usuario)
            }),

        excluirUsuario: (id) =>
            request(`/usuarios/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            })
    };
})();