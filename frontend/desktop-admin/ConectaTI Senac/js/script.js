// ============================================================
// CONECTATI SENAC — SCRIPT (paridade com o web-mobile)
// Fontes copiadas: web-mobile src/lib/conectati/permissions.ts
// (matriz e cores), store.ts (slug/uid/toast/dataHojeBR/locais),
// data.ts (sementes) e as rotas React (home, login, dashboard,
// chamados, novo-chamado, equipamentos, relatorios, usuarios,
// unidades, admin, mapa-salas, minhas-turmas).
// Regra acordada: na dúvida, copiar o web. Páginas exclusivas do
// desktop (chat por chamado, acompanhar, dúvidas, categorias,
// criar-*, auditoria, gerenciar) mantêm a função e recebem o
// mesmo design system. Tema: só claro (sem toggle, sem CSS morto).
// ============================================================

// ========================
// HELPERS (portados do web store.ts)
// ========================

function slug(texto) {
    return (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
}

function uid(prefixo) {
    return prefixo + '_' + Math.random().toString(36).slice(2, 8);
}

function dataHojeBR() {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

/* Neutraliza HTML de qualquer texto originado da API antes de usar innerHTML. */
function escaparHTML(texto) {
    return String(texto ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function definirTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
}

/* Toast único do web (store.ts). */
let toastTimer;
function toast(mensagem) {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.className = 'toast';
        document.body.appendChild(el);
    }
    el.textContent = mensagem;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

/* Alias para os scripts das páginas exclusivas do desktop. */
function mostrarNotificacao(mensagem) {
    toast(mensagem);
}

/* Contador animado (Counter do home.tsx/relatorios.tsx). */
function animarContador(el, alvo) {
    if (!el) return;
    const duracao = 1400;
    const t0 = performance.now();
    function passo(agora) {
        const p = Math.min((agora - t0) / duracao, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(alvo * e);
        if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
}

// ========================
// PERFIL E PERMISSÕES
// Tipos = enums do backend (TipoUsuario). Matriz de MENU copiada de
// permissions.ts do web. Extensões desktop marcadas com [*].
// ========================

const ROTULOS_PERFIL = {
    ADMINISTRADOR: 'Administrador',
    INSTRUTOR: 'Instrutor',
    COORDENADOR: 'Coordenação',
    TECNICO: 'Suporte TI'
};

/* Cores da pill de perfil — permissions.ts (cor). */
const CORES_PERFIL = {
    ADMINISTRADOR: '#16a34a',
    INSTRUTOR: '#2b8cff',
    COORDENADOR: '#7c3aed',
    TECNICO: '#ff8a3d'
};

/* Menu lateral por perfil — arrays copiados do web.
 * [*] = extensão desktop: páginas recriadas/decididas com o usuário
 * (unidades, mapa-salas, minhas-turmas) entraram no menu para ficarem
 * alcançáveis (no web são órfãs, fora do menu de todos os perfis). */
const MENU_POR_PERFIL = {
    ADMINISTRADOR: ['home', 'dashboard', 'chamados', 'novoChamado', 'equipamentos', 'usuarios', 'relatorios', 'unidades', 'mapaSalas'],
    INSTRUTOR: ['home', 'chamados', 'novoChamado', 'minhasTurmas'],
    COORDENADOR: ['home', 'dashboard', 'chamados', 'novoChamado', 'equipamentos', 'mapaSalas'],
    TECNICO: ['home', 'dashboard', 'chamados', 'equipamentos', 'relatorios', 'mapaSalas']
};

/* Páginas acessíveis fora do menu (regras desktop + backend):
 * - admin/categorias/criar-usuario/criar-unidade/auditoria: ADMIN (hub Administração).
 * - gerenciarChamado: TECNICO (hasRole("TECNICO") no backend).
 * - chat: INSTRUTOR/COORDENADOR/TECNICO (backend devolve 403 ao ADMIN).
 * - acompanhar/duvidas: todos os autenticados. */
const PAGINAS_EXTRAS_POR_PERFIL = {
    ADMINISTRADOR: ['admin', 'categorias', 'criarUsuario', 'criarUnidade', 'auditoria', 'acompanharChamado', 'duvidasFrequentes'],
    INSTRUTOR: ['chat', 'acompanharChamado', 'duvidasFrequentes'],
    COORDENADOR: ['chat', 'acompanharChamado', 'duvidasFrequentes'],
    TECNICO: ['gerenciarChamado', 'chat', 'acompanharChamado', 'duvidasFrequentes']
};

/* verChamados/novoChamado — flags do web permissions.ts. */
const FLAGS_POR_PERFIL = {
    ADMINISTRADOR: { verChamados: 'todos', novoChamado: true },
    INSTRUTOR: { verChamados: 'proprios', novoChamado: true },
    COORDENADOR: { verChamados: 'proprios', novoChamado: true },
    TECNICO: { verChamados: 'todos', novoChamado: false }
};

const ARQUIVOS_POR_CHAVE = {
    home: 'index.html',
    dashboard: 'dashboard.html',
    chamados: 'chamados.html',
    novoChamado: 'novo-chamado.html',
    equipamentos: 'equipamentos.html',
    usuarios: 'usuarios.html',
    relatorios: 'relatorios.html',
    unidades: 'unidades.html',
    mapaSalas: 'mapa-salas.html',
    minhasTurmas: 'minhas-turmas.html',
    admin: 'admin.html',
    categorias: 'categorias.html',
    criarUsuario: 'criar-usuario.html',
    criarUnidade: 'criar-unidade.html',
    auditoria: 'auditoria.html',
    gerenciarChamado: 'gerenciar-chamado.html',
    chat: 'chat.html',
    acompanharChamado: 'acompanhar-chamado.html',
    duvidasFrequentes: 'duvidas-frequentes.html'
};

function getSessaoSegura() {
    return typeof ConectaTIAPI !== 'undefined' ? ConectaTIAPI.getSessao() : null;
}

function getPerfilUsuario() {
    const tipo = getSessaoSegura()?.usuario?.tipo;
    return ROTULOS_PERFIL[tipo] ? tipo : 'Visitante';
}

function getRotuloPerfil(perfil) {
    return ROTULOS_PERFIL[perfil] || 'Visitante';
}

function getEmailUsuario() {
    return getSessaoSegura()?.usuario?.email || '';
}

function getNomeUsuario() {
    return getSessaoSegura()?.usuario?.nome || '';
}

/* Página inicial após o login — regra do web (login.tsx/AppShell):
 * ADMINISTRADOR -> administração; demais -> chamados. */
function paginaInicialPorPerfil(perfil) {
    return perfil === 'ADMINISTRADOR' ? 'admin.html' : 'chamados.html';
}

function podeAcessar(perfil, chave) {
    return MENU_POR_PERFIL[perfil]?.includes(chave) || PAGINAS_EXTRAS_POR_PERFIL[perfil]?.includes(chave);
}

// ========================
// GUARD + SIDEBAR (AppShell do web)
// ========================

const PAGINAS_PUBLICAS = ['login.html', 'index.html'];

function verificarPermissoes() {
    // Guard fail-closed: sem token na sessão local, volta ao login.
    if (typeof ConectaTIAPI === 'undefined' || !ConectaTIAPI.estaAutenticado()) {
        window.location.replace('login.html');
        return;
    }

    const perfil = getPerfilUsuario();
    if (perfil === 'Visitante') {
        // Tipo desconhecido vindo do backend: não dá acesso a nada.
        ConectaTIAPI.limparSessao();
        window.location.replace('login.html');
        return;
    }

    const pagina = window.location.pathname.split('/').pop();
    const chave = Object.keys(ARQUIVOS_POR_CHAVE).find(k => ARQUIVOS_POR_CHAVE[k] === pagina);

    // Default-deny: só acessa se o perfil permitir explicitamente.
    if (!chave || !podeAcessar(perfil, chave)) {
        toast('Acesso negado. Redirecionando...');
        setTimeout(() => {
            window.location.replace(paginaInicialPorPerfil(perfil));
        }, 500);
        return;
    }

    atualizarSidebar(perfil, pagina);
    configurarMenuMobile();
}

function atualizarSidebar(perfil, pagina) {
    const menu = MENU_POR_PERFIL[perfil] || [];

    document.querySelectorAll('.sidebar nav a[data-menu]').forEach(link => {
        const chave = link.getAttribute('data-menu');
        if (chave === 'administrar') {
            // Administração: link fixo do ADMIN no web (AppLayout.tsx).
            link.style.display = perfil === 'ADMINISTRADOR' ? 'block' : 'none';
        } else {
            link.style.display = menu.includes(chave) ? 'block' : 'none';
        }
        link.classList.toggle('active', link.getAttribute('href') === pagina);
    });

    // Pill de perfil (AppShell: texto = tipo cru, cor = permissions.cor).
    const pill = document.getElementById('perfilPill');
    if (pill) {
        pill.textContent = perfil;
        pill.style.background = CORES_PERFIL[perfil] || '#2b8cff';
    }
}

function configurarMenuMobile() {
    const toggle = document.getElementById('menuToggleFloating');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar && !toggle.dataset.ligado) {
        toggle.dataset.ligado = '1';
        toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    // O web fecha o menu ao clicar num link (AppLayout onClick setOpen(false)).
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        if (!link.dataset.fecha) {
            link.dataset.fecha = '1';
            link.addEventListener('click', () => sidebar?.classList.remove('open'));
        }
    });
}

function sair() {
    if (typeof ConectaTIAPI !== 'undefined') ConectaTIAPI.limparSessao();
    window.location.href = 'login.html';
}

// ========================
// DADOS LOCAIS (portados do web data.ts/store.ts — mesmas chaves)
// Usados por: unidades, usuarios (local), mapa-salas, minhas-turmas.
// Ficam no navegador, como no web; nada disso existe no backend.
// ========================

const SALAS_BASE = [
    { nome: 'Sala 01', tipo: 'Sala', chave: null }, { nome: 'Sala 02', tipo: 'Sala', chave: null },
    { nome: 'Sala 03', tipo: 'Sala', chave: null }, { nome: 'Sala 04', tipo: 'Sala', chave: null },
    { nome: 'Sala 05', tipo: 'Sala', chave: null }, { nome: 'Sala 08', tipo: 'Sala', chave: null },
    { nome: 'Sala 12', tipo: 'Sala', chave: null }, { nome: 'Sala 15', tipo: 'Sala', chave: null },
    { nome: 'Lab 01', tipo: 'Laboratório', chave: null },
    { nome: 'Lab 02', tipo: 'Laboratório', chave: null },
    { nome: 'Lab 03', tipo: 'Laboratório', chave: null },
    { nome: 'Auditório', tipo: 'Auditório', chave: null }
];

const USUARIOS_BASE = [
    { id: 'u1', nome: 'Rayssa Paiva', email: 'rayssa@senacdf.com.br', perfil: 'Instrutor', unidade: 'Senac Taguatinga Sul - Taguatinga/DF' },
    { id: 'u2', nome: 'Carla Mendes', email: 'carla@senacdf.com.br', perfil: 'Coordenação', unidade: 'Senac Taguatinga Sul - Taguatinga/DF' },
    { id: 'u3', nome: 'Paulo Lima', email: 'paulo@senacdf.com.br', perfil: 'Instrutor', unidade: 'Senac Taguatinga Sul - Taguatinga/DF' },
    { id: 'u4', nome: 'Ana Coordenação', email: 'ana.coord@senacdf.com.br', perfil: 'Coordenação', unidade: 'Senac Taguatinga Sul - Taguatinga/DF' },
    { id: 'u5', nome: 'João Suporte', email: 'joao.ti@senacdf.com.br', perfil: 'Suporte TI', unidade: 'Senac Taguatinga Sul - Taguatinga/DF' },
    { id: 'u6', nome: 'Mariana Admin', email: 'admin@senacdf.com.br', perfil: 'Administrador', unidade: 'Senac Taguatinga Sul - Taguatinga/DF' }
];

const UNIDADES_BASE = [
    { id: 'un1', nome: 'Senac Taguatinga Sul', cidade: 'Taguatinga/DF', salas: 12 },
    { id: 'un2', nome: 'Senac Plano Piloto', cidade: 'Brasília/DF', salas: 20 },
    { id: 'un3', nome: 'Senac Ceilândia', cidade: 'Ceilândia/DF', salas: 14 }
];

const TURMAS_DEFAULT = [
    { id: 't1', curso: 'Técnico em Desenvolvimento de Sistemas', turma: 'TDS Manhã', horario: '08:00 - 12:00', dias: 'Seg / Qua / Sex', alunos: 28 },
    { id: 't2', curso: 'Informática Básica', turma: 'INF-B Noite', horario: '19:00 - 22:00', dias: 'Ter / Qui', alunos: 22 },
    { id: 't3', curso: 'Design Gráfico', turma: 'DG Tarde', horario: '14:00 - 17:00', dias: 'Seg à Sex', alunos: 18 }
];

function lerLocal(chave, padrao) {
    try {
        const v = localStorage.getItem(chave);
        return v ? JSON.parse(v) : padrao;
    } catch {
        return padrao;
    }
}

function garantirSemente(chave, semente) {
    if (!localStorage.getItem(chave)) localStorage.setItem(chave, JSON.stringify(semente));
    return lerLocal(chave, semente);
}

const getSalasLocal = () => garantirSemente('conectati_salas', SALAS_BASE);
const setSalasLocal = (v) => localStorage.setItem('conectati_salas', JSON.stringify(v));
const getUsuariosLocal = () => garantirSemente('conectati_usuarios', USUARIOS_BASE);
const setUsuariosLocal = (v) => localStorage.setItem('conectati_usuarios', JSON.stringify(v));
const getUnidadesLocal = () => garantirSemente('conectati_unidades', UNIDADES_BASE);
const setUnidadesLocal = (v) => localStorage.setItem('conectati_unidades', JSON.stringify(v));
const getSolicitacoesLocal = () => garantirSemente('conectati_solicitacoes', []);
const setSolicitacoesLocal = (v) => localStorage.setItem('conectati_solicitacoes', JSON.stringify(v));

// ========================
// LOGIN (login.tsx: e-mail + senha; papel vem do token)
// ========================

async function validarLogin(event) {
    event?.preventDefault();
    const email = document.getElementById('email')?.value.trim() || '';
    const senha = document.getElementById('senha')?.value || '';
    const alerta = document.getElementById('loginAlerta');

    function mostrarAlerta(tipo, msg) {
        if (alerta) {
            alerta.className = `alerta ${tipo}`;
            alerta.textContent = msg;
            alerta.style.display = 'block';
        }
        toast(msg);
    }

    if (!email || !senha) {
        mostrarAlerta('erro', 'Informe e-mail e senha para continuar.');
        return false;
    }

    try {
        const sessao = await ConectaTIAPI.login(email, senha);

        if (!sessao?.token || !sessao?.usuario?.tipo) {
            mostrarAlerta('erro', 'Resposta de login inválida. Tente novamente.');
            return false;
        }

        ConectaTIAPI.salvarSessao(sessao);

        const perfil = getPerfilUsuario();
        if (perfil === 'Visitante') {
            ConectaTIAPI.limparSessao();
            mostrarAlerta('erro', 'Perfil desconhecido. Procure o administrador do sistema.');
            return false;
        }

        mostrarAlerta('sucesso', `Bem-vindo(a), ${sessao.usuario.nome}.`);
        setTimeout(() => {
            window.location.href = paginaInicialPorPerfil(perfil);
        }, 600);
    } catch (error) {
        mostrarAlerta('erro', error.message);
    }
    return false;
}

// ========================
// DASHBOARD (dashboard.tsx: 4 KPIs calculados de /chamados + /equipamentos)
// ========================

async function iniciarDashboard() {
    const erroEl = document.getElementById('dashboardErro');
    try {
        const usuario = getPerfilUsuario();
        const promessaEquipamentos = usuario === 'INSTRUTOR'
            ? Promise.resolve([])
            : ConectaTIAPI.listarEquipamentos();
        const [listaChamados, listaEquipamentos] = await Promise.all([
            ConectaTIAPI.listarChamados(),
            promessaEquipamentos
        ]);

        const cards = [
            [(listaChamados || []).length, 'Chamados'],
            [(listaChamados || []).filter(i => i.status === 'ABERTO').length, 'Abertos'],
            [(listaChamados || []).filter(i => i.status === 'CONCLUIDO').length, 'Concluidos'],
            [(listaEquipamentos || []).length, 'Equipamentos']
        ];

        cards.forEach(([valor, titulo]) => {
            const alvo = { 'Chamados': 'kpiChamados', 'Abertos': 'kpiAbertos', 'Concluidos': 'kpiConcluidos', 'Equipamentos': 'kpiEquipamentos' }[titulo];
            definirTexto(alvo, valor);
        });
    } catch (error) {
        const mensagem = error?.message || 'Não foi possível carregar os dados do dashboard.';
        if (erroEl) {
            erroEl.textContent = mensagem;
            erroEl.style.display = 'block';
        }
        toast(mensagem);
    }
}

// ========================
// CHAMADOS (chamados.tsx: busca + tabela + badges slug)
// ========================

let chamadosCache = [];

async function iniciarChamados() {
    const erroEl = document.getElementById('chamadosErro');
    const buscaEl = document.getElementById('buscaChamados');
    if (buscaEl && !buscaEl.dataset.ligado) {
        buscaEl.dataset.ligado = '1';
        buscaEl.addEventListener('input', () => renderizarChamados());
    }
    try {
        chamadosCache = (await ConectaTIAPI.listarChamados()) || [];
        renderizarChamados();
    } catch (error) {
        const mensagem = error?.message || 'Não foi possível carregar os chamados.';
        if (erroEl) {
            erroEl.textContent = mensagem;
            erroEl.style.display = 'block';
        }
    }
}

function renderizarChamados() {
    const tbody = document.getElementById('listaChamados');
    if (!tbody) return;

    const perm = FLAGS_POR_PERFIL[getPerfilUsuario()] || {};
    const usuario = getSessaoSegura()?.usuario;
    const busca = document.getElementById('buscaChamados')?.value.trim().toLowerCase() || '';

    const filtrados = chamadosCache.filter(item =>
        (perm.verChamados !== 'proprios' || item.solicitanteId === usuario?.id)
        && (!busca || `${item.titulo} ${item.solicitanteNome || ''} ${item.categoriaNome || ''}`.toLowerCase().includes(busca))
    );

    tbody.innerHTML = filtrados.map(item => `
        <tr>
            <td><b>#${escaparHTML(item.id)}</b></td>
            <td>${escaparHTML(item.titulo)}</td>
            <td>${escaparHTML(item.solicitanteNome || '-')}</td>
            <td>${escaparHTML(item.categoriaNome || '-')}</td>
            <td>${escaparHTML(item.salaNome || '-')}</td>
            <td><span class="prioridade ${slug(item.prioridade)}">${escaparHTML(item.prioridade)}</span></td>
            <td><span class="status ${slug(item.status)}">${escaparHTML(item.status)}</span></td>
            <td>${item.dataCriacao ? escaparHTML(new Date(item.dataCriacao).toLocaleDateString('pt-BR')) : '-'}</td>
        </tr>
    `).join('');

    const vazio = document.getElementById('chamadosVazio');
    if (vazio) vazio.style.display = (!chamadosCache.length || filtrados.length) ? 'none' : 'block';

    // Botão "+ Novo chamado" obedece a flag novoChamado do web (topbar do chamados.tsx).
    const btnNovo = document.getElementById('btnNovoChamado');
    if (btnNovo) btnNovo.style.display = perm.novoChamado ? 'inline-flex' : 'none';
}

// ========================
// NOVO CHAMADO (novo-chamado.tsx: categorias e salas da API)
// ========================

async function iniciarNovoChamado() {
    const alerta = document.getElementById('novoChamadoAlerta');
    const selectCategoria = document.getElementById('categoriaId');
    const selectSala = document.getElementById('salaId');

    try {
        const [categorias, salas] = await Promise.all([
            ConectaTIAPI.listarCategorias(),
            ConectaTIAPI.listarSalas()
        ]);
        if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="">Selecione</option>' +
                (categorias || []).map(c => `<option value="${escaparHTML(c.id)}">${escaparHTML(c.nome)}</option>`).join('');
        }
        if (selectSala) {
            selectSala.innerHTML = '<option value="">Nao informar</option>' +
                (salas || []).map(s => `<option value="${escaparHTML(s.id)}">${escaparHTML(s.nome)}</option>`).join('');
        }
    } catch (error) {
        if (alerta) {
            alerta.className = 'alerta erro';
            alerta.textContent = error.message;
            alerta.style.display = 'block';
        }
    }

    const form = document.getElementById('formNovoChamado');
    if (form && !form.dataset.ligado) {
        form.dataset.ligado = '1';
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const titulo = document.getElementById('tituloChamado')?.value.trim();
            const descricao = document.getElementById('descricaoChamado')?.value.trim();
            const prioridade = document.getElementById('prioridadeChamado')?.value;
            const categoriaId = selectCategoria?.value;
            const salaId = selectSala?.value;

            if (!titulo || !descricao || !categoriaId) {
                toast('Preencha titulo, descricao e categoria.');
                return;
            }

            try {
                const chamado = await ConectaTIAPI.criarChamado({
                    titulo,
                    descricao,
                    prioridade,
                    categoriaId: Number(categoriaId),
                    ...(salaId ? { salaId: Number(salaId) } : {})
                });
                if (alerta) {
                    alerta.className = 'alerta sucesso';
                    alerta.style.display = 'block';
                    alerta.textContent = `Chamado #${chamado?.id ?? ''} criado com sucesso.`;
                }
                toast(`Chamado #${chamado?.id ?? ''} criado com sucesso.`);
                form.reset();
            } catch (error) {
                if (alerta) {
                    alerta.className = 'alerta erro';
                    alerta.textContent = error.message;
                    alerta.style.display = 'block';
                }
            }
        });
    }
}

// ========================
// EQUIPAMENTOS (equipamentos.tsx: grid de cards)
// ========================

async function iniciarEquipamentos() {
    const erroEl = document.getElementById('equipamentosErro');
    const grid = document.getElementById('gridEquipamentos');
    try {
        const itens = (await ConectaTIAPI.listarEquipamentos()) || [];
        if (grid) {
            grid.innerHTML = itens.map(item => `
                <div class="equip-card ${slug(item.status)}">
                    <h4>${escaparHTML(item.nome)}</h4>
                    <p class="tipo">${escaparHTML(item.tipo || '—')}</p>
                    <p class="patr">Patrimônio ${escaparHTML(item.patrimonio)}</p>
                    <span class="status ${slug(item.status)}">${escaparHTML(item.status)}</span>
                    <p class="loc">${escaparHTML(item.salaNome || 'Sem sala')}</p>
                </div>
            `).join('');
        }
        const vazio = document.getElementById('equipamentosVazio');
        if (vazio) vazio.style.display = itens.length ? 'none' : 'block';
    } catch (error) {
        const mensagem = error?.message || 'Não foi possível carregar os equipamentos.';
        if (erroEl) {
            erroEl.textContent = mensagem;
            erroEl.style.display = 'block';
        }
    }
}

// ========================
// RELATORIOS (relatorios.tsx: KPIs e barras estáticos + toast)
// ========================

function iniciarRelatorios() {
    const contadores = [['relChamadosMes', 128], ['relResolvidos', 96], ['relPendentes', 12], ['relReservas', 47]];
    contadores.forEach(([id, valor]) => animarContador(document.getElementById(id), valor));

    const acoes = [['btnFiltrarMes', 'Filtrar por mês'], ['btnFiltrarCategoria', 'Filtrar por categoria'], ['btnGerarRelatorio', 'Gerar relatório'], ['btnExportarPdf', 'Exportar PDF']];
    acoes.forEach(([id, nome]) => {
        const btn = document.getElementById(id);
        if (btn && !btn.dataset.ligado) {
            btn.dataset.ligado = '1';
            btn.addEventListener('click', () => toast(`${nome} — ação simulada`));
        }
    });
}

// ========================
// USUARIOS (usuarios.tsx, com dados LOCAIS — sem backend ainda)
// ========================

function iniciarUsuarios() {
    renderizarUsuariosLocais();
    const btnNovo = document.getElementById('btnNovoUsuario');
    if (btnNovo && !btnNovo.dataset.ligado) {
        btnNovo.dataset.ligado = '1';
        btnNovo.addEventListener('click', () => { window.location.href = 'criar-usuario.html'; });
    }
}

function renderizarUsuariosLocais() {
    const tbody = document.getElementById('listaUsuarios');
    if (!tbody) return;
    const itens = getUsuariosLocal();
    tbody.innerHTML = itens.map(item => `
        <tr>
            <td>${escaparHTML(item.nome)}</td>
            <td>${escaparHTML(item.email)}</td>
            <td>${escaparHTML(item.perfil)}</td>
            <td>${item.ativo === false ? 'Nao' : 'Sim'}</td>
            <td><button class="btn btn-sm btn-ghost" data-desativar="${escaparHTML(item.id)}">Desativar</button></td>
        </tr>
    `).join('');

    tbody.querySelectorAll('button[data-desativar]').forEach(btn => {
        if (btn.dataset.ligado) return;
        btn.dataset.ligado = '1';
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-desativar');
            if (!confirm('Desativar este usuario?')) return;
            const lista = getUsuariosLocal();
            const alvo = lista.find(u => u.id === id);
            if (alvo) {
                alvo.ativo = false;
                setUsuariosLocal(lista);
                toast('Usuario desativado.');
                renderizarUsuariosLocais();
            }
        });
    });
}

// ========================
// UNIDADES (unidades.tsx, dados LOCAIS; criar segue em tela própria)
// ========================

function iniciarUnidades() {
    renderizarUnidadesLocal();

    const btnNova = document.getElementById('btnNovaUnidade');
    if (btnNova && !btnNova.dataset.ligado) {
        btnNova.dataset.ligado = '1';
        btnNova.addEventListener('click', () => { window.location.href = 'criar-unidade.html'; });
    }

    const modal = document.getElementById('modalUnidade');
    const form = document.getElementById('formEditarUnidade');
    if (form && !form.dataset.ligado) {
        form.dataset.ligado = '1';
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const id = form.dataset.editando;
            const dados = {
                nome: document.getElementById('unidadeNome')?.value.trim() || '',
                cidade: document.getElementById('unidadeCidade')?.value.trim() || '',
                salas: parseInt(document.getElementById('unidadeSalas')?.value, 10) || 0
            };
            if (!dados.nome) { toast('Informe o nome.'); return; }
            const lista = getUnidadesLocal();
            const alvo = lista.find(u => u.id === id);
            if (alvo) Object.assign(alvo, dados);
            setUnidadesLocal(lista);
            toast('Unidade atualizada.');
            fecharModalUnidade();
            renderizarUnidadesLocal();
        });
    }
    if (modal && !modal.dataset.ligado) {
        modal.dataset.ligado = '1';
        modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalUnidade(); });
    }
    const btnCancelar = document.getElementById('btnCancelarUnidade');
    if (btnCancelar && !btnCancelar.dataset.ligado) {
        btnCancelar.dataset.ligado = '1';
        btnCancelar.addEventListener('click', fecharModalUnidade);
    }
}

function fecharModalUnidade() {
    document.getElementById('modalUnidade')?.classList.add('hidden');
}

function renderizarUnidadesLocal() {
    const tbody = document.getElementById('listaUnidades');
    if (!tbody) return;
    const itens = getUnidadesLocal();
    tbody.innerHTML = itens.map(u => `
        <tr>
            <td><b>${escaparHTML(u.nome)}</b></td>
            <td>${escaparHTML(u.cidade)}</td>
            <td>${escaparHTML(u.salas)}</td>
            <td>
                <button class="btn btn-sm btn-ghost" data-editar="${escaparHTML(u.id)}">Editar</button>
                <button class="btn btn-sm btn-ghost" data-excluir="${escaparHTML(u.id)}">Excluir</button>
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('button[data-editar]').forEach(btn => {
        if (btn.dataset.ligado) return;
        btn.dataset.ligado = '1';
        btn.addEventListener('click', () => {
            const u = getUnidadesLocal().find(x => x.id === btn.getAttribute('data-editar'));
            if (!u) return;
            const form = document.getElementById('formEditarUnidade');
            if (form) form.dataset.editando = u.id;
            definirTexto('unidadeNome', u.nome);
            definirTexto('unidadeCidade', u.cidade);
            definirTexto('unidadeSalas', u.salas);
            document.getElementById('modalUnidade')?.classList.remove('hidden');
        });
    });

    tbody.querySelectorAll('button[data-excluir]').forEach(btn => {
        if (btn.dataset.ligado) return;
        btn.dataset.ligado = '1';
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-excluir');
            if (!confirm('Excluir esta unidade?')) return;
            setUnidadesLocal(getUnidadesLocal().filter(x => x.id !== id));
            toast('Unidade excluída.');
            renderizarUnidadesLocal();
        });
    });
}

// ========================
// ADMINISTRAÇÃO (admin.tsx: KPIs + atalhos + chamados recentes)
// [*] Usuarios vem do store local (sem backend ainda).
// ========================

async function iniciarAdmin() {
    // admin.tsx: não-ADMIN volta ao login.
    if (getPerfilUsuario() !== 'ADMINISTRADOR') {
        window.location.replace('login.html');
        return;
    }

    const carregando = document.getElementById('adminCarregando');
    try {
        const [chamados, equipamentos] = await Promise.all([
            ConectaTIAPI.listarChamados(),
            ConectaTIAPI.listarEquipamentos()
        ]);
        const usuarios = getUsuariosLocal();

        if (carregando) carregando.style.display = 'none';

        const abertos = (chamados || []).filter(i => i.status === 'ABERTO').length;
        definirTexto('adminUsuarios', usuarios.length);
        definirTexto('adminChamados', (chamados || []).length);
        definirTexto('adminAbertos', abertos);
        definirTexto('adminEquipamentos', (equipamentos || []).length);

        const tbody = document.getElementById('adminRecentes');
        if (tbody) {
            tbody.innerHTML = (chamados || []).slice(0, 6).map(item => `
                <tr>
                    <td>#${escaparHTML(item.id)}</td>
                    <td>${escaparHTML(item.titulo)}</td>
                    <td>${escaparHTML(item.status)}</td>
                    <td>${escaparHTML(item.solicitanteNome || '-')}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        if (carregando) carregando.style.display = 'none';
        const erroEl = document.getElementById('adminErro');
        if (erroEl) {
            erroEl.textContent = error.message;
            erroEl.style.display = 'block';
        }
    }
}

// ========================
// MAPA DE SALAS (mapa-salas.tsx: chaves + solicitações, dados locais)
// ========================

let salaSelecionada = null;
let solicitacaoSelecionada = null;

function iniciarMapaSalas() {
    renderizarMapaSalas();
    const form = document.getElementById('formChave');
    if (form && !form.dataset.ligado) {
        form.dataset.ligado = '1';
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!salaSelecionada) return;
            const respId = document.getElementById('chaveResponsavel')?.value;
            const motivo = document.getElementById('chaveMotivo')?.value.trim() || '';
            const resp = getUsuariosLocal().find(u => u.id === respId);
            if (!resp) return;
            const arr = getSalasLocal();
            const idx = arr.findIndex(x => x.nome === salaSelecionada);
            if (idx < 0) return;
            arr[idx].chave = { responsavelId: resp.id, responsavelNome: resp.nome, perfil: resp.perfil, motivo, desde: new Date().toISOString() };
            setSalasLocal(arr);
            if (solicitacaoSelecionada) {
                const sols = getSolicitacoesLocal();
                const s = sols.find(x => x.id === solicitacaoSelecionada);
                if (s) { s.status = 'Atribuída'; s.salaAtribuida = salaSelecionada; setSolicitacoesLocal(sols); }
            }
            toast(`Chave da ${salaSelecionada} entregue a ${resp.nome}.`);
            fecharModalChave();
            renderizarMapaSalas();
        });
    }
    const btnCancelar = document.getElementById('btnCancelarChave');
    if (btnCancelar && !btnCancelar.dataset.ligado) {
        btnCancelar.dataset.ligado = '1';
        btnCancelar.addEventListener('click', fecharModalChave);
    }
    const modal = document.getElementById('modalChave');
    if (modal && !modal.dataset.ligado) {
        modal.dataset.ligado = '1';
        modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalChave(); });
    }
}

function fecharModalChave() {
    document.getElementById('modalChave')?.classList.add('hidden');
}

function abrirModalChave(sala, opts = {}) {
    salaSelecionada = sala;
    solicitacaoSelecionada = opts.solicitacaoId || null;
    const responsaveis = getUsuariosLocal().filter(u => u.perfil === 'Instrutor' || u.perfil === 'Coordenação');
    const select = document.getElementById('chaveResponsavel');
    if (select) {
        select.innerHTML = responsaveis.map(u => `<option value="${escaparHTML(u.id)}">${escaparHTML(u.nome)} — ${escaparHTML(u.perfil)}</option>`).join('');
        if (opts.respId) select.value = opts.respId;
    }
    definirTexto('chaveMotivo', opts.motivo || '');
    definirTexto('modalChaveTitulo', `Atribuir chave — ${sala}`);
    document.getElementById('modalChave')?.classList.remove('hidden');
}

function renderizarMapaSalas() {
    const salas = getSalasLocal();
    const pend = getSolicitacoesLocal().filter(s => s.status === 'Pendente');

    definirTexto('kpiSalasLivres', salas.filter(s => !s.chave).length);
    definirTexto('kpiChavesUso', salas.length - salas.filter(s => !s.chave).length);
    definirTexto('kpiPendentes', pend.length);
    definirTexto('kpiSalasTotal', salas.length);

    const grid = document.getElementById('mapaSalas');
    if (grid) {
        grid.innerHTML = salas.map(s => {
            const emUso = !!s.chave;
            return `
            <div class="sala-cell ${emUso ? 'ocupada' : 'livre'} ${slug(s.tipo)}">
                <div class="sala-topo"><b>${escaparHTML(s.nome)}</b><span class="badge-mini">${escaparHTML(s.tipo)}</span></div>
                <div class="sala-status">
                    ${emUso
                        ? `<span class="status em-atendimento">Chave com ${escaparHTML(s.chave.responsavelNome)}</span><small class="muted">${escaparHTML(s.chave.motivo || '')}</small>`
                        : '<span class="status resolvido">Chave disponível</span>'}
                </div>
                <div class="sala-actions">
                    ${emUso
                        ? `<button class="btn btn-sm btn-ghost" data-devolver="${escaparHTML(s.nome)}">Devolver chave</button>`
                        : `<button class="btn btn-sm btn-primary" data-atribuir="${escaparHTML(s.nome)}">Atribuir chave</button>`}
                </div>
            </div>`;
        }).join('');
    }

    grid?.querySelectorAll('button[data-atribuir]').forEach(btn => {
        btn.addEventListener('click', () => abrirModalChave(btn.getAttribute('data-atribuir')));
    });
    grid?.querySelectorAll('button[data-devolver]').forEach(btn => {
        btn.addEventListener('click', () => {
            const nome = btn.getAttribute('data-devolver');
            const arr = getSalasLocal();
            const idx = arr.findIndex(x => x.nome === nome);
            if (idx < 0) return;
            arr[idx].chave = null;
            setSalasLocal(arr);
            toast(`Chave da ${nome} devolvida.`);
            renderizarMapaSalas();
        });
    });

    const tbody = document.getElementById('tabelaPendentes');
    if (tbody) {
        const usuarios = getUsuariosLocal();
        tbody.innerHTML = pend.map(s => {
            const inst = usuarios.find(u => u.email.toLowerCase() === s.instrutorEmail);
            return `
            <tr>
                <td><b>#${escaparHTML(s.n)}</b></td>
                <td>${escaparHTML(s.instrutorNome)}</td>
                <td>${escaparHTML(s.turma)}</td>
                <td>${escaparHTML(s.salaPreferida)}</td>
                <td>${escaparHTML(s.data)}</td>
                <td>${escaparHTML(s.hora)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" data-atribuir-sol="${escaparHTML(s.id)}">Atribuir chave</button>
                    <button class="btn btn-sm btn-ghost" data-negar="${escaparHTML(s.id)}">Negar</button>
                </td>
            </tr>`;
        }).join('');
        const vazio = document.getElementById('pendentesVazio');
        if (vazio) vazio.style.display = pend.length ? 'none' : 'block';
    }

    document.querySelectorAll('button[data-atribuir-sol]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sol = getSolicitacoesLocal().find(x => x.id === btn.getAttribute('data-atribuir-sol'));
            if (!sol) return;
            const usuarios = getUsuariosLocal();
            const inst = usuarios.find(u => u.email.toLowerCase() === sol.instrutorEmail);
            abrirModalChave(sol.salaPreferida, { solicitacaoId: sol.id, respId: inst?.id, motivo: `${sol.turma} — ${sol.data} ${sol.hora}` });
        });
    });
    document.querySelectorAll('button[data-negar]').forEach(btn => {
        btn.addEventListener('click', () => {
            const arr = getSolicitacoesLocal();
            const s = arr.find(x => x.id === btn.getAttribute('data-negar'));
            if (!s) return;
            s.status = 'Negada';
            setSolicitacoesLocal(arr);
            toast('Solicitação negada.');
            renderizarMapaSalas();
        });
    });
}

// ========================
// MINHAS TURMAS (minhas-turmas.tsx: cards + solicitação de sala)
// ========================

let turmaSelecionada = null;

function iniciarMinhasTurmas() {
    const grid = document.getElementById('gridTurmas');
    if (grid && !grid.dataset.ligado) {
        grid.dataset.ligado = '1';
        grid.innerHTML = TURMAS_DEFAULT.map((t, i) => `
            <div class="card turma-card" style="animation-delay:${i * 60}ms">
                <div class="turma-head">
                    <h3>${escaparHTML(t.turma)}</h3>
                    <span class="badge-mini">${escaparHTML(t.alunos)} alunos</span>
                </div>
                <p class="muted">${escaparHTML(t.curso)}</p>
                <div class="turma-info">
                    <span><b>Horário:</b> ${escaparHTML(t.horario)}</span>
                    <span><b>Dias:</b> ${escaparHTML(t.dias)}</span>
                </div>
                <button class="btn btn-primary btn-block" data-turma="${escaparHTML(t.id)}">Solicitar sala</button>
            </div>
        `).join('');
        grid.querySelectorAll('button[data-turma]').forEach(btn => {
            btn.addEventListener('click', () => abrirModalTurma(TURMAS_DEFAULT.find(t => t.id === btn.getAttribute('data-turma'))));
        });
    }
    renderizarMinhasSolicitacoes();

    const form = document.getElementById('formSolicitacao');
    if (form && !form.dataset.ligado) {
        form.dataset.ligado = '1';
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!turmaSelecionada) return;
            const email = getEmailUsuario().toLowerCase();
            const nova = {
                id: uid('sol'),
                n: String(Math.floor(Math.random() * 900) + 100),
                instrutorEmail: email,
                instrutorNome: getUsuariosLocal().find(u => u.email.toLowerCase() === email)?.nome || getNomeUsuario() || 'Instrutor',
                turma: turmaSelecionada.turma,
                salaPreferida: document.getElementById('solSala')?.value || '',
                data: document.getElementById('solData')?.value || '',
                hora: document.getElementById('solHora')?.value || '',
                obs: document.getElementById('solObs')?.value.trim() || '',
                status: 'Pendente',
                salaAtribuida: null
            };
            const arr = getSolicitacoesLocal();
            arr.push(nova);
            setSolicitacoesLocal(arr);
            toast('Solicitação enviada.');
            fecharModalTurma();
            renderizarMinhasSolicitacoes();
        });
    }
    const btnCancelar = document.getElementById('btnCancelarSolicitacao');
    if (btnCancelar && !btnCancelar.dataset.ligado) {
        btnCancelar.dataset.ligado = '1';
        btnCancelar.addEventListener('click', fecharModalTurma);
    }
    const modal = document.getElementById('modalSolicitacao');
    if (modal && !modal.dataset.ligado) {
        modal.dataset.ligado = '1';
        modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalTurma(); });
    }
}

function abrirModalTurma(turma) {
    if (!turma) return;
    turmaSelecionada = turma;
    definirTexto('modalSolicitacaoTitulo', `Solicitar sala — ${turma.turma}`);
    definirTexto('solData', new Date().toISOString().slice(0, 10));
    definirTexto('solHora', turma.horario.slice(0, 5));
    definirTexto('solObs', '');
    const select = document.getElementById('solSala');
    if (select) {
        select.innerHTML = getSalasLocal().map(s => `<option value="${escaparHTML(s.nome)}">${escaparHTML(s.nome)} (${escaparHTML(s.tipo)})</option>`).join('');
    }
    document.getElementById('modalSolicitacao')?.classList.remove('hidden');
}

function fecharModalTurma() {
    document.getElementById('modalSolicitacao')?.classList.add('hidden');
    turmaSelecionada = null;
}

function renderizarMinhasSolicitacoes() {
    const tbody = document.getElementById('listaSolicitacoes');
    if (!tbody) return;
    const email = getEmailUsuario().toLowerCase();
    const minhas = getSolicitacoesLocal().filter(s => s.instrutorEmail === email).slice().reverse();
    tbody.innerHTML = minhas.map(s => `
        <tr>
            <td><b>#${escaparHTML(s.n)}</b></td>
            <td>${escaparHTML(s.turma)}</td>
            <td>${escaparHTML(s.salaPreferida)}</td>
            <td>${escaparHTML(s.data)}</td>
            <td>${escaparHTML(s.hora)}</td>
            <td><span class="status ${slug(s.status)}">${escaparHTML(s.status)}</span></td>
            <td>${escaparHTML(s.salaAtribuida || '—')}</td>
        </tr>
    `).join('');
    const vazio = document.getElementById('solicitacoesVazio');
    if (vazio) vazio.style.display = minhas.length ? 'none' : 'block';
}

// ========================
// GERENCIAR CHAMADO (TECNICO — API real: assumir/status/chat)
// ========================

let gerenciarCache = [];

async function iniciarGerenciar() {
    ['buscaGerenciar', 'filtroStatusGerenciar', 'filtroPrioridadeGerenciar'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.ligado) {
            el.dataset.ligado = '1';
            el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', renderizarGerenciar);
        }
    });
    try {
        gerenciarCache = (await ConectaTIAPI.listarChamados()) || [];
        renderizarGerenciar();
    } catch (error) {
        const erroEl = document.getElementById('gerenciarErro');
        if (erroEl) {
            erroEl.textContent = error.message;
            erroEl.style.display = 'block';
        }
    }
}

function renderizarGerenciar() {
    const tbody = document.getElementById('listaGerenciar');
    if (!tbody) return;

    const busca = document.getElementById('buscaGerenciar')?.value.trim().toLowerCase() || '';
    const fStatus = document.getElementById('filtroStatusGerenciar')?.value || 'todos';
    const fPrioridade = document.getElementById('filtroPrioridadeGerenciar')?.value || 'todos';

    const filtrados = gerenciarCache.filter(item =>
        (!busca || `${item.titulo} ${item.solicitanteNome || ''}`.toLowerCase().includes(busca))
        && (fStatus === 'todos' || item.status === fStatus)
        && (fPrioridade === 'todos' || item.prioridade === fPrioridade)
    );

    tbody.innerHTML = filtrados.map(item => `
        <tr>
            <td><b>#${escaparHTML(item.id)}</b></td>
            <td>${escaparHTML(item.titulo)}</td>
            <td>${escaparHTML(item.categoriaNome || '-')}</td>
            <td><span class="prioridade ${slug(item.prioridade)}">${escaparHTML(item.prioridade)}</span></td>
            <td><span class="status ${slug(item.status)}">${escaparHTML(item.status)}</span></td>
            <td>${item.dataCriacao ? escaparHTML(new Date(item.dataCriacao).toLocaleDateString('pt-BR')) : '-'}</td>
            <td>
                <div class="acoes-chamado">
                    ${item.status === 'ABERTO' ? `<button class="btn btn-sm btn-primary" data-acao="assumir" data-id="${escaparHTML(item.id)}">Assumir</button>` : ''}
                    ${item.status !== 'CONCLUIDO' && item.status !== 'CANCELADO' ? `<button class="btn btn-sm btn-outline" data-acao="concluir" data-id="${escaparHTML(item.id)}">Concluir</button>` : ''}
                    ${item.status !== 'CONCLUIDO' && item.status !== 'CANCELADO' ? `<button class="btn btn-sm btn-ghost" data-acao="cancelar" data-id="${escaparHTML(item.id)}">Cancelar</button>` : ''}
                    <button class="btn btn-sm btn-ghost" data-acao="chat" data-id="${escaparHTML(item.id)}">Chat</button>
                </div>
            </td>
        </tr>
    `).join('');

    const vazio = document.getElementById('gerenciarVazio');
    if (vazio) vazio.style.display = filtrados.length ? 'none' : 'block';

    tbody.querySelectorAll('button[data-acao]').forEach(btn => {
        if (btn.dataset.ligado) return;
        btn.dataset.ligado = '1';
        btn.addEventListener('click', () => acaoGerenciar(btn.getAttribute('data-acao'), btn.getAttribute('data-id')));
    });
}

async function acaoGerenciar(acao, id) {
    try {
        if (acao === 'assumir') {
            await ConectaTIAPI.assumirChamado(id);
            toast(`Chamado #${id} assumido.`);
        } else if (acao === 'concluir') {
            const solucao = prompt('Informe a solucao aplicada (opcional):') || undefined;
            await ConectaTIAPI.atualizarStatusChamado(id, { status: 'CONCLUIDO', ...(solucao ? { solucao } : {}) });
            toast(`Chamado #${id} concluído.`);
        } else if (acao === 'cancelar') {
            const justificativa = prompt('Informe a justificativa do cancelamento (opcional):') || undefined;
            await ConectaTIAPI.atualizarStatusChamado(id, { status: 'CANCELADO', ...(justificativa ? { justificativaCancelamento: justificativa } : {}) });
            toast(`Chamado #${id} cancelado.`);
        } else if (acao === 'chat') {
            sessionStorage.setItem('chatChamadoId', id);
            window.location.href = 'chat.html';
        }
        gerenciarCache = (await ConectaTIAPI.listarChamados()) || [];
        renderizarGerenciar();
    } catch (error) {
        toast(error.message);
    }
}

// ========================
// CHAT REAL POR CHAMADO (GET/POST /chat/chamados/{id}/mensagens)
// Conversas = chamados que o perfil já enxerga em /chamados.
// ========================

let chatChamadoAtual = null;

async function iniciarChat() {
    const lista = document.getElementById('chatListaChamados');
    try {
        const chamados = (await ConectaTIAPI.listarChamados()) || [];
        if (lista) {
            lista.innerHTML = chamados.map(item => `
                <div class="chat-item" data-chamado="${escaparHTML(item.id)}">
                    <b>#${escaparHTML(item.id)} · ${escaparHTML(item.titulo)}</b>
                    <small>${escaparHTML(item.categoriaNome || '-')} · ${escaparHTML(item.status)}</small>
                </div>
            `).join('');
            lista.querySelectorAll('.chat-item').forEach(item => {
                item.addEventListener('click', () => abrirConversa(item.getAttribute('data-chamado')));
            });
        }

        const preSelecionado = sessionStorage.getItem('chatChamadoId');
        if (preSelecionado && chamados.some(c => String(c.id) === preSelecionado)) {
            abrirConversa(preSelecionado);
        }
    } catch (error) {
        const erroEl = document.getElementById('chatErro');
        if (erroEl) {
            erroEl.textContent = error.message;
            erroEl.style.display = 'block';
        }
    }

    const btnAtualizar = document.getElementById('btnAtualizarChat');
    if (btnAtualizar && !btnAtualizar.dataset.ligado) {
        btnAtualizar.dataset.ligado = '1';
        btnAtualizar.addEventListener('click', () => { if (chatChamadoAtual) abrirConversa(chatChamadoAtual); });
    }

    const input = document.getElementById('chatInput');
    const btnEnviar = document.getElementById('btnEnviarChat');
    const enviar = () => enviarMensagemAtual();
    if (btnEnviar && !btnEnviar.dataset.ligado) {
        btnEnviar.dataset.ligado = '1';
        btnEnviar.addEventListener('click', enviar);
    }
    if (input && !input.dataset.ligado) {
        input.dataset.ligado = '1';
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviar(); });
    }
}

async function abrirConversa(chamadoId) {
    chatChamadoAtual = chamadoId;
    sessionStorage.setItem('chatChamadoId', chamadoId);
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-chamado') === String(chamadoId));
    });

    const container = document.getElementById('chatMensagens');
    const topo = document.getElementById('chatTitulo');
    if (topo) topo.textContent = `Chamado #${chamadoId}`;
    if (!container) return;
    container.innerHTML = '<p class="muted center">Carregando mensagens...</p>';

    try {
        const mensagens = (await ConectaTIAPI.listarMensagens(chamadoId)) || [];
        const usuario = getSessaoSegura()?.usuario;
        container.innerHTML = mensagens.length
            ? mensagens.map(m => {
                const minha = usuario && m.remetenteId === usuario.id;
                return `
                <div class="msg ${minha ? 'minha' : ''}">
                    <span class="autor">${escaparHTML(m.remetenteNome || 'Usuário')}</span>
                    <span class="texto">${escaparHTML(m.mensagem)}</span>
                    <span class="hora">${m.dataCriacao ? escaparHTML(new Date(m.dataCriacao).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })) : ''}</span>
                </div>`;
            }).join('')
            : '<p class="muted center">Nenhuma mensagem ainda. Comece a conversa.</p>';
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        container.innerHTML = `<p class="alerta erro">${escaparHTML(error.message)}</p>`;
    }
}

async function enviarMensagemAtual() {
    const input = document.getElementById('chatInput');
    const texto = input?.value.trim();
    if (!texto || !chatChamadoAtual) {
        toast('Selecione um chamado e escreva uma mensagem.');
        return;
    }
    input.value = '';
    try {
        await ConectaTIAPI.enviarMensagem(chatChamadoAtual, texto);
        await abrirConversa(chatChamadoAtual);
    } catch (error) {
        toast(error.message);
    }
}

// ========================
// LANDING (home.tsx: data no rodapé + contadores animados)
// ========================

function iniciarLanding() {
    definirTexto('landingData', dataHojeBR());
    ['heroChamados', 'heroNotebooks', 'heroSatisfacao'].forEach((id, i) => {
        animarContador(document.getElementById(id), [24, 18, 96][i]);
    });
}

// ========================
// INICIALIZAÇÃO POR PÁGINA (mecanismo existente do desktop)
// ========================

document.addEventListener('DOMContentLoaded', function () {
    const pagina = window.location.pathname.split('/').pop() || 'index.html';

    if (pagina === 'login.html' || pagina === 'index.html') {
        if (pagina === 'index.html') iniciarLanding();
        return;
    }

    verificarPermissoes();

    switch (pagina) {
        case 'dashboard.html': iniciarDashboard(); break;
        case 'chamados.html': iniciarChamados(); break;
        case 'novo-chamado.html': iniciarNovoChamado(); break;
        case 'equipamentos.html': iniciarEquipamentos(); break;
        case 'relatorios.html': iniciarRelatorios(); break;
        case 'usuarios.html': iniciarUsuarios(); break;
        case 'unidades.html': iniciarUnidades(); break;
        case 'admin.html': iniciarAdmin(); break;
        case 'mapa-salas.html': iniciarMapaSalas(); break;
        case 'minhas-turmas.html': iniciarMinhasTurmas(); break;
        case 'gerenciar-chamado.html': iniciarGerenciar(); break;
        case 'chat.html': iniciarChat(); break;
        // duvidas-frequentes, acompanhar, categorias, auditoria e criar-*
        // inicializam nos próprios arquivos (scripts das páginas).
    }
});
