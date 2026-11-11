
        const categorias = [
            { nome: 'Reserva de notebooks', descricao: 'Solicitação de reserva de notebooks para aulas', chamados: 12, cor: 'primary', status: 'Ativa', data: '01/01/2026' },
            { nome: 'Problema com Internet', descricao: 'Falhas de conexão com a internet', chamados: 8, cor: 'danger', status: 'Ativa', data: '15/01/2026' },
            { nome: 'Projetor', descricao: 'Problemas com projetores multimídia', chamados: 6, cor: 'warning', status: 'Ativa', data: '20/01/2026' },
            { nome: 'Computador com defeito', descricao: 'Computadores com problemas de hardware', chamados: 5, cor: 'danger', status: 'Ativa', data: '25/01/2026' },
            { nome: 'Instalação de Software', descricao: 'Solicitação de instalação de programas', chamados: 4, cor: 'info', status: 'Ativa', data: '01/02/2026' },
            { nome: 'Impressora', descricao: 'Problemas com impressoras e scanners', chamados: 3, cor: 'warning', status: 'Ativa', data: '10/02/2026' },
            { nome: 'Cabo HDMI/Adaptador', descricao: 'Solicitação de cabos e adaptadores', chamados: 2, cor: 'accent', status: 'Ativa', data: '15/02/2026' },
            { nome: 'Mouse', descricao: 'Solicitação de mouses para computadores', chamados: 2, cor: 'success', status: 'Ativa', data: '20/02/2026' },
            { nome: 'Teclado', descricao: 'Solicitação de teclados para computadores', chamados: 1, cor: 'success', status: 'Ativa', data: '25/02/2026' },
            { nome: 'Outros', descricao: 'Demais solicitações não categorizadas', chamados: 2, cor: 'primary', status: 'Ativa', data: '01/03/2026' },
            { nome: 'Antiga - Redes', descricao: 'Categoria antiga de redes (desativada)', chamados: 0, cor: 'danger', status: 'Inativa', data: '10/03/2026' },
            { nome: 'Antiga - Backup', descricao: 'Categoria antiga de backup (desativada)', chamados: 0, cor: 'danger', status: 'Inativa', data: '15/03/2026' }
        ];

        function getCategoriaCor(cor) {
            const cores = {
                'primary': 'primary',
                'success': 'success',
                'warning': 'warning',
                'danger': 'danger',
                'info': 'info',
                'accent': 'accent'
            };
            return `<span class="categoria-tag ${cores[cor] || 'primary'}">● ${cor.charAt(0).toUpperCase() + cor.slice(1)}</span>`;
        }

        function getBadgeCategoria(status) {
            const classes = { 'Ativa': 'active', 'Inativa': 'inactive' };
            return `<span class="categoria-status ${classes[status] || 'inactive'}">${status}</span>`;
        }

        function exibirCategorias() {
            const tbody = document.getElementById('listaCategorias');
            const busca = document.getElementById('buscaCategorias')?.value.toLowerCase() || '';
            const status = document.getElementById('filtroStatusCategoria')?.value || 'todos';

            let filtrados = categorias.filter(c => {
                const matchBusca = c.nome.toLowerCase().includes(busca) || c.descricao.toLowerCase().includes(busca);
                const matchStatus = status === 'todos' || c.status === status;
                return matchBusca && matchStatus;
            });

            tbody.innerHTML = filtrados.map(c => `
                <tr>
                    <td><strong>${c.nome}</strong></td>
                    <td>${c.descricao}</td>
                    <td><span class="categoria-tag info">${c.chamados} chamados</span></td>
                    <td>${getCategoriaCor(c.cor)}</td>
                    <td>${getBadgeCategoria(c.status)}</td>
                    <td>${c.data}</td>
                </tr>
            `).join('');

            const contador = document.getElementById('resultadoContador');
            if (contador) contador.textContent = `Mostrando ${filtrados.length} categoria${filtrados.length > 1 ? 's' : ''}`;
        }

        function filtrarCategorias() { exibirCategorias(); }

        document.addEventListener('DOMContentLoaded', function() {
            exibirCategorias();
        });
    
