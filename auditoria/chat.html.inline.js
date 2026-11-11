
        // ========================
        // USUÁRIOS ONLINE
        // ========================
        const usuariosOnline = [
            { id: 1, nome: 'João Suporte', perfil: 'Suporte TI', unidade: 'Taguatinga', status: 'online', cor: '#6C63FF' },
            { id: 2, nome: 'Rayssa Paiva', perfil: 'Instrutor', unidade: 'Taguatinga', status: 'online', cor: '#FF6B6B' },
            { id: 3, nome: 'Carla Mendes', perfil: 'Coordenação', unidade: 'Taguatinga', status: 'online', cor: '#4D96FF' },
            { id: 4, nome: 'Ana Souza', perfil: 'Instrutor', unidade: 'Gama', status: 'away', cor: '#FFB347' },
            { id: 5, nome: 'Pedro Santos', perfil: 'Coordenação', unidade: 'Ceilândia', status: 'offline', cor: '#8A8AA8' }
        ];

        // ========================
        // CONVERSAS
        // ========================
        const conversas = {
            'João Suporte': [
                { usuario: 'João Suporte', mensagem: 'Olá! Como posso ajudar você?', hora: '10:30' },
                { usuario: 'Você', mensagem: 'Estou com problema no projetor da sala 12', hora: '10:32' },
                { usuario: 'João Suporte', mensagem: 'Vou verificar agora mesmo!', hora: '10:33' }
            ],
            'Rayssa Paiva': [
                { usuario: 'Rayssa Paiva', mensagem: 'Oi! Preciso reservar notebooks para amanhã', hora: '09:15' },
                { usuario: 'Você', mensagem: 'Quantos notebooks você precisa?', hora: '09:17' },
                { usuario: 'Rayssa Paiva', mensagem: '15 notebooks para a turma de TADS', hora: '09:18' }
            ],
            'Carla Mendes': [
                { usuario: 'Carla Mendes', mensagem: 'Bom dia! O relatório está pronto?', hora: '08:00' },
                { usuario: 'Você', mensagem: 'Bom dia! Estou finalizando, envio em 1 hora', hora: '08:05' }
            ]
        };

        let conversaAtual = 'João Suporte';

        // ========================
        // FUNÇÕES
        // ========================
        function getStatusText(status) {
            const map = { 'online': 'Online', 'offline': 'Offline', 'away': 'Ausente' };
            return map[status] || 'Online';
        }

        function getStatusDot(status) {
            return status;
        }

        function exibirUsuariosOnline() {
            const container = document.getElementById('listaUsuariosOnline');
            const perfil = localStorage.getItem('perfilUsuario') || 'Usuário';
            
            container.innerHTML = usuariosOnline.map(u => `
                <div class="usuario-online ${conversaAtual === u.nome ? 'active' : ''}" onclick="abrirConversa('${u.nome}')">
                    <div class="avatar" style="background:${u.cor}">
                        ${u.nome.charAt(0)}
                        <span class="status-dot ${getStatusDot(u.status)}"></span>
                    </div>
                    <div>
                        <span class="nome">${u.nome}</span>
                        <span class="perfil-chat">${u.perfil} - ${u.unidade}</span>
                    </div>
                    ${u.status === 'online' ? `<span class="mensagem-nao-lida">${Math.floor(Math.random() * 3) + 1}</span>` : ''}
                </div>
            `).join('');
        }

        function exibirConversas() {
            const container = document.getElementById('listaConversas');
            const keys = Object.keys(conversas);
            
            container.innerHTML = keys.map(key => `
                <div class="usuario-online" onclick="abrirConversa('${key}')">
                    <div class="avatar" style="background:${usuariosOnline.find(u => u.nome === key)?.cor || '#6C63FF'}">
                        ${key.charAt(0)}
                    </div>
                    <div>
                        <span class="nome">${key}</span>
                        <span class="perfil-chat">${conversas[key].length} mensagens</span>
                    </div>
                </div>
            `).join('');
        }

        function abrirConversa(nome) {
            conversaAtual = nome;
            exibirUsuariosOnline();
            exibirMensagensChat(nome);
            
            const usuario = usuariosOnline.find(u => u.nome === nome);
            if (usuario) {
                document.getElementById('chatAvatar').textContent = usuario.nome.charAt(0);
                document.getElementById('chatAvatar').style.background = usuario.cor;
                document.getElementById('chatNome').textContent = usuario.nome;
                document.getElementById('chatStatus').textContent = `● ${getStatusText(usuario.status)}`;
                document.getElementById('chatStatus').className = `status ${usuario.status}`;
                document.getElementById('chatUnidade').textContent = usuario.unidade;
            }
        }

        function exibirMensagensChat(nome) {
            const container = document.getElementById('chatMessages');
            const mensagens = conversas[nome] || [];
            const perfil = localStorage.getItem('perfilUsuario') || 'Usuário';

            if (mensagens.length === 0) {
                container.innerHTML = `
                    <div class="chat-vazio">
                        <div class="icon">💬</div>
                        <h3>Nenhuma mensagem</h3>
                        <p>Envie uma mensagem para iniciar a conversa</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = mensagens.map(m => {
                const isSent = m.usuario === 'Você' || m.usuario === perfil;
                const usuario = usuariosOnline.find(u => u.nome === m.usuario);
                const cor = usuario?.cor || '#6C63FF';
                const iniciais = m.usuario.charAt(0);
                const nomeExibido = m.usuario === 'Você' ? perfil : m.usuario;
                
                return `
                    <div class="chat-message ${isSent ? 'sent' : ''}">
                        <div class="avatar-msg" style="background:${cor}">${iniciais}</div>
                        <div class="bubble">
                            <span class="nome-msg">${nomeExibido}</span>
                            ${m.mensagem}
                            <span class="time">${m.hora}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.scrollTop = container.scrollHeight;
        }

        function enviarMensagemChat() {
            const input = document.getElementById('chatInput');
            const mensagem = input.value.trim();
            if (!mensagem) return;

            const perfil = localStorage.getItem('perfilUsuario') || 'Usuário';
            const now = new Date();
            const hora = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            if (!conversas[conversaAtual]) {
                conversas[conversaAtual] = [];
            }

            conversas[conversaAtual].push({
                usuario: 'Você',
                mensagem: mensagem,
                hora: hora
            });

            input.value = '';
            exibirMensagensChat(conversaAtual);
            exibirConversas();

            // Simula resposta automática
            setTimeout(() => {
                const respostas = [
                    'Entendi! Vou resolver isso agora mesmo.',
                    'Ok, estou verificando para você.',
                    'Já estou analisando o problema.',
                    'Pode deixar que vou te ajudar.',
                    'Ótimo! Já estou trabalhando nisso.',
                    'Vou encaminhar para o setor responsável.',
                    'Assim que possível te dou um retorno.'
                ];
                const resposta = respostas[Math.floor(Math.random() * respostas.length)];
                
                if (!conversas[conversaAtual]) {
                    conversas[conversaAtual] = [];
                }
                
                const agora = new Date();
                const horaResp = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
                
                conversas[conversaAtual].push({
                    usuario: conversaAtual,
                    mensagem: resposta,
                    hora: horaResp
                });
                
                exibirMensagensChat(conversaAtual);
                exibirConversas();
            }, 1500);
        }

        // ========================
        // INICIALIZAÇÃO
        // ========================
        document.addEventListener('DOMContentLoaded', function() {
            exibirUsuariosOnline();
            exibirConversas();
            
            // Abre a primeira conversa
            const primeiraConversa = Object.keys(conversas)[0];
            if (primeiraConversa) {
                abrirConversa(primeiraConversa);
            }
        });
    
