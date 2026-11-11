
        async function criarUsuario(event) {
            event.preventDefault();
            const nome = document.getElementById('nomeUsuario').value.trim();
            const email = document.getElementById('emailUsuario').value.trim();
            const perfil = document.getElementById('perfilUsuario').value;
            const unidade = document.getElementById('unidadeUsuario').value;
            const senha = document.getElementById('senhaUsuario').value;
            const confirmar = document.getElementById('confirmarSenha').value;
            const status = document.getElementById('statusUsuario').value;

            if (!nome || !email || !perfil || !senha || !confirmar) {
                mostrarNotificacao('Preencha todos os campos obrigatórios!', 'error');
                return false;
            }

            if (senha !== confirmar) {
                mostrarNotificacao('As senhas não coincidem!', 'error');
                return false;
            }

            if (senha.length < 6) {
                mostrarNotificacao('A senha deve ter pelo menos 6 caracteres!', 'error');
                return false;
            }

            // Simula criação
            try {
                await ConectaTIAPI.criarUsuario({
                    nome,
                    email,
                    senha,
                    telefone: '',
                    tipo: perfil,
                    ativo: status === 'true'
                });
            } catch (error) {
                mostrarNotificacao(error.message, 'error');
                return false;
            }

            mostrarNotificacao(`✅ Usuário ${nome} criado com sucesso!`, 'success');
            
            // Limpa o formulário
            event.currentTarget.reset();
            
            return false;
        }
    
