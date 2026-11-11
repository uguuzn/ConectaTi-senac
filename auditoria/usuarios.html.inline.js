
        let usuariosDaApi = [];
        const tiposPorFiltro = { 'Administrador': 'ADMIN', 'Instrutor': 'PROFESSOR', 'Suporte TI': 'TECNICO', 'Coordenacao': 'ALUNO' };

        function tipoLegivel(tipo) {
            return { ADMIN: 'Administrador', TECNICO: 'Técnico', PROFESSOR: 'Professor', ALUNO: 'Aluno' }[tipo] || tipo || '—';
        }

        function celula(texto) {
            const td = document.createElement('td');
            td.textContent = texto ?? '—';
            return td;
        }

        function renderizarUsuariosDaApi() {
            const tbody = document.getElementById('listaUsuarios');
            if (!tbody) return;
            const busca = document.getElementById('buscaUsuarios')?.value.trim().toLowerCase() || '';
            const tipo = document.getElementById('filtroPerfil')?.value || 'todos';
            const status = document.getElementById('filtroStatusUser')?.value || 'todos';
            const filtrados = usuariosDaApi.filter((usuario) => {
                const correspondeBusca = [usuario.nome, usuario.email].some((valor) => (valor || '').toLowerCase().includes(busca));
                const correspondeTipo = tipo === 'todos' || usuario.tipo === tiposPorFiltro[tipo];
                const correspondeStatus = status === 'todos' || (status === 'Ativo' ? usuario.ativo : !usuario.ativo);
                return correspondeBusca && correspondeTipo && correspondeStatus;
            });

            tbody.replaceChildren();
            if (!filtrados.length) {
                const linha = document.createElement('tr');
                const vazio = celula('Nenhum usuário encontrado.');
                vazio.colSpan = 6;
                linha.appendChild(vazio);
                tbody.appendChild(linha);
            } else {
                filtrados.forEach((usuario) => {
                    const linha = document.createElement('tr');
                    linha.append(celula(usuario.nome), celula(usuario.email), celula(tipoLegivel(usuario.tipo)), celula('—'), celula(usuario.ativo ? 'Ativo' : 'Inativo'), celula('—'));
                    tbody.appendChild(linha);
                });
            }
            const contador = document.getElementById('resultadoContador');
            if (contador) contador.textContent = `Mostrando ${filtrados.length} usuário${filtrados.length === 1 ? '' : 's'}`;
        }

        function filtrarUsuarios() { renderizarUsuariosDaApi(); }

        document.addEventListener('DOMContentLoaded', async () => {
            try {
                usuariosDaApi = await ConectaTIAPI.listarUsuarios();
                renderizarUsuariosDaApi();
            } catch (error) {
                const tbody = document.getElementById('listaUsuarios');
                if (tbody) {
                    tbody.replaceChildren();
                    const linha = document.createElement('tr');
                    const mensagem = celula(error.message);
                    mensagem.colSpan = 6;
                    linha.appendChild(mensagem);
                    tbody.appendChild(linha);
                }
                mostrarNotificacao(error.message, 'error');
            }
        });
    
