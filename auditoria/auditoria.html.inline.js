
        // Toggles
        function toggleTemaConfig() {
            const el = document.getElementById('toggleTema');
            el.classList.toggle('active');
            toggleTheme();
            mostrarNotificacao(el.classList.contains('active') ? 'Tema escuro ativado!' : 'Tema claro ativado!', 'info');
        }

        function toggleNotificacoesConfig() {
            const el = document.getElementById('toggleNotificacoes');
            el.classList.toggle('active');
            mostrarNotificacao(el.classList.contains('active') ? 'Notificações ativadas!' : 'Notificações desativadas!', 'info');
        }

        function toggleEmailConfig() {
            const el = document.getElementById('toggleEmail');
            el.classList.toggle('active');
            mostrarNotificacao(el.classList.contains('active') ? 'Notificações por e-mail ativadas!' : 'Notificações por e-mail desativadas!', 'info');
        }

        function mudarIdioma() {
            const val = document.getElementById('selectIdioma').value;
            const idiomas = {
                'pt-BR': 'Português (BR)',
                'en-US': 'English (US)',
                'es-ES': 'Español'
            };
            mostrarNotificacao(`Idioma alterado para ${idiomas[val]}`, 'success');
        }

        function mudarFormatoData() {
            const val = document.getElementById('selectData').value;
            mostrarNotificacao(`Formato de data alterado para ${val}`, 'success');
        }

        function alterarTimeout() {
            const val = document.getElementById('inputTimeout').value;
            if (val >= 5 && val <= 120) {
                mostrarNotificacao(`Timeout de sessão alterado para ${val} minutos`, 'success');
            } else {
                mostrarNotificacao('Valor inválido. Use entre 5 e 120 minutos.', 'error');
            }
        }

        function limparDados() {
            if (confirm('⚠️ Tem certeza que deseja limpar todos os dados do sistema? Esta ação não pode ser desfeita!')) {
                if (confirm('Última chance! Deseja realmente continuar?')) {
                    localStorage.clear();
                    mostrarNotificacao('Todos os dados foram limpos!', 'error');
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                }
            }
        }
    
