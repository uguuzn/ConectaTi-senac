
        const unidades = [
            { nome: 'Taguatinga', regiao: 'Taguatinga', usuarios: 12, chamados: 45, status: 'Ativa', data: '01/01/2020' },
            { nome: 'Brasília', regiao: 'Plano Piloto', usuarios: 8, chamados: 32, status: 'Ativa', data: '15/03/2020' },
            { nome: 'Ceilândia', regiao: 'Ceilândia', usuarios: 6, chamados: 28, status: 'Ativa', data: '20/05/2020' },
            { nome: 'Gama', regiao: 'Gama', usuarios: 4, chamados: 15, status: 'Ativa', data: '10/07/2020' },
            { nome: 'Guará', regiao: 'Guará', usuarios: 3, chamados: 12, status: 'Ativa', data: '25/08/2020' },
            { nome: 'Planaltina', regiao: 'Planaltina', usuarios: 2, chamados: 8, status: 'Inativa', data: '05/10/2020' },
            { nome: 'Samambaia', regiao: 'Samambaia', usuarios: 4, chamados: 18, status: 'Ativa', data: '12/11/2020' },
            { nome: 'Santa Maria', regiao: 'Santa Maria', usuarios: 2, chamados: 6, status: 'Inativa', data: '20/01/2021' },
            { nome: 'Sobradinho', regiao: 'Sobradinho', usuarios: 3, chamados: 10, status: 'Ativa', data: '15/03/2021' },
            { nome: 'Águas Claras', regiao: 'Águas Claras', usuarios: 5, chamados: 22, status: 'Ativa', data: '10/05/2021' }
        ];

        function getBadgeUnidade(status) {
            const classes = { 'Ativa': 'active', 'Inativa': 'inactive' };
            return `<span class="unidade-status ${classes[status] || 'inactive'}">${status}</span>`;
        }

        function exibirUnidades() {
            const tbody = document.getElementById('listaUnidades');
            const busca = document.getElementById('buscaUnidades')?.value.toLowerCase() || '';
            const status = document.getElementById('filtroStatusUnidade')?.value || 'todos';

            let filtrados = unidades.filter(u => {
                const matchBusca = u.nome.toLowerCase().includes(busca) || u.regiao.toLowerCase().includes(busca);
                const matchStatus = status === 'todos' || u.status === status;
                return matchBusca && matchStatus;
            });

            tbody.innerHTML = filtrados.map(u => `
                <tr>
                    <td><strong>${u.nome}</strong></td>
                    <td>${u.regiao}</td>
                    <td><span class="unidade-card-mini">${u.usuarios} usuários</span></td>
                    <td><span class="unidade-card-mini" style="background:rgba(77,150,255,0.1);color:#4D96FF;">${u.chamados} chamados</span></td>
                    <td>${getBadgeUnidade(u.status)}</td>
                    <td>${u.data}</td>
                </tr>
            `).join('');

            const contador = document.getElementById('resultadoContador');
            if (contador) contador.textContent = `Mostrando ${filtrados.length} unidade${filtrados.length > 1 ? 's' : ''}`;
        }

        function filtrarUnidades() { exibirUnidades(); }

        document.addEventListener('DOMContentLoaded', function() {
            exibirUnidades();
        });
    
