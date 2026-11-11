
        const chamadosGerenciar = [
            { id: 1, solicitante: 'Rayssa Paiva', categoria: 'Reserva de notebooks', prioridade: 'Alta', status: 'Em atendimento', data: '03/07/2026' },
            { id: 2, solicitante: 'Carla Mendes', categoria: 'Projetor', prioridade: 'Média', status: 'Aberto', data: '03/07/2026' },
            { id: 3, solicitante: 'Joao Suporte', categoria: 'Internet/Rede', prioridade: 'Urgente', status: 'Resolvido', data: '02/07/2026' },
            { id: 4, solicitante: 'Ana Souza', categoria: 'Computador com defeito', prioridade: 'Alta', status: 'Aberto', data: '03/07/2026' },
            { id: 5, solicitante: 'Pedro Santos', categoria: 'Impressora', prioridade: 'Média', status: 'Atrasado', data: '01/07/2026' }
        ];

        function getBadgeGerenciar(status) {
            const classes = {
                'Aberto': 'badge-aberto',
                'Em atendimento': 'badge-atendimento',
                'Resolvido': 'badge-resolvido',
                'Atrasado': 'badge-atrasado'
            };
            return `<span class="badge ${classes[status] || 'badge-aberto'}">${status}</span>`;
        }

        function acaoChamado(id, acao) {
            const chamado = chamadosGerenciar.find(c => c.id === id);
            if (!chamado) return;

            const acoes = {
                'atender': { status: 'Em atendimento', msg: 'Chamado em atendimento!' },
                'resolver': { status: 'Resolvido', msg: 'Chamado resolvido!' },
                'cancelar': { status: 'Cancelado', msg: 'Chamado cancelado!' },
                'editar': { status: null, msg: 'Abrindo editor...' }
            };

            const acaoObj = acoes[acao];
            if (!acaoObj) return;

            if (acao === 'editar') {
                mostrarNotificacao('📝 Editando chamado #' + id.toString().padStart(3, '0'), 'info');
                return;
            }

            chamado.status = acaoObj.status;
            mostrarNotificacao(`✅ ${acaoObj.msg}`, 'success');
            exibirGerenciar();
            atualizarBadgeGerenciar();
        }

        function atualizarBadgeGerenciar() {
            const total = chamadosGerenciar.length;
            const badge = document.querySelector('.menu-badge');
            if (badge) badge.textContent = total;
        }

        function exibirGerenciar() {
            const tbody = document.getElementById('listaGerenciar');
            const busca = document.getElementById('buscaGerenciar')?.value.toLowerCase() || '';
            const status = document.getElementById('filtroStatusGerenciar')?.value || 'todos';
            const prioridade = document.getElementById('filtroPrioridadeGerenciar')?.value || 'todos';

            let filtrados = chamadosGerenciar.filter(c => {
                const matchBusca = c.solicitante.toLowerCase().includes(busca) || c.categoria.toLowerCase().includes(busca);
                const matchStatus = status === 'todos' || c.status === status;
                const matchPrioridade = prioridade === 'todos' || c.prioridade === prioridade;
                return matchBusca && matchStatus && matchPrioridade;
            });

            tbody.innerHTML = filtrados.map(c => `
                <tr>
                    <td><strong>#${c.id.toString().padStart(3, '0')}</strong></td>
                    <td><strong>${c.solicitante}</strong></td>
                    <td>${c.categoria}</td>
                    <td>${c.prioridade}</td>
                    <td>${getBadgeGerenciar(c.status)}</td>
                    <td>${c.data}</td>
                    <td>
                        <div class="chamado-row-actions">
                            ${c.status !== 'Resolvido' && c.status !== 'Cancelado' ? `
                                ${c.status === 'Aberto' ? `<button class="btn-gerenciar atender" onclick="acaoChamado(${c.id}, 'atender')">Atender</button>` : ''}
                                <button class="btn-gerenciar resolver" onclick="acaoChamado(${c.id}, 'resolver')">Resolver</button>
                                <button class="btn-gerenciar cancelar" onclick="acaoChamado(${c.id}, 'cancelar')">Cancelar</button>
                            ` : ''}
                            <button class="btn-gerenciar editar" onclick="acaoChamado(${c.id}, 'editar')">Editar</button>
                            <button class="btn-gerenciar visualizar" onclick="window.location.href='acompanhar-chamado.html'">Ver</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            const contador = document.getElementById('resultadoContadorGerenciar');
            if (contador) {
                contador.textContent = `Mostrando ${filtrados.length} chamado${filtrados.length > 1 ? 's' : ''}`;
            }
        }

        function filtrarGerenciar() {
            exibirGerenciar();
        }

        document.addEventListener('DOMContentLoaded', function() {
            exibirGerenciar();
        });
    
