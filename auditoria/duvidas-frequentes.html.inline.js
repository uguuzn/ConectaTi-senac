
        const duvidas = [
            { id: 1, pergunta: 'Como reservar notebooks para minha turma?', 
              resposta: 'Acesse o menu "Novo Chamado", selecione a categoria "Reserva de notebooks", informe a quantidade de notebooks, a data e o horário desejados. O suporte confirmará a reserva em até 2 horas úteis.',
              categoria: 'Reservas', icone: '📚' },
            { id: 2, pergunta: 'O que fazer se o projetor não funcionar?',
              resposta: 'Verifique se o projetor está ligado e todos os cabos estão conectados corretamente. Se o problema persistir, abra um chamado na categoria "Projetor" informando a sala e o problema observado.',
              categoria: 'Equipamentos', icone: '📽️' },
            { id: 3, pergunta: 'Como acompanhar o status do meu chamado?',
              resposta: 'Acesse o menu "Acompanhar Chamado" onde você verá todos os seus chamados com o status atual. Você também pode ver o histórico completo de cada chamado.',
              categoria: 'Chamados', icone: '📋' },
            { id: 4, pergunta: 'Qual o prazo para atendimento de um chamado?',
              resposta: 'Chamados com prioridade "Urgente" são atendidos em até 2 horas. Chamados com prioridade "Alta" em até 4 horas. Os demais chamados têm prazo de até 24 horas úteis.',
              categoria: 'Chamados', icone: '⏱️' },
            { id: 5, pergunta: 'Como solicitar um novo equipamento?',
              resposta: 'Para solicitar um novo equipamento, abra um chamado na categoria correspondente (Notebook, Projetor, etc.) e descreva a necessidade. A coordenação analisará a solicitação.',
              categoria: 'Equipamentos', icone: '💻' },
            { id: 6, pergunta: 'Esqueci minha senha, como recuperar?',
              resposta: 'Clique em "Esqueci minha senha" na tela de login. Você receberá um e-mail com instruções para redefinir sua senha. Entre em contato com o suporte se não receber o e-mail.',
              categoria: 'Suporte', icone: '🔑' },
            { id: 7, pergunta: 'Como funciona o chat de suporte?',
              resposta: 'O chat está disponível no menu lateral. Você pode conversar em tempo real com a equipe de suporte para resolver problemas rapidamente. O chat fica disponível durante o horário comercial.',
              categoria: 'Suporte', icone: '💬' },
            { id: 8, pergunta: 'Posso cancelar um chamado já aberto?',
              resposta: 'Sim, acesse "Acompanhar Chamado", localize o chamado e clique em "Cancelar Chamado". Apenas chamados com status "Aberto" podem ser cancelados.',
              categoria: 'Chamados', icone: '❌' }
        ];

        function getCategoriaClass(categoria) {
            const classes = {
                'Chamados': 'chamados',
                'Equipamentos': 'equipamentos',
                'Reservas': 'reservas',
                'Suporte': 'suporte',
                'Sistema': 'suporte'
            };
            return classes[categoria] || 'suporte';
        }

        function exibirDuvidas() {
            const container = document.getElementById('listaDuvidas');
            const busca = document.getElementById('buscaDuvidas')?.value.toLowerCase() || '';
            const categoria = document.getElementById('filtroCategoriaDuvida')?.value || 'todos';

            let filtrados = duvidas.filter(d => {
                const matchBusca = d.pergunta.toLowerCase().includes(busca) || d.resposta.toLowerCase().includes(busca);
                const matchCategoria = categoria === 'todos' || d.categoria === categoria;
                return matchBusca && matchCategoria;
            });

            container.innerHTML = filtrados.map(d => `
                <div class="duvida-card" onclick="toggleDuvida(${d.id})">
                    <div class="pergunta">
                        <span>
                            <span class="icon">${d.icone}</span>
                            ${d.pergunta}
                        </span>
                        <span class="toggle" id="toggle-${d.id}">▼</span>
                    </div>
                    <div class="resposta" id="resposta-${d.id}">
                        ${d.resposta}
                        <div>
                            <span class="categoria ${getCategoriaClass(d.categoria)}">${d.categoria}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            if (filtrados.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding:40px; color:var(--text-muted);">
                        <span style="font-size:2rem; display:block; margin-bottom:8px;">🔍</span>
                        Nenhuma dúvida encontrada
                    </div>
                `;
            }
        }

        function toggleDuvida(id) {
            const resposta = document.getElementById(`resposta-${id}`);
            const toggle = document.getElementById(`toggle-${id}`);
            if (resposta && toggle) {
                resposta.classList.toggle('open');
                toggle.classList.toggle('open');
            }
        }

        function filtrarDuvidas() {
            exibirDuvidas();
        }

        document.addEventListener('DOMContentLoaded', function() {
            exibirDuvidas();
        });
    
