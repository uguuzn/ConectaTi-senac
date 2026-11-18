/* ============================================================
   CONECTATI SENAC - ASSISTENTE IA
   ------------------------------------------------------------
   Assistente de dúvidas embutido no chat. Responde perguntas
   frequentes sobre o sistema (abrir chamado, status, SLA,
   categorias, contato com o técnico, etc.) com base em uma
   base de conhecimento própria — funciona offline, sem chave
   de API e sem enviar dados para fora.

   Para trocar por um LLM real no futuro: substitua a função
   `ConectaTIAI.responder()` por uma chamada fetch ao endpoint
   do modelo e mantenha o mesmo formato de retorno
   { texto: string, sugestoes: string[] }.
   ============================================================ */
const ConectaTIAI = (() => {

    // ---------- Normalização de texto (minúsculas, sem acento/pontuação) ----------
    function normalizar(texto) {
        return (texto || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')        // remove acentos
            .replace(/[^\w\s]/g, ' ')                // remove pontuação
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ---------- Base de conhecimento ----------
    // Cada intenção tem: palavras (gatilhos), resposta e sugestões de continuação.
    const base = [
        {
            id: 'saudacao',
            palavras: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'e ai', 'hey', 'inicio'],
            resposta: 'Olá! 👋 Sou o assistente do ConectaTI Senac. Posso te ajudar a abrir um chamado, explicar status, prazos (SLA) e categorias, ou mostrar como falar com o técnico. O que você precisa?',
            sugestoes: ['Como abro um chamado?', 'Quais são os status?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'abrir_chamado',
            palavras: ['abrir chamado', 'abrir um chamado', 'novo chamado', 'como abrir', 'registrar chamado', 'solicitar', 'criar chamado', 'novo chamdo', 'cadastrar chamado', 'abrir ticket', 'abro', 'abrir', 'abro um chamado', 'abro chamado', 'como abro', 'quero abrir', 'cadastro chamado', 'abertura'],
            resposta: 'Para abrir um chamado: vá em "Novo Chamado" no menu, preencha solicitante, sala/laboratório, horário, categoria, prioridade e a descrição do problema, e clique em "Enviar Chamado". Quanto mais detalhes na descrição, mais rápido o atendimento. O chamado vai direto para a fila do Suporte TI.',
            sugestoes: ['Quais categorias existem?', 'Como escolher a prioridade?', 'Acompanhar meu chamado']
        },
        {
            id: 'prioridade',
            palavras: ['prioridade', 'urgente', 'alta media baixa', 'nivel', 'quando usar urgente'],
            resposta: 'Prioridade ajuda o técnico a ordenar a fila. Use **Urgente** só quando a aula/atividade está parada (ex.: internet caiu no meio da aula). **Alta** = afeta muito mas tem contorno. **Média** = importa hoje. **Baixa** = não urgente (ex.: emprestar 1 mouse). Exagerar em "Urgente" atrasa quem realmente precisa.',
            sugestoes: ['Qual o prazo por prioridade?', 'Como abrir um chamado?']
        },
        {
            id: 'status',
            palavras: ['status', 'situacao', 'meu chamado', 'estado', 'onde esta', 'significa', 'aberto', 'em atendimento', 'resolvido', 'fechado', 'cancelado', 'atrasado'],
            resposta: 'Status dos chamados: **Aberto** (registrado, aguardando técnico) → **Em atendimento** (técnico já pegou) → **Resolvido** (concluído) → **Fechado** (encerrado em definitivo). **Atrasado** = passou do SLA. **Cancelado** = anulado. Você acompanha tudo em "Acompanhar Chamado".',
            sugestoes: ['Acompanhar meu chamado', 'Qual o prazo de atendimento?', 'Como reabrir um chamado?']
        },
        {
            id: 'sla',
            palavras: ['prazo', 'sla', 'quanto tempo', 'demora', 'quando vai', 'demora muito', 'atende quando', 'tempo de atendimento', 'horas', 'demora quanto'],
            resposta: 'O SLA (prazo) por prioridade: **Urgente** = até 1h, **Alta** = até 4h, **Média** = até 1 dia útil, **Baixa** = até 2 dias úteis. A contagem começa quando o chamado fica "Em atendimento". Se passar do prazo ele aparece como "Atrasado" — nesse caso, abra o chat e fale com o Suporte TI.',
            sugestoes: ['Falar com o técnico', 'Acompanhar meu chamado', 'Como escolher a prioridade?']
        },
        {
            id: 'categorias',
            palavras: ['categoria', 'categorias', 'tipos de chamado', 'o que posso pedir', 'quais tipos', 'servicos'],
            resposta: 'Categorias disponíveis: Reserva de Notebooks, Problema com Internet, Projetor, Computador com Defeito, Instalação de Software, Impressora, Cabo HDMI/Adaptador, Mouse, Teclado e Outros. Escolha a que mais combina — se não souber, use "Outros" e descreva na descrição.',
            sugestoes: ['Reservar notebooks', 'Problema com projetor', 'Como abrir um chamado?']
        },
        {
            id: 'notebook',
            palavras: ['notebook', 'notebooks', 'reservar', 'reserva', 'emprestar', 'emprestimo', 'note', 'laptop'],
            resposta: 'Para reservar notebooks: abra um chamado na categoria "Reserva de Notebooks", informe a quantidade e a turma na descrição, com antecedência mínima de 1 dia útil. A confirmação aparece em "Acompanhar Chamado".',
            sugestoes: ['Como abrir um chamado?', 'Acompanhar meu chamado']
        },
        {
            id: 'projetor',
            palavras: ['projetor', 'projetores', 'data show', 'datashow', 'luz projetor', 'projetor nao liga'],
            resposta: 'Problemas com projetor: verifique primeiro o cabo de energia e a fonte, e se a lâmpada acende. Se persistir, abra um chamado em "Projetor" informando a sala. Se a aula depender dele, marque prioridade Alta ou Urgente.',
            sugestoes: ['Como abrir um chamado?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'impressora',
            palavras: ['impressora', 'imprimir', 'impressao', 'toner', 'tonner', 'papel encravado', 'fila impressao'],
            resposta: 'Para impressora: confira se há papel e se não há papel encravado, e se o computador enxerga a impressora na rede. Se não resolver, abra um chamado em "Impressora" dizendo o modelo e o erro (ou "não imprime").',
            sugestoes: ['Como abrir um chamado?', 'Falar com o técnico']
        },
        {
            id: 'internet',
            palavras: ['internet', 'rede', 'wifi', 'wi-fi', 'conexao', 'conexão', 'sinal', 'sem internet', 'caiu internet', 'lentidao rede'],
            resposta: 'Sem internet/lentidão: teste outro site e outro aparelho para confirmar. Reinicie o Wi-Fi do aparelho. Se a sala inteira estiver sem sinal, é provável que seja a unidade — abra um chamado "Problema com Internet" com a sala e marque Urgente se a aula parou.',
            sugestoes: ['Como abrir um chamado?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'computador',
            palavras: ['computador', 'pc', 'lento', 'travando', 'nao liga', 'não liga', 'defeito', 'tela azul', 'reiniciando'],
            resposta: 'Computador com defeito: anote o número do computador/laboratório e o sintoma (não liga, lento, trava, tela azul). Abra um chamado em "Computador com Defeito" com esses dados. Se for o computador da aula, use prioridade Alta.',
            sugestoes: ['Como abrir um chamado?', 'Instalação de software']
        },
        {
            id: 'software',
            palavras: ['software', 'instalar', 'instalacao', 'instalação', 'programa', 'aplicativo', 'atualizar', 'versao'],
            resposta: 'Instalação/atualização de software: abra um chamado em "Instalação de Software" informando o nome do programa, a versão (se souber) e em qual computador/sala deve ser instalado. Softwares que exigem licença precisam de autorização da coordenação.',
            sugestoes: ['Como abrir um chamado?', 'Falar com a coordenação']
        },
        {
            id: 'perifericos',
            palavras: ['mouse', 'teclado', 'hdmi', 'cabo', 'adaptador', 'fonte', 'fone', 'caixa de som'],
            resposta: 'Para mouse, teclado, cabo HDMI ou adaptador: abra um chamado na categoria correspondente (ou "Outros") e informe a sala e a quantidade. Para reservar com antecedência, use "Reserva de Notebooks" se for conjunto de equipamentos.',
            sugestoes: ['Quais categorias existem?', 'Como abrir um chamado?']
        },
        {
            id: 'tecnico',
            palavras: ['tecnico', 'técnico', 'suporte', 'quem atende', 'contato', 'falar com', 'como contactar', 'telefone', 'chamar'],
            resposta: 'O Suporte TI é quem atende os chamados. Para falar agora, escolha "Suporte TI" na lista de conversas aqui do Chat — as mensagens ficam salvas e o técnico responde assim que possível. Para registrar formalmente, abra um chamado.',
            sugestoes: ['Como abrir um chamado?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'horario',
            palavras: ['horario', 'horário', 'atendimento', 'que horas', 'funciona', 'abre', 'fecha', 'expediente'],
            resposta: 'O Suporte TI atende em horário de expediente da unidade (típicamente das 8h às 22h, de segunda a sábado). Chamados abertos fora desse horário são atendidos no próximo expediente. Urgentes durante a aula têm prioridade.',
            sugestoes: ['Qual o prazo de atendimento?', 'Falar com o técnico']
        },
        {
            id: 'senha',
            palavras: ['senha', 'esqueci', 'esqueceu', 'nao consigo logar', 'não consigo logar', 'login', 'logar', 'acesso', 'bloqueado'],
            resposta: 'Se esqueceu a senha ou não consegue logar: na tela de login use a opção "Esqueci a senha" se houver, ou peça ao Administrador para redefinir. Se for o primeiro acesso, o cadastro é feito pelo Administrador em "Usuários".',
            sugestoes: ['Falar com o técnico', 'Como abrir um chamado?']
        },
        {
            id: 'acompanhar',
            palavras: ['acompanhar', 'rastrear', 'ver meu chamado', 'meus chamados', 'historico', 'histórico', 'onde vejo'],
            resposta: 'Para acompanhar: abra "Acompanhar Chamado" no menu. Lá ficam seus chamados com status, data e prioridade. O técnico pode atualizar o status conforme trabalha no problema.',
            sugestoes: ['Quais são os status?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'fechar_reabrir',
            palavras: ['fechar', 'fechar chamado', 'encerrar', 'reabrir', 'reabrir chamado', 'reabertura', 'voltar abrir', 'fecho', 'reabro', 'fecho o chamado', 'reabro o chamado', 'encerro', 'encerrado', 'fechado'],
            resposta: 'O técnico pode **Fechar** um chamado Resolvido (encerra em definitivo) e **Reabrir** um chamado Fechado/Cancelado/Resolvido se o problema voltou. Essas ações ficam na tela "Gerenciar Chamados". Se você (solicitante) precisar reabrir, peça ao técnico pelo chat.',
            sugestoes: ['Falar com o técnico', 'Quais são os status?']
        },
        {
            id: 'chat',
            palavras: ['chat', 'conversar', 'mandar mensagem', 'enviar mensagem', 'falar no chat', 'mensagem'],
            resposta: 'Aqui no Chat você conversa com o Suporte TI e comigo (Assistente IA). Escolha um contato na lista à esquerda. Suas mensagens com o técnico ficam salvas; ele responde quando puder. Comigo você tira dúvidas a qualquer hora. 🤖',
            sugestoes: ['Quais categorias existem?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'faq',
            palavras: ['duvida', 'dúvida', 'duvidas frequentes', 'dúvidas frequentes', 'faq', 'perguntas frequentes', 'ajuda'],
            resposta: 'Você pode ver as dúvidas frequentes em "Dúvidas Frequentes" no menu. Ou pode perguntar aqui mesmo — eu respondo sobre chamados, status, SLA, categorias e como falar com o técnico.',
            sugestoes: ['Como abrir um chamado?', 'Quais são os status?', 'Qual o prazo de atendimento?']
        },
        {
            id: 'coordenacao',
            palavras: ['coordenacao', 'coordenação', 'coordenador', 'falar com a coordenacao', 'autorizacao', 'autorização', 'licenca', 'licença'],
            resposta: 'Assuntos de coordenação (autorização de software pago, ajuste de turma, reserva de laboratório recorrente) devem ser tratados com a Coordenação da unidade. O ConectaTI cuida da parte técnica; se o chamado depender de autorização, o técnico sinaliza no chat.',
            sugestoes: ['Falar com o técnico', 'Como abrir um chamado?']
        },
        {
            id: 'agradecimento',
            palavras: ['obrigado', 'obrigada', 'valeu', 'agradeco', 'agradeço', 'thanks', 'muito bom', 'perfeito'],
            resposta: 'De nada! 😊 Se precisar de mais alguma coisa, é só perguntar aqui ou abrir um chamado. Estou por perto.',
            sugestoes: ['Como abrir um chamado?', 'Falar com o técnico']
        }
    ];

    const fallback = {
        resposta: 'Hmm, não tenho certeza se entendi. 😅 Eu consigo ajudar com: abrir/acompanhar chamados, status, prazo (SLA), categorias (notebook, projetor, impressora, internet, computador, software) e como falar com o técnico. Tente reformular ou escolha uma opção abaixo.',
        sugestoes: ['Como abrir um chamado?', 'Quais são os status?', 'Qual o prazo de atendimento?', 'Falar com o técnico']
    };

    // ---------- Pontuação por intenção ----------
    // Verifica se uma sequência de tokens aparece contígua na consulta
    // (casamento por palavra inteira, evita que "reabro" contenha "abro").
    function contemSequencia(queryTokensArr, fraseTokens) {
        const n = fraseTokens.length;
        for (let i = 0; i + n <= queryTokensArr.length; i++) {
            if (fraseTokens.every((t, j) => queryTokensArr[i + j] === t)) return true;
        }
        return false;
    }

    function pontuar(intencao, queryNorm, queryTokens, queryTokensArr) {
        let score = 0;
        for (const p of intencao.palavras) {
            if (p.includes(' ')) {
                // frase multi-palavra: combina como sequência de tokens inteiros
                const ft = p.split(' ');
                if (contemSequencia(queryTokensArr, ft)) score += ft.length;
            } else {
                if (queryTokens.has(p)) score += 1;
            }
        }
        return score;
    }

    // ---------- API pública ----------
    function responder(pergunta) {
        const q = normalizar(pergunta);
        if (!q) return { texto: fallback.resposta, sugestoes: fallback.sugestoes };

        const queryTokensArr = q.split(' ');
        const queryTokens = new Set(queryTokensArr);
        let melhor = null;
        let melhorScore = 0;

        for (const intencao of base) {
            const s = pontuar(intencao, q, queryTokens, queryTokensArr);
            if (s > melhorScore) { melhorScore = s; melhor = intencao; }
        }

        const escolhido = (melhor && melhorScore >= 1) ? melhor : fallback;
        return { texto: escolhido.resposta, sugestoes: escolhido.sugestoes || [] };
    }

    // Mensagem de boas-vindas do assistente
    function saudacaoInicial() {
        return {
            texto: 'Olá! 👋 Sou o **Assistente IA** do ConectaTI Senac. Estou aqui para tirar suas dúvidas sobre chamados, status, prazos e categorias — a qualquer hora. Como posso ajudar?',
            sugestoes: ['Como abrir um chamado?', 'Quais são os status?', 'Qual o prazo de atendimento?', 'Falar com o técnico']
        };
    }

    return { responder, saudacaoInicial };
})();
