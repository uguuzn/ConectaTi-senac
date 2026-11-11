
        const chamadosAcompanhar = [
            {
                id: 1,
                solicitante: 'Rayssa Paiva',
                perfil: 'Instrutor',
                categoria: 'Reserva de notebooks',
                sala: 'Lab 02',
                prioridade: 'Alta',
                status: 'Em atendimento',
                data: '03/07/2026',
                descricao: 'Preciso reservar 15 notebooks para a turma de TADS',
                historico: [
                    { data: '03/07/2026 08:30', acao: 'Chamado aberto por Rayssa Paiva' },
                    { data: '03/07/2026 09:00', acao: 'Chamado em atendimento - Suporte TI' }
                ]
            },
            {
                id: 2,
                solicitante: 'Carla Mendes',
                perfil: 'Coordenacao',
                categoria: 'Projetor',
                sala: 'Sala 12',
                prioridade: 'Média',
                status: 'Aberto',
                data: '03/07/2026',
                descricao: 'Projetor da sala 12 está com a imagem desfocada',
                historico: [
                    { data: '03/07/2026 10:15', acao: 'Chamado aberto por Carla Mendes' }
                ]
            },
            {
                id: 3,
                solicitante: 'Ana Souza',
                perfil: 'Instrutor',
                categoria: 'Computador com defeito',
                sala: 'Lab 03',
                prioridade: 'Alta',
                status: 'Resolvido',
                data: '03/07/2026',
                descricao: '3 computadores do Lab 03 não estão ligando',
                historico: [
                    { data: '03/07/2026 08:00', acao: 'Chamado aberto por Ana Souza' },
                    { data: '03/07/2026 09:30', acao: 'Em atendimento - Técnico identificou fonte queimada' },
                    { data: '03/07/2026 11:00', acao: 'Chamado resolvido - Computadores substituídos' }
                ]
            }
        ];

        function getBadgeAcompanhar(status) {
            const classes = {
                'Aberto': 'badge-aberto',
                'Em atendimento': 'badge-atendimento',
                'Resolvido': 'badge-resolvido',
                'Atrasado': 'badge-atrasado'
            };
            return `<span class="badge ${classes[status] || 'badge-aberto'}">${status}</span>`;
        }

        function getStatusTimeline(status) {
            const steps = ['Aberto', 'Em atendimento', 'Resolvido'];
            const currentIndex = steps.indexOf(status);
            
            return steps.map((step, index) => {
                let classe = '';
                if (index < currentIndex) classe = 'done';
                else if (index === currentIndex) classe = 'active';
                
                return `
                    <div class="status-step ${classe}">
                        <div class="circle">${index + 1}</div>
                        <span class="label">${step}</span>
                    </div>
                `;
            }).join('');
        }

        function exibirAcompanhar() {
            const container = document.getElementById('listaAcompanhar');
            const busca = document.getElementById('buscaAcompanhar')?.value.toLowerCase() || '';
            const status = document.getElementById('filtroStatusAcompanhar')?.value || 'todos';

            let filtrados = chamadosAcompanhar.filter(c => {
                const matchBusca = c.id.toString().includes(busca) || c.solicitante.toLowerCase().includes(busca);
                const matchStatus = status === 'todos' || c.status === status;
                return matchBusca && matchStatus;
            });

            container.innerHTML = filtrados.map(c => `
                <div class="chamado-detalhe">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div>
                            <strong style="font-size:1.1rem;">#${c.id.toString().padStart(3, '0')} - ${c.solicitante}</strong>
                            <span style="margin-left:12px;">${getBadgeAcompanhar(c.status)}</span>
                        </div>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${c.data}</span>
                    </div>
                    
                    <div class="row">
                        <span class="label">Categoria</span>
                        <span class="value">${c.categoria}</span>
                    </div>
                    <div class="row">
                        <span class="label">Sala</span>
                        <span class="value">${c.sala}</span>
                    </div>
                    <div class="row">
                        <span class="label">Prioridade</span>
                        <span class="value">${c.prioridade}</span>
                    </div>
                    <div class="row">
                        <span class="label">Descrição</span>
                        <span class="value">${c.descricao}</span>
                    </div>
                    
                    <div style="margin-top:16px;">
                        <div class="status-timeline">
                            ${getStatusTimeline(c.status)}
                        </div>
                    </div>
                    
                    <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border-color-light);">
                        <span style="font-size:0.7rem; color:var(--text-muted);">📋 Histórico</span>
                        ${c.historico.map(h => `
                            <div style="display:flex; justify-content:space-between; padding:4px 0; font-size:0.75rem; color:var(--text-secondary);">
                                <span>${h.acao}</span>
                                <span style="color:var(--text-muted);">${h.data}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
                        ${c.status !== 'Resolvido' ? `
                            <button class="btn-acao" onclick="mostrarNotificacao('Entrando em contato com o suporte...', 'info')">💬 Falar com Suporte</button>
                            <button class="btn-acao" onclick="mostrarNotificacao('Chamado atualizado com sucesso!', 'success')">📝 Atualizar</button>
                        ` : `
                            <button class="btn-acao success" onclick="mostrarNotificacao('Chamado resolvido! Obrigado pelo feedback.', 'success')">✅ Chamado Resolvido</button>
                        `}
                        <button class="btn-acao" onclick="window.location.href='chat.html'" style="background:var(--info);">💬 Chat</button>
                    </div>
                </div>
            `).join('');

            if (filtrados.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding:40px; color:var(--text-muted);">
                        <span style="font-size:2rem; display:block; margin-bottom:8px;">📋</span>
                        Nenhum chamado encontrado
                    </div>
                `;
            }
        }

        function filtrarAcompanhar() {
            exibirAcompanhar();
        }

        document.addEventListener('DOMContentLoaded', function() {
            exibirAcompanhar();
        });
    
