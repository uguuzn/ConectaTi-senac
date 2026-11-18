// ============================================================
// CONECTATI SENAC - SCRIPT COMPLETO
// NOVAS PERMISSÕES
// ============================================================

// ========================
// CONTROLE DE TEMA
// ========================

function definirTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('theme', tema);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    definirTema(newTheme);
    mostrarNotificacao(`Tema ${newTheme === 'light' ? 'Claro' : 'Escuro'} ativado!`, 'info');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ========================
// IDIOMA (i18n) — troca REAL de idioma
// ========================
// O idioma salvo no localStorage ('idioma') é aplicado em todas as páginas:
// menus (montarSidebar usa t()), títulos, subtítulos, rótulos, botões comuns,
// cards de configuração e saudação. pt-BR é o idioma base do sistema.
const I18N = {
    'en-US': {
        // Seções do menu
        'Menu Principal': 'Main Menu',
        'Comunicação': 'Communication',
        'Administração': 'Administration',
        'Conta': 'Account',
        // Itens do menu
        'Dashboard': 'Dashboard',
        'Chamados': 'Tickets',
        'Novo Chamado': 'New Ticket',
        'Acompanhar Chamado': 'Track Ticket',
        'Gerenciar Chamados': 'Manage Tickets',
        'Equipamentos': 'Equipment',
        'Relatórios': 'Reports',
        'Chat': 'Chat',
        'Dúvidas Frequentes': 'FAQ',
        'Usuários': 'Users',
        'Criar Usuário': 'Create User',
        'Unidades': 'Units',
        'Criar Unidade': 'Create Unit',
        'Categorias': 'Categories',
        'Configurações': 'Settings',
        'Editar Perfil': 'Edit Profile',
        // Botões comuns
        'Sair': 'Logout',
        'Tema': 'Theme',
        'Entrar': 'Sign in',
        'Salvar Configurações': 'Save Settings',
        // Títulos de página (o emoji é preservado)
        'Acompanhar Chamado': 'Track Ticket',
        'Abrir Chamado': 'Open Ticket',
        // Subtítulos de página
        'Gerencie todos os chamados do sistema': 'Manage all system tickets',
        'Veja o status e detalhes do seu chamado': 'See the status and details of your ticket',
        'Gerencie as categorias de chamados': 'Manage ticket categories',
        'Converse com o Suporte TI, com a equipe e com o Assistente IA': 'Talk to IT Support, the team and the AI Assistant',
        'Configure as preferências do sistema': 'Configure system preferences',
        'Cadastre uma nova unidade do Senac': 'Register a new Senac unit',
        'Cadastre um novo usuário no sistema': 'Register a new user in the system',
        'Bem-vindo, Usuário!': 'Welcome, User!',
        'Encontre respostas para as perguntas mais comuns': 'Find answers to the most common questions',
        'Registre uma nova solicitação para o Suporte TI': 'Submit a new request to IT Support',
        'Visualize os relatórios do sistema': 'View system reports',
        'Gerencie as unidades do Senac': 'Manage Senac units',
        'Gerencie os usuários do sistema': 'Manage system users',
        'Gerencie os equipamentos do sistema': 'Manage system equipment',
        // Login
        'Faça login para continuar': 'Sign in to continue',
        'E-mail': 'E-mail',
        'Digite seu e-mail': 'Enter your e-mail',
        'Senha': 'Password',
        'Digite sua senha': 'Enter your password',
        'Perfil': 'Profile',
        'Selecione seu perfil': 'Select your profile',
        'Instrutor': 'Instructor',
        'Suporte TI': 'IT Support',
        'Coordenação': 'Coordination',
        'Administrador': 'Administrator',
        // Configurações
        'Tema Escuro': 'Dark Theme',
        'Ative o tema escuro para o sistema': 'Turn on the dark theme for the system',
        'Notificações': 'Notifications',
        'Receber notificações de novos chamados': 'Receive notifications for new tickets',
        'Notificações por E-mail': 'E-mail Notifications',
        'Receber notificações por e-mail': 'Receive notifications by e-mail',
        'Idioma': 'Language',
        'Selecione o idioma do sistema': 'Select the system language',
        'Formato de Data': 'Date Format',
        'Selecione o formato de data preferido': 'Select your preferred date format',
        'Timeout de Sessão (minutos)': 'Session Timeout (minutes)',
        'Tempo de inatividade antes do logout automático': 'Inactivity time before automatic logout',
        // Estado vazio / contadores
        'Nenhum chamado encontrado': 'No tickets found',
        'Nenhum chamado registrado ainda.': 'No tickets registered yet.',
        'Nenhum equipamento cadastrado ainda.': 'No equipment registered yet.',
        'Mostrando': 'Showing',
        'chamado': 'ticket',
        'chamados': 'tickets',
        'Encontrados': 'Found',
        'resultado': 'result',
        'resultados': 'results',
        'para': 'for',
        // Saudação
        'Bom dia': 'Good morning',
        'Boa tarde': 'Good afternoon',
        'Boa noite': 'Good evening',
        'Boa madrugada': 'Good night',
        // Cabeçalhos de tabela comuns
        'Solicitante': 'Requester',
        'Categoria': 'Category',
        'Prioridade': 'Priority',
        'Status': 'Status',
        'Data': 'Date',
        'Ações': 'Actions',
        'Nome': 'Name',
        'Nome Completo': 'Full Name',
        'Unidade': 'Unit',
        'Região': 'Region',
        'Telefone': 'Phone',
        'Descrição': 'Description',
        'Sala': 'Room',
        'Horário': 'Time',
        'Turma': 'Class',
        'Confirmar Senha': 'Confirm Password'
    },
    'es-ES': {
        'Menu Principal': 'Menú principal',
        'Comunicação': 'Comunicación',
        'Administração': 'Administración',
        'Conta': 'Cuenta',
        'Dashboard': 'Dashboard',
        'Chamados': 'Tickets',
        'Novo Chamado': 'Nuevo ticket',
        'Acompanhar Chamado': 'Seguimiento de ticket',
        'Gerenciar Chamados': 'Gestionar tickets',
        'Equipamentos': 'Equipos',
        'Relatórios': 'Informes',
        'Chat': 'Chat',
        'Dúvidas Frequentes': 'Preguntas frecuentes',
        'Usuários': 'Usuarios',
        'Criar Usuário': 'Crear usuario',
        'Unidades': 'Unidades',
        'Criar Unidade': 'Crear unidad',
        'Categorias': 'Categorías',
        'Configurações': 'Configuración',
        'Editar Perfil': 'Editar perfil',
        'Sair': 'Salir',
        'Tema': 'Tema',
        'Entrar': 'Entrar',
        'Salvar Configurações': 'Guardar configuración',
        'Acompanhar Chamado': 'Seguimiento de ticket',
        'Abrir Chamado': 'Abrir ticket',
        'Gerencie todos os chamados do sistema': 'Gestiona todos los tickets del sistema',
        'Veja o status e detalhes do seu chamado': 'Ver el estado y los detalles de tu ticket',
        'Gerencie as categorias de chamados': 'Gestiona las categorías de tickets',
        'Converse com o Suporte TI, com a equipe e com o Assistente IA': 'Habla con el Soporte TI, con el equipo y con el Asistente de IA',
        'Configure as preferências do sistema': 'Configura las preferencias del sistema',
        'Cadastre uma nova unidade do Senac': 'Registra una nueva unidad del Senac',
        'Cadastre um novo usuário no sistema': 'Registra un nuevo usuario en el sistema',
        'Bem-vindo, Usuário!': '¡Bienvenido, Usuario!',
        'Encontre respostas para as perguntas mais comuns': 'Encuentra respuestas a las preguntas más comunes',
        'Registre uma nova solicitação para o Suporte TI': 'Envía una nueva solicitud al Soporte TI',
        'Visualize os relatórios do sistema': 'Visualiza los informes del sistema',
        'Gerencie as unidades do Senac': 'Gestiona las unidades del Senac',
        'Gerencie os usuários do sistema': 'Gestiona los usuarios del sistema',
        'Gerencie os equipamentos do sistema': 'Gestiona los equipos del sistema',
        'Faça login para continuar': 'Inicia sesión para continuar',
        'E-mail': 'Correo',
        'Digite seu e-mail': 'Escribe tu correo',
        'Senha': 'Contraseña',
        'Digite sua senha': 'Escribe tu contraseña',
        'Perfil': 'Perfil',
        'Selecione seu perfil': 'Selecciona tu perfil',
        'Instrutor': 'Instructor',
        'Suporte TI': 'Soporte TI',
        'Coordenação': 'Coordinación',
        'Administrador': 'Administrador',
        'Tema Escuro': 'Tema Oscuro',
        'Ative o tema escuro para o sistema': 'Activa el tema oscuro para el sistema',
        'Notificações': 'Notificaciones',
        'Receber notificações de novos chamados': 'Recibir notificaciones de nuevos tickets',
        'Notificações por E-mail': 'Notificaciones por Correo',
        'Receber notificações por e-mail': 'Recibir notificaciones por correo',
        'Idioma': 'Idioma',
        'Selecione o idioma do sistema': 'Selecciona el idioma del sistema',
        'Formato de Data': 'Formato de Fecha',
        'Selecione o formato de data preferido': 'Selecciona tu formato de fecha preferido',
        'Timeout de Sessão (minutos)': 'Tiempo de sesión (minutos)',
        'Tempo de inatividade antes do logout automático': 'Tiempo de inactividad antes del cierre automático',
        'Nenhum chamado encontrado': 'Ningún ticket encontrado',
        'Nenhum chamado registrado ainda.': 'Ningún ticket registrado aún.',
        'Nenhum equipamento cadastrado ainda.': 'Ningún equipo registrado aún.',
        'Mostrando': 'Mostrando',
        'chamado': 'ticket',
        'chamados': 'tickets',
        'Encontrados': 'Encontrados',
        'resultado': 'resultado',
        'resultados': 'resultados',
        'para': 'para',
        'Bom dia': 'Buenos días',
        'Boa tarde': 'Buenas tardes',
        'Boa noite': 'Buenas noches',
        'Boa madrugada': 'Buenas noches',
        'Solicitante': 'Solicitante',
        'Categoria': 'Categoría',
        'Prioridade': 'Prioridad',
        'Status': 'Estado',
        'Data': 'Fecha',
        'Ações': 'Acciones',
        'Nome': 'Nombre',
        'Nome Completo': 'Nombre Completo',
        'Unidade': 'Unidad',
        'Região': 'Región',
        'Telefone': 'Teléfono',
        'Descrição': 'Descripción',
        'Sala': 'Sala',
        'Horário': 'Horario',
        'Turma': 'Clase',
        'Confirmar Senha': 'Confirmar Contraseña'
    }
};

function getIdioma() {
    try { return localStorage.getItem('idioma') || 'pt-BR'; } catch { return 'pt-BR'; }
}

// Traduz uma string do idioma base (pt-BR) para o idioma ativo
function t(texto) {
    const d = I18N[getIdioma()];
    return (d && d[texto]) || texto;
}

// Aplica o idioma ativo nos elementos estáticos das páginas (textos que batem
// com o dicionário). Prefixos não-alfabéticos (emoji) são preservados.
function aplicarIdioma() {
    const idioma = getIdioma();
    try { document.documentElement.lang = idioma; } catch (e) { /* ignore */ }
    if (idioma === 'pt-BR') return; // pt-BR já é o idioma base

    const seletor = [
        '.page-title h1',
        '.page-title p',
        '.config-card h3',
        '.config-card .config-info p',
        '.subtitle',
        'label',
        'th',
        '.content-header .btn',
        '.sidebar-footer .btn',
        '.login-container .btn',
        '#perfil option'
    ].join(', ');

    document.querySelectorAll(seletor).forEach(el => {
        const original = (el.textContent || '').trim();
        if (!original) return;
        const m = original.match(/^([^\p{L}\p{N}]+\s*)?(.*)$/u);
        const prefixo = m && m[1] ? m[1] : '';
        const nucleo = m && m[2] ? m[2].trim() : original;
        const traduzido = t(nucleo);
        if (traduzido !== nucleo) {
            el.textContent = prefixo + traduzido;
        }
    });

    // Placeholders conhecidos
    document.querySelectorAll('input[placeholder]').forEach(el => {
        const p = el.getAttribute('placeholder') || '';
        const tp = t(p);
        if (tp !== p) el.setAttribute('placeholder', tp);
    });
}

function mudarIdiomaSistema(novoIdioma) {
    try { localStorage.setItem('idioma', novoIdioma); } catch (e) { /* ignore */ }
    aplicarIdioma();
}

// Encerra apenas a sessão atual. Preserva o banco local (usuários cadastrados,
// chamados, equipamentos) e o tema — assim dados criados continuam disponíveis
// após logout.
function fazerLogout() {
    localStorage.removeItem('sessaoConectaTI');
    localStorage.removeItem('unidadeUsuario');
    try { mostrarNotificacao('Saindo do sistema...', 'info'); } catch (e) {}
}

// ========================
// CONTROLE DE PERFIL E PERMISSÕES - NOVO
// ========================

const permissoes = {
    // Configurações (preferências do sistema) está disponível a TODOS os perfis;
    // "Limpar Dados" foi removido. Auditoria deixou de existir como página.

    // Instrutor: abre e acompanha apenas os próprios chamados (não gerencia).
    'Instrutor': {
        dashboard: true,
        chamados: false,
        novoChamado: true,
        acompanharChamado: true,
        gerenciarChamado: false,
        editarChamado: false,
        equipamentos: false,
        relatorios: false,
        usuarios: false,
        unidades: false,
        categorias: false,
        configuracoes: true,
        chat: true,
        duvidasFrequentes: true,
        criarUsuario: false,
        criarUnidade: false,
        editarPerfil: true
    },
    // Coordenação: mesmas regras de negócio do Instrutor — abre e acompanha
    // apenas os próprios chamados; não cria usuários e não acessa gestão.
    'Coordenacao': {
        dashboard: true,
        chamados: false,
        novoChamado: true,
        acompanharChamado: true,
        gerenciarChamado: false,
        editarChamado: false,
        equipamentos: false,
        relatorios: false,
        usuarios: false,
        unidades: false,
        categorias: false,
        configuracoes: true,
        chat: true,
        duvidasFrequentes: true,
        criarUsuario: false,
        criarUnidade: false,
        editarPerfil: true
    },
    // Suporte TI (técnico): atende a fila, resolve e gerencia chamados e equipamentos.
    'Suporte TI': {
        dashboard: true,
        chamados: true,
        novoChamado: true,
        acompanharChamado: true,
        gerenciarChamado: true,
        editarChamado: true,
        equipamentos: true,
        relatorios: true,
        usuarios: false,
        unidades: false,
        categorias: false,
        configuracoes: true,
        chat: true,
        duvidasFrequentes: true,
        criarUsuario: false,
        criarUnidade: false,
        editarPerfil: true
    },
    // Administrador: gestão de usuários/categorias. Não gerencia
    // chamados; não acessa nem cria unidades.
    'Administrador': {
        dashboard: true,
        chamados: false,
        novoChamado: true,
        acompanharChamado: true,
        gerenciarChamado: false,
        editarChamado: false,
        equipamentos: true,
        relatorios: true,
        usuarios: true,
        unidades: false,
        categorias: true,
        configuracoes: true,
        chat: true,
        duvidasFrequentes: true,
        criarUsuario: true,
        criarUnidade: false,
        editarPerfil: true
    }
};

function getPerfilUsuario() {
    const tipo = JSON.parse(localStorage.getItem('sessaoConectaTI') || 'null')?.usuario?.tipo;
    const perfis = {
        ADMINISTRADOR: 'Administrador',
        ADMIN: 'Administrador',
        TECNICO: 'Suporte TI',
        INSTRUTOR: 'Instrutor',
        PROFESSOR: 'Instrutor',
        COORDENADOR: 'Coordenacao',
        ALUNO: 'Coordenacao'
    };
    return perfis[tipo] || 'Visitante';
}

function getUnidadeUsuario() {
    return localStorage.getItem('unidadeUsuario') || '';
}

function getEmailUsuario() {
    return JSON.parse(localStorage.getItem('sessaoConectaTI') || 'null')?.usuario?.email || '';
}

function getPaginaPadrao(perfil) {
    const permissoesPerfil = permissoes[perfil];
    if (!permissoesPerfil) return 'login.html';
    
    if (permissoesPerfil.dashboard) return 'dashboard.html';
    if (permissoesPerfil.chamados) return 'chamados.html';
    if (permissoesPerfil.equipamentos) return 'equipamentos.html';
    if (permissoesPerfil.relatorios) return 'relatorios.html';
    if (permissoesPerfil.novoChamado) return 'novo-chamado.html';
    if (permissoesPerfil.acompanharChamado) return 'acompanhar-chamado.html';
    if (permissoesPerfil.chat) return 'chat.html';
    if (permissoesPerfil.duvidasFrequentes) return 'duvidas-frequentes.html';
    if (permissoesPerfil.gerenciarChamado) return 'gerenciar-chamado.html';
    if (permissoesPerfil.criarUsuario) return 'criar-usuario.html';
    if (permissoesPerfil.criarUnidade) return 'criar-unidade.html';
    if (permissoesPerfil.editarPerfil) return 'editar-perfil.html';

    return 'dashboard.html';
}

function verificarPermissoes() {
    const perfil = getPerfilUsuario();
    const permissoesPerfil = permissoes[perfil];
    
    if (!permissoesPerfil || perfil === 'Visitante') {
        window.location.href = 'login.html';
        return;
    }

    const pagina = window.location.pathname.split('/').pop();
    const mapeamento = {
        'dashboard.html': 'dashboard',
        'chamados.html': 'chamados',
        'novo-chamado.html': 'novoChamado',
        'equipamentos.html': 'equipamentos',
        'relatorios.html': 'relatorios',
        'usuarios.html': 'usuarios',
        'unidades.html': 'unidades',
        'categorias.html': 'categorias',
        'configuracoes.html': 'configuracoes',
        'chat.html': 'chat',
        'acompanhar-chamado.html': 'acompanharChamado',
        'duvidas-frequentes.html': 'duvidasFrequentes',
        'gerenciar-chamado.html': 'gerenciarChamado',
        'criar-usuario.html': 'criarUsuario',
        'criar-unidade.html': 'criarUnidade',
        'editar-perfil.html': 'editarPerfil'
    };

    const chave = mapeamento[pagina] || '';
    
    if (chave && !permissoesPerfil[chave]) {
        const paginaPermitida = getPaginaPadrao(perfil);
        if (paginaPermitida) {
            mostrarNotificacao(`Acesso negado! Redirecionando...`, 'error');
            setTimeout(() => {
                window.location.href = paginaPermitida;
            }, 500);
        } else {
            window.location.href = 'login.html';
        }
    }

    montarSidebar(permissoesPerfil);
}

function montarSidebar(permissoesPerfil) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const paginaAtual = (window.location.pathname.split('/').pop() || 'dashboard.html').split('?')[0];
    const p = permissoesPerfil || {};
    const icone = (svg) => `<span class="menu-icon"><svg viewBox="0 0 24 24">${svg}</svg></span>`;

    // Fonte única do menu: label, ícone (SVG) e chave de permissão.
    // Aparece só quando o perfil tem a permissão correspondente === true.
    const itens = [
        { sec: 'Menu Principal' },
        { href: 'dashboard.html',           chave: 'dashboard',           label: 'Dashboard',            svg: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
        { href: 'chamados.html',            chave: 'chamados',            label: 'Chamados',             svg: '<path d="M4 4h16v16H4z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/><line x1="8" y1="17" x2="11" y2="17"/>' },
        { href: 'novo-chamado.html',        chave: 'novoChamado',         label: 'Novo Chamado',         svg: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>' },
        { href: 'acompanhar-chamado.html',  chave: 'acompanharChamado',   label: 'Acompanhar Chamado',   svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
        { href: 'gerenciar-chamado.html',   chave: 'gerenciarChamado',    label: 'Gerenciar Chamados',   svg: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' },
        { href: 'equipamentos.html',        chave: 'equipamentos',        label: 'Equipamentos',         svg: '<rect x="2" y="4" width="20" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/>' },
        { href: 'relatorios.html',          chave: 'relatorios',          label: 'Relatórios',           svg: '<path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/>' },
        { sec: 'Comunicação' },
        { href: 'chat.html',                chave: 'chat',                label: 'Chat',                 svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
        { href: 'duvidas-frequentes.html',  chave: 'duvidasFrequentes',   label: 'Dúvidas Frequentes',   svg: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
        { sec: 'Administração' },
        { href: 'usuarios.html',            chave: 'usuarios',            label: 'Usuários',             svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
        { href: 'criar-usuario.html',       chave: 'criarUsuario',        label: 'Criar Usuário',        svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>' },
        { href: 'unidades.html',            chave: 'unidades',            label: 'Unidades',             svg: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
        { href: 'criar-unidade.html',       chave: 'criarUnidade',        label: 'Criar Unidade',        svg: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>' },
        { href: 'categorias.html',          chave: 'categorias',          label: 'Categorias',           svg: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
        { href: 'configuracoes.html',       chave: 'configuracoes',       label: 'Configurações',        svg: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
        { sec: 'Conta' },
        { href: 'editar-perfil.html',       chave: 'editarPerfil',        label: 'Editar Perfil',        svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M18.5 4.5l1 1 2-2"/>' }
    ];

    let navHtml = '';
    for (const it of itens) {
        if (it.sec) { navHtml += `<p class="nav-label">${t(it.sec)}</p>`; continue; }
        if (p[it.chave] !== true) continue;
        const active = it.href === paginaAtual ? ' class="active"' : '';
        navHtml += `<a href="${it.href}"${active}>${icone(it.svg)} ${t(it.label)}</a>`;
    }

    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <img class="logo" src="assets/logo-senac.png" alt="Logo Senac">
            <h1>ConectaTI</h1>
        </div>
        <nav class="sidebar-nav">
            ${navHtml}
        </nav>
        <div class="sidebar-footer">
            <div class="user-info">
                <div class="user-avatar" id="userAvatar">U</div>
                <div>
                    <div class="user-name" id="userName">Usuário</div>
                    <div class="user-perfil" id="userPerfil">Perfil</div>
                    <div class="user-perfil" id="userUnidade">Unidade</div>
                </div>
            </div>
            <div class="sidebar-actions">
                <button onclick="toggleTheme()" class="btn btn-secondary btn-sm" style="width:100%; margin-bottom:8px;">Tema</button>
                <a href="index.html" onclick="fazerLogout();" class="btn btn-danger btn-sm" style="width:100%;">Sair</a>
            </div>
        </div>`;
}

// ========================
// FUNÇÕES DE NAVEGAÇÃO
// ========================

function irPara(pagina) {
    window.location.href = pagina;
}

function abrirChat() {
    window.location.href = 'chat.html';
}

function abrirDuvidas() {
    window.location.href = 'duvidas-frequentes.html';
}

function abrirAcompanharChamado() {
    window.location.href = 'acompanhar-chamado.html';
}

function abrirGerenciarChamado() {
    window.location.href = 'gerenciar-chamado.html';
}

function abrirCriarUsuario() {
    window.location.href = 'criar-usuario.html';
}

function abrirCriarUnidade() {
    window.location.href = 'criar-unidade.html';
}

// ========================
// DADOS SIMULADOS
// ========================

// Chamados começam ZERADOS — os dados de demonstração foram removidos.
// Chamados reais são criados em "Novo Chamado" e ficam salvos no localStorage.
const chamados = [];

// Equipamentos começam zerados também.
const equipamentos = [];

// Versão dos dados: se mudou, limpa uma única vez os dados antigos salvos no
// navegador (chamados/equipamentos de demonstração de versões anteriores).
const VERSAO_DADOS = 'conecta-dados-v10-zero';

function resetarDadosVersaoAnterior() {
    try {
        if (localStorage.getItem('conectaDadosVersao') !== VERSAO_DADOS) {
            localStorage.removeItem('chamadosConectaTI');
            localStorage.removeItem('equipamentosConectaTI');
            localStorage.setItem('conectaDadosVersao', VERSAO_DADOS);
        }
    } catch (e) { /* ignore */ }
}

// Dúvidas Frequentes
const duvidasFrequentes = [
    {
        id: 1,
        pergunta: 'Como reservar notebooks para minha turma?',
        resposta: 'Acesse o menu "Novo Chamado", selecione "Reserva de notebooks" e informe a quantidade e data.',
        categoria: 'Reservas'
    },
    {
        id: 2,
        pergunta: 'O que fazer se o projetor não funcionar?',
        resposta: 'Verifique os cabos e se o projetor está ligado. Se não resolver, abra um chamado na categoria "Projetor".',
        categoria: 'Equipamentos'
    },
    {
        id: 3,
        pergunta: 'Como acompanhar meu chamado?',
        resposta: 'Acesse o menu "Acompanhar Chamado" e veja o status da sua solicitação.',
        categoria: 'Chamados'
    },
    {
        id: 4,
        pergunta: 'Qual o prazo para atendimento de um chamado?',
        resposta: 'Chamados urgentes são atendidos em até 2 horas, os demais em até 24 horas úteis.',
        categoria: 'Chamados'
    }
];

// ========================
// FUNÇÕES DE STATUS
// ========================

function getBadgeStatus(status) {
    const mapa = {
        'aberto': 'badge-aberto',
        'em atendimento': 'badge-atendimento',
        'resolvido': 'badge-resolvido',
        'atrasado': 'badge-atrasado',
        'cancelado': 'badge-cancelado',
        'disponível': 'badge-disponivel',
        'reservado': 'badge-reservado',
        'em uso': 'badge-em-uso',
        'em manutenção': 'badge-em-manutencao'
    };
    const classe = mapa[status.toLowerCase()] || 'badge-aberto';
    return `<span class="badge ${classe}">${status}</span>`;
}

// ========================
// EXIBIR CHAMADOS
// ========================

function exibirChamados(filtroStatus = 'todos', filtroPrioridade = 'todos') {
    const tbody = document.getElementById('listaChamados');
    if (!tbody) return;

    let filtrados = chamados;

    if (filtroStatus !== 'todos') {
        filtrados = filtrados.filter(c => 
            c.status.toLowerCase().replace(' ', '-') === filtroStatus ||
            c.status.toLowerCase() === filtroStatus
        );
    }

    if (filtroPrioridade !== 'todos') {
        filtrados = filtrados.filter(c => 
            c.prioridade.toLowerCase() === filtroPrioridade
        );
    }

    tbody.innerHTML = filtrados.map(c => `
        <tr>
            <td><strong>#${c.id.toString().padStart(3, '0')}</strong></td>
            <td><strong>${c.solicitante}</strong></td>
            <td>${c.perfil}</td>
            <td>${c.categoria}</td>
            <td>${c.prioridade}</td>
            <td>${getBadgeStatus(c.status)}</td>
            <td>${c.data}</td>
        </tr>
    `).join('');

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-muted);">${t('Nenhum chamado encontrado')}</td></tr>`;
    }

    const contador = document.getElementById('resultadoContador');
    if (contador) {
        contador.textContent = `${t('Mostrando')} ${filtrados.length} ${t(filtrados.length === 1 ? 'chamado' : 'chamados')}`;
    }
}

// ========================
// EXIBIR EQUIPAMENTOS
// ========================

function exibirEquipamentos() {
    const tbody = document.getElementById('listaEquipamentos');
    if (!tbody) return;

    tbody.innerHTML = equipamentos.map(e => `
        <tr>
            <td><strong>${e.nome}</strong></td>
            <td>${e.tipo}</td>
            <td>${e.patrimonio}</td>
            <td>${getBadgeStatus(e.status)}</td>
            <td>${e.localizacao}</td>
        </tr>
    `).join('');

    if (equipamentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">${t('Nenhum equipamento cadastrado ainda.')}</td></tr>`;
    }
}

// ========================
// EXIBIR DÚVIDAS FREQUENTES
// ========================

function exibirDuvidas() {
    const container = document.getElementById('listaDuvidas');
    if (!container) return;

    const busca = document.getElementById('buscaDuvidas')?.value.toLowerCase() || '';

    let filtradas = duvidasFrequentes.filter(d => 
        d.pergunta.toLowerCase().includes(busca) || 
        d.categoria.toLowerCase().includes(busca)
    );

    container.innerHTML = filtradas.map(d => `
        <div class="duvida-card" onclick="toggleDuvida(${d.id})">
            <div class="duvida-pergunta">
                <span class="duvida-icon">❓</span>
                <strong>${d.pergunta}</strong>
                <span class="duvida-toggle">▼</span>
            </div>
            <div class="duvida-resposta" id="resposta-${d.id}" style="display:none;">
                <p>${d.resposta}</p>
                <span class="duvida-categoria">${d.categoria}</span>
            </div>
        </div>
    `).join('');
}

function toggleDuvida(id) {
    const resposta = document.getElementById(`resposta-${id}`);
    if (resposta) {
        const isVisible = resposta.style.display === 'block';
        resposta.style.display = isVisible ? 'none' : 'block';
    }
}

// ========================
// FILTRAR CHAMADOS
// ========================

function filtrarChamados() {
    const status = document.getElementById('filtroStatus')?.value || 'todos';
    const prioridade = document.getElementById('filtroPrioridade')?.value || 'todos';
    exibirChamados(status, prioridade);
}

// ========================
// BUSCAR CHAMADOS
// ========================

function buscarChamados() {
    const termo = document.getElementById('buscaChamados')?.value.toLowerCase().trim() || '';
    const linhas = document.querySelectorAll('#listaChamados tr');
    let visiveis = 0;

    linhas.forEach(linha => {
        const texto = linha.textContent.toLowerCase();
        const match = texto.includes(termo);
        linha.style.display = match ? '' : 'none';
        if (match) visiveis++;
    });

    const contador = document.getElementById('resultadoContador');
    if (contador) {
        const total = linhas.length;
        if (termo.length > 0) {
            contador.textContent = `${t('Encontrados')} ${visiveis} ${t(visiveis === 1 ? 'resultado' : 'resultados')} ${t('para')} "${termo}"`;
        } else {
            contador.textContent = `${t('Mostrando')} ${total} ${t(total === 1 ? 'chamado' : 'chamados')}`;
        }
    }
}

// ========================
// ENVIAR CHAMADO
// ========================

function enviarChamado() {
    const solicitante = document.getElementById('solicitante')?.value;
    const perfil = document.getElementById('perfilChamado')?.value;
    const turma = document.getElementById('turma')?.value || '';
    const sala = document.getElementById('sala')?.value;
    const horario = document.getElementById('horario')?.value;
    const categoria = document.getElementById('categoria')?.value;
    const prioridade = document.getElementById('prioridade')?.value;
    const descricao = document.getElementById('descricao')?.value;

    if (!solicitante || !sala || !horario || !descricao) {
        mostrarNotificacao('Preencha todos os campos obrigatórios!', 'error');
        return false;
    }

    let turmaInfo = '';
    if (perfil === 'Instrutor' && turma) {
        turmaInfo = ` (Turma: ${turma})`;
    }

    const novoChamado = {
        id: chamados.length + 1,
        solicitante: solicitante + turmaInfo,
        perfil: perfil,
        categoria: categoria,
        sala: sala,
        horario: horario,
        prioridade: prioridade,
        status: 'Aberto',
        data: new Date().toLocaleDateString('pt-BR'),
        descricao: descricao
    };

    chamados.push(novoChamado);
    salvarChamadosLocalStorage();
    lancarConfetes();
    mostrarNotificacao(`Chamado #${novoChamado.id.toString().padStart(3, '0')} enviado com sucesso!`, 'success');

    document.getElementById('formChamado')?.reset();
    return false;
}

// ========================
// DASHBOARD
// ========================

function atualizarDashboard() {
    const abertos = chamados.filter(c => c.status === 'Aberto').length;
    const atendimento = chamados.filter(c => c.status === 'Em atendimento').length;
    const resolvidos = chamados.filter(c => c.status === 'Resolvido').length;
    const atrasados = chamados.filter(c => c.status === 'Atrasado').length;

    const elementos = {
        'abertos': abertos,
        'atendimento': atendimento,
        'resolvidos': resolvidos,
        'atrasados': atrasados
    };

    Object.keys(elementos).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = elementos[id];
        }
    });

    const notebooksEl = document.getElementById('notebooksDisponiveis');
    if (notebooksEl) notebooksEl.textContent = equipamentos.filter(e => e.tipo === 'Notebook' && e.status === 'Disponível').length;
    
    const manutencaoEl = document.getElementById('emManutencao');
    if (manutencaoEl) manutencaoEl.textContent = equipamentos.filter(e => e.status === 'Em manutenção').length;
}

// ========================
// GRÁFICOS DINÂMICOS
// ========================

function gerarGraficoStatus() {
    const container = document.getElementById('graficoStatus');
    if (!container) return;

    const statusCount = {
        'Resolvidos': chamados.filter(c => c.status === 'Resolvido').length,
        'Abertos': chamados.filter(c => c.status === 'Aberto').length,
        'Em atendimento': chamados.filter(c => c.status === 'Em atendimento').length,
        'Atrasados': chamados.filter(c => c.status === 'Atrasado').length
    };

    const cores = {
        'Resolvidos': 'fill-success',
        'Abertos': 'fill-primary',
        'Em atendimento': 'fill-warning',
        'Atrasados': 'fill-danger'
    };

    const max = Math.max(...Object.values(statusCount), 1);

    container.innerHTML = Object.entries(statusCount).map(([status, total]) => `
        <div class="barra-item">
            <span class="label">${status}</span>
            <div class="track">
                <div class="fill ${cores[status] || 'fill-primary'}" style="width: ${(total / max) * 100}%; min-width: 24px;">
                    ${total}
                </div>
            </div>
        </div>
    `).join('');
}

function gerarGraficoCategoria() {
    const container = document.getElementById('graficoCategoria');
    if (!container) return;

    const categorias = {};
    chamados.forEach(c => {
        categorias[c.categoria] = (categorias[c.categoria] || 0) + 1;
    });

    const sorted = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...Object.values(categorias), 1);

    if (sorted.length === 0) {
        container.innerHTML = `<p style="padding:8px 0; font-size:0.8rem; color:var(--text-muted);">${t('Nenhum chamado registrado ainda.')}</p>`;
        return;
    }

    const cores = ['fill-primary', 'fill-success', 'fill-warning', 'fill-info', 'fill-danger', 'fill-secondary', 'fill-accent'];

    container.innerHTML = sorted.map(([cat, total], index) => `
        <div class="barra-item">
            <span class="label">${cat}</span>
            <div class="track">
                <div class="fill ${cores[index % cores.length]}" style="width: ${(total / max) * 100}%; min-width: 24px;">
                    ${total}
                </div>
            </div>
        </div>
    `).join('');
}

function gerarGraficoTendencia() {
    const container = document.getElementById('graficoTendencia');
    if (!container) return;

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    const dados = meses.map(() => 0);
    const max = Math.max(...dados, 1);

    container.innerHTML = dados.map((valor, i) => `
        <div class="ponto">
            <div class="bar fill-primary" style="height: ${(valor / max) * 100 + 10}px;">
                <span class="valor">${valor}</span>
            </div>
            <span class="label">${meses[i]}</span>
        </div>
    `).join('');
}

function gerarGraficoSala() {
    const container = document.getElementById('graficoSala');
    if (!container) return;

    const salas = {};
    chamados.forEach(c => {
        salas[c.sala] = (salas[c.sala] || 0) + 1;
    });

    const sorted = Object.entries(salas).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...Object.values(salas), 1);

    if (sorted.length === 0) {
        container.innerHTML = `<p style="padding:8px 0; font-size:0.8rem; color:var(--text-muted);">${t('Nenhum chamado registrado ainda.')}</p>`;
        return;
    }

    container.innerHTML = sorted.map(([sala, total]) => `
        <div class="barra-item">
            <span class="label">${sala}</span>
            <div class="track">
                <div class="fill fill-info" style="width: ${(total / max) * 100}%; min-width: 24px;">
                    ${total}
                </div>
            </div>
        </div>
    `).join('');
}

function gerarGraficoPrioridade() {
    const container = document.getElementById('graficoPrioridade');
    if (!container) return;

    const prioridades = { 'Baixa': 0, 'Média': 0, 'Alta': 0, 'Urgente': 0 };
    chamados.forEach(c => {
        if (prioridades[c.prioridade] !== undefined) {
            prioridades[c.prioridade]++;
        }
    });

    const cores = {
        'Baixa': 'fill-success',
        'Média': 'fill-warning',
        'Alta': 'fill-danger',
        'Urgente': 'fill-danger'
    };

    const max = Math.max(...Object.values(prioridades), 1);

    container.innerHTML = Object.entries(prioridades).map(([prio, total]) => `
        <div class="barra-item">
            <span class="label">${prio}</span>
            <div class="track">
                <div class="fill ${cores[prio] || 'fill-primary'}" style="width: ${(total / max) * 100}%; min-width: 24px;">
                    ${total}
                </div>
            </div>
        </div>
    `).join('');
}

function gerarGraficoEquipamentos() {
    const container = document.getElementById('graficoEquipamentos');
    if (!container) return;

    // Contagem real por tipo a partir do cadastro de equipamentos
    const tipos = {};
    equipamentos.forEach(e => {
        tipos[e.tipo] = (tipos[e.tipo] || 0) + 1;
    });

    const sorted = Object.entries(tipos).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...sorted.map(x => x[1]), 1);

    if (sorted.length === 0) {
        container.innerHTML = `<p style="padding:8px 0; font-size:0.8rem; color:var(--text-muted);">${t('Nenhum equipamento cadastrado ainda.')}</p>`;
        return;
    }

    container.innerHTML = sorted.map(([nome, total]) => `
        <div class="barra-item">
            <span class="label">${nome}</span>
            <div class="track">
                <div class="fill fill-secondary" style="width: ${(total / max) * 100}%; min-width: 24px;">
                    ${total}
                </div>
            </div>
        </div>
    `).join('');
}

function gerarRelatorioMensal() {
    const container = document.getElementById('relatorioMensal');
    if (!container) return;

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    const dados = meses.map(() => 0);
    const max = Math.max(...dados, 1);

    container.innerHTML = dados.map((valor, i) => `
        <div class="ponto">
            <div class="bar fill-primary" style="height: ${(valor / max) * 100 + 10}px;">
                <span class="valor">${valor}</span>
            </div>
            <span class="label">${meses[i]}</span>
        </div>
    `).join('');
}

function gerarRelatorioCategoria() {
    const container = document.getElementById('relatorioCategoria');
    if (!container) return;

    const categorias = {};
    chamados.forEach(c => {
        categorias[c.categoria] = (categorias[c.categoria] || 0) + 1;
    });

    const sorted = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...Object.values(categorias), 1);

    if (sorted.length === 0) {
        container.innerHTML = `<p style="padding:8px 0; font-size:0.8rem; color:var(--text-muted);">${t('Nenhum chamado registrado ainda.')}</p>`;
        return;
    }

    container.innerHTML = sorted.map(([cat, total]) => `
        <div class="barra-item">
            <span class="label">${cat}</span>
            <div class="track">
                <div class="fill fill-success" style="width: ${(total / max) * 100}%; min-width: 24px;">
                    ${total}
                </div>
            </div>
        </div>
    `).join('');
}

function carregarGraficos() {
    setTimeout(() => {
        gerarGraficoStatus();
        gerarGraficoCategoria();
        gerarGraficoTendencia();
        gerarGraficoSala();
        gerarGraficoPrioridade();
        gerarGraficoEquipamentos();
        gerarRelatorioMensal();
        gerarRelatorioCategoria();
    }, 300);
}

// ========================
// RELATÓRIOS
// ========================

function gerarRelatorio() {
    mostrarNotificacao('Relatório gerado com sucesso!', 'success');
}

function filtrarRelatorio() {
    mostrarNotificacao('Filtrando dados por mês...', 'info');
}

function exportarPDF() {
    mostrarNotificacao('PDF exportado com sucesso!', 'success');
}

// ========================
// NOTIFICAÇÕES
// ========================

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => notificacao.remove(), 500);
    }, 3500);
}

// ========================
// CONFETES
// ========================

function lancarConfetes() {
    const cores = ['#0d4da2', '#f37021', '#f7941e', '#6BCB77', '#4D96FF', '#FFB347'];
    for (let i = 0; i < 60; i++) {
        const confete = document.createElement('div');
        confete.className = 'confete';
        confete.style.left = Math.random() * 100 + '%';
        confete.style.top = '-10px';
        confete.style.background = cores[Math.floor(Math.random() * cores.length)];
        confete.style.width = Math.random() * 10 + 4 + 'px';
        confete.style.height = Math.random() * 10 + 4 + 'px';
        confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confete.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confete.style.animationDelay = (Math.random() * 0.5) + 's';
        document.body.appendChild(confete);
        setTimeout(() => confete.remove(), 4000);
    }
}

// ========================
// LOGIN
// ========================

async function validarLogin(event) {
    event?.preventDefault();
    const email = (document.getElementById('email')?.value || '').trim();
    const senha = document.getElementById('senha')?.value || '';
    const perfilSel = document.getElementById('perfil')?.value || '';

    if (!email || !senha) {
        mostrarNotificacao('Preencha e-mail e senha para continuar.', 'error');
        return false;
    }

    // Perfil é obrigatório no login
    if (!perfilSel) {
        mostrarNotificacao('Selecione o seu perfil para continuar.', 'error');
        return false;
    }

    // 1) Tenta o backend real (usuários cadastrados) com timeout de 8s
    //    (o Render pode estar "dormindo" e demorar a acordar)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
        const sessao = await ConectaTIAPI.login(email, senha, controller.signal);
        clearTimeout(timer);
        localStorage.setItem('sessaoConectaTI', JSON.stringify(sessao));
        localStorage.setItem('unidadeUsuario', sessao.unidade || '');
        const perfil = getPerfilUsuario();
        mostrarNotificacao(`Login realizado com sucesso como ${perfil}.`, 'success');
        setTimeout(() => { window.location.href = getPaginaPadrao(perfil); }, 500);
        return false;
    } catch (erroApi) {
        clearTimeout(timer);
        // 2) Validação local: usuários cadastrados via "Criar Usuário" + contas demo
        const demo = loginDemo(email, senha, perfilSel);
        if (demo && demo.sessao) {
            localStorage.setItem('sessaoConectaTI', JSON.stringify(demo.sessao));
            localStorage.setItem('unidadeUsuario', demo.sessao.unidade || '');
            mostrarNotificacao(`Login realizado com sucesso como ${demo.perfil}.`, 'success');
            setTimeout(() => { window.location.href = getPaginaPadrao(demo.perfil); }, 500);
            return false;
        }
        // 3) Sem fallback → mostra o erro (local ou do backend)
        const msg = demo?.erro || (erroApi && erroApi.name === 'AbortError'
            ? 'O backend demorou a responder. Use o acesso demo (senha senac123) ou tente novamente.'
            : (erroApi?.message || 'E-mail ou senha inválidos.'));
        mostrarNotificacao(msg, 'error');
        return false;
    }
}

// Mapeia o perfil escolhido no formulário para o "tipo" interno da sessão.
// Mapeamento ESTRITO: valor desconhecido -> null (antes caía em INSTRUTOR e
// fazia o login de Coordenação criar sessão de Instrutor).
const MAPA_PERFIL_TIPO = {
    'Suporte TI': 'TECNICO',
    'Instrutor': 'INSTRUTOR',
    'Coordenacao': 'COORDENADOR',
    'Administrador': 'ADMINISTRADOR'
};

function perfilParaTipo(perfilLabel) {
    return MAPA_PERFIL_TIPO[perfilLabel] || null;
}

// Inverso: tipo da conta -> valor do select de perfil do login
function tipoParaPerfil(tipo) {
    return ({ ADMINISTRADOR: 'Administrador', TECNICO: 'Suporte TI', INSTRUTOR: 'Instrutor', COORDENADOR: 'Coordenacao' })[tipo] || null;
}

// ========================
// BANCO LOCAL (persistência no navegador)
// ========================
// Usuários cadastrados via "Criar Usuário" ficam salvos aqui (localStorage)
// e são validados no login. Dura entre sessões no mesmo navegador — funciona
// mesmo com o backend offline/inacessível. (Demo/TCC: a senha é guardada em
// texto; num sistema real ela seria hasheada no servidor.)
const BancoLocal = (() => {
    const CHAVE = 'usuariosConectaTI';
    const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE) || '[]'); } catch { return []; } };
    const gravar = (lista) => localStorage.setItem(CHAVE, JSON.stringify(lista));
    const norm = (e) => (e || '').toLowerCase().trim();

    return {
        listarUsuarios: () => ler(),
        buscarUsuario: (email) => ler().find(u => norm(u.email) === norm(email)) || null,
        salvarUsuario: (u) => {
            const lista = ler();
            if (lista.some(x => norm(x.email) === norm(u.email))) {
                return { ok: false, erro: 'Já existe um usuário cadastrado com este e-mail.' };
            }
            u.id = Date.now();
            u.criadoEm = u.criadoEm || new Date().toISOString();
            lista.push(u);
            gravar(lista);
            return { ok: true };
        },
        excluirUsuario: (email) => gravar(ler().filter(u => norm(u.email) !== norm(email)))
    };
})();

// Login: contas demo fixas + banco local (usuários cadastrados) + senha universal demo.
// O perfil selecionado é obrigatório e precisa corresponder ao tipo da conta
// (nas contas demo e nos usuários cadastrados).
function loginDemo(email, senha, perfilSel) {
    const contas = {
        'tecnico@senac.com':     { tipo: 'TECNICO',       nome: 'João Suporte' },
        'instrutor@senac.com':   { tipo: 'INSTRUTOR',     nome: 'Rayssa Paiva' },
        'coordenacao@senac.com': { tipo: 'COORDENADOR',   nome: 'Carla Mendes' },
        'admin@senac.com':       { tipo: 'ADMINISTRADOR', nome: 'Administrador Senac' }
    };
    const c = contas[email.toLowerCase()];

    // 1) Contas demo fixas (senha senac123)
    if (c && senha === 'senac123') {
        if (tipoParaPerfil(c.tipo) !== perfilSel) {
            return { erro: 'O perfil selecionado não corresponde a esta conta.' };
        }
        return montaSessaoDemo(email, c.tipo, c.nome);
    }
    // 2) Banco local: usuário cadastrado via "Criar Usuário" (senha real dele)
    const local = BancoLocal.buscarUsuario(email);
    if (local) {
        if (!local.ativo) return { erro: 'Usuário inativo. Procure a coordenação.' };
        if (local.senha !== senha) return { erro: 'Senha incorreta.' };
        if (tipoParaPerfil(local.tipo) !== perfilSel) {
            return { erro: 'O perfil selecionado não corresponde a esta conta.' };
        }
        return montaSessaoDemo(local.email, local.tipo, local.nome, local.unidade || '', false);
    }
    // 3) Senha demo universal: qualquer e-mail NÃO cadastrado + "senac123" + perfil selecionado
    if (senha === 'senac123' && perfilSel) {
        const nome = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase()).trim() || 'Usuário Demo';
        return montaSessaoDemo(email, perfilParaTipo(perfilSel), nome);
    }
    return null;
}

function montaSessaoDemo(email, tipo, nome, unidade = '', demo = true) {
    const perfis = { ADMINISTRADOR: 'Administrador', TECNICO: 'Suporte TI', INSTRUTOR: 'Instrutor', COORDENADOR: 'Coordenacao' };
    return {
        sessao: {
            token: (demo ? 'demo-' : 'local-') + Math.random().toString(36).slice(2),
            tipoToken: 'Bearer',
            demo,
            unidade: unidade || '',
            usuario: { id: 0, email, tipo, nome }
        },
        perfil: perfis[tipo] || 'Instrutor'
    };
}

// ========================
// SAUDAÇÃO E PERFIL
// ========================

function saudacaoDinamica() {
    const hora = new Date().getHours();
    let saudacao;
    if (hora >= 5 && hora < 12) saudacao = t('Bom dia');
    else if (hora >= 12 && hora < 18) saudacao = t('Boa tarde');
    else if (hora >= 18 && hora < 23) saudacao = t('Boa noite');
    else saudacao = t('Boa madrugada');

    const perfil = getPerfilUsuario();
    const unidade = getUnidadeUsuario();
    const el = document.getElementById('saudacao');
    if (el) el.textContent = `${saudacao}, ${perfil}!${unidade ? ' - ' + unidade : ''}`;
}

function carregarPerfil() {
    const perfil = getPerfilUsuario();
    const sessao = JSON.parse(localStorage.getItem('sessaoConectaTI') || 'null');
    const nome = sessao?.usuario?.nome || getEmailUsuario()?.split('@')[0] || 'Usuário';
    const unidade = getUnidadeUsuario();

    const avatar = document.getElementById('userAvatar');
    if (avatar) avatar.textContent = nome.charAt(0).toUpperCase();

    const nomeEl = document.getElementById('userName');
    if (nomeEl) nomeEl.textContent = nome;

    const perfilEl = document.getElementById('userPerfil');
    if (perfilEl) perfilEl.textContent = perfil;

    const unidadeEl = document.getElementById('userUnidade');
    if (unidadeEl) {
        unidadeEl.textContent = unidade;
        unidadeEl.style.display = unidade ? '' : 'none';
    }
}

function exibirDataAtual() {
    const data = new Date().toLocaleDateString(getIdioma(), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const el = document.getElementById('dataAtual');
    if (el) el.textContent = data;
}

// ========================
// LOCALSTORAGE
// ========================

function salvarChamadosLocalStorage() {
    try {
        localStorage.setItem('chamadosConectaTI', JSON.stringify(chamados));
    } catch (e) { /* ignore */ }
}

function carregarChamadosLocalStorage() {
    try {
        const dados = localStorage.getItem('chamadosConectaTI');
        if (dados) {
            const carregados = JSON.parse(dados);
            chamados.length = 0;
            carregados.forEach(c => chamados.push(c));
            return true;
        }
    } catch (e) { /* ignore */ }
    return false;
}

function salvarEquipamentosLocalStorage() {
    try {
        localStorage.setItem('equipamentosConectaTI', JSON.stringify(equipamentos));
    } catch (e) { /* ignore */ }
}

function carregarEquipamentosLocalStorage() {
    try {
        const dados = localStorage.getItem('equipamentosConectaTI');
        if (dados) {
            const carregados = JSON.parse(dados);
            equipamentos.length = 0;
            carregados.forEach(e => equipamentos.push(e));
            return true;
        }
    } catch (e) { /* ignore */ }
    return false;
}

// ========================
// SIDEBAR MOBILE
// ========================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('aberto');
    if (overlay) overlay.classList.toggle('ativo');
}

function fecharSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('aberto');
    if (overlay) overlay.classList.remove('ativo');
}

// ========================
// EASTER EGG
// ========================

let easterEggBuffer = '';
let easterEggAtivado = false;

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    easterEggBuffer += e.key.toLowerCase();
    if (easterEggBuffer.length > 10) easterEggBuffer = easterEggBuffer.slice(-10);

    if (easterEggBuffer.includes('senac') && !easterEggAtivado) {
        easterEggAtivado = true;
        lancarConfetes();
        mostrarNotificacao('Você encontrou o Easter Egg! Senac é demais!', 'success');
        setTimeout(() => {
            easterEggAtivado = false;
            easterEggBuffer = '';
        }, 5000);
    }
});

// ========================
// INICIALIZAÇÃO
// ========================

document.addEventListener('DOMContentLoaded', function() {
    const pagina = window.location.pathname.split('/').pop();

    if (pagina === 'login.html') {
        return;
    }

    if (pagina !== 'index.html' && pagina !== 'login.html' && pagina !== '') {
        verificarPermissoes();
    }

    loadTheme();
    resetarDadosVersaoAnterior();
    carregarChamadosLocalStorage();
    carregarEquipamentosLocalStorage();

    carregarPerfil();
    exibirDataAtual();
    saudacaoDinamica();
    aplicarIdioma();

    switch(pagina) {
        case 'dashboard.html':
            atualizarDashboard();
            setTimeout(carregarGraficos, 500);
            break;
        case 'chamados.html':
            exibirChamados();
            break;
        case 'equipamentos.html':
            exibirEquipamentos();
            break;
        case 'novo-chamado.html':
            const perfilSelect = document.getElementById('perfilChamado');
            const grupoTurma = document.getElementById('grupoTurma');
            if (perfilSelect && grupoTurma) {
                perfilSelect.addEventListener('change', function() {
                    grupoTurma.style.display = this.value === 'Instrutor' ? 'block' : 'none';
                });
            }
            break;
        case 'relatorios.html':
            setTimeout(() => {
                gerarRelatorioMensal();
                gerarRelatorioCategoria();
            }, 300);
            break;
        case 'duvidas-frequentes.html':
            exibirDuvidas();
            break;
    }

    const links = document.querySelectorAll('.tab-bar ul li a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === pagina) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === pagina) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar && !sidebar.contains(e.target) && e.target.closest('.menu-toggle') === null) {
                sidebar.classList.remove('aberto');
                if (overlay) overlay.classList.remove('ativo');
            }
        }
    });
});
