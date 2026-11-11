
        function criarUnidade() {
            const nome = document.getElementById('nomeUnidade').value.trim();
            const regiao = document.getElementById('regiaoUnidade').value.trim();
            const endereco = document.getElementById('enderecoUnidade').value.trim();
            const telefone = document.getElementById('telefoneUnidade').value.trim();
            const status = document.getElementById('statusUnidade').value;

            if (!nome || !regiao) {
                mostrarNotificacao('Preencha o nome e a região da unidade!', 'error');
                return false;
            }

            // Simula criação
            const unidades = JSON.parse(localStorage.getItem('unidadesConectaTI') || '[]');
            unidades.push({
                id: unidades.length + 1,
                nome: nome,
                regiao: regiao,
                endereco: endereco || 'Não informado',
                telefone: telefone || 'Não informado',
                status: status,
                data: new Date().toLocaleDateString('pt-BR')
            });
            localStorage.setItem('unidadesConectaTI', JSON.stringify(unidades));

            mostrarNotificacao(`✅ Unidade ${nome} criada com sucesso!`, 'success');
            
            document.getElementById('nomeUnidade').value = '';
            document.getElementById('regiaoUnidade').value = '';
            document.getElementById('enderecoUnidade').value = '';
            document.getElementById('telefoneUnidade').value = '';
            
            return false;
        }
    
