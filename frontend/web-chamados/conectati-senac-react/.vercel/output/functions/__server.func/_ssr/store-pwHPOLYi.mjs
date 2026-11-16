// node_modules/.nitro/vite/services/ssr/assets/store-pwHPOLYi.js
var TURMAS_DEFAULT = [
	{
		id: "t1",
		curso: "Técnico em Desenvolvimento de Sistemas",
		turma: "TDS Manhã",
		horario: "08:00 - 12:00",
		dias: "Seg / Qua / Sex",
		alunos: 28
	},
	{
		id: "t2",
		curso: "Informática Básica",
		turma: "INF-B Noite",
		horario: "19:00 - 22:00",
		dias: "Ter / Qui",
		alunos: 22
	},
	{
		id: "t3",
		curso: "Design Gráfico",
		turma: "DG Tarde",
		horario: "14:00 - 17:00",
		dias: "Seg à Sex",
		alunos: 18
	}
];
var SALAS_BASE = [
	{
		nome: "Sala 01",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 02",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 03",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 04",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 05",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 08",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 12",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Sala 15",
		tipo: "Sala",
		chave: null
	},
	{
		nome: "Lab 01",
		tipo: "Laboratório",
		chave: null
	},
	{
		nome: "Lab 02",
		tipo: "Laboratório",
		chave: null
	},
	{
		nome: "Lab 03",
		tipo: "Laboratório",
		chave: null
	},
	{
		nome: "Auditório",
		tipo: "Auditório",
		chave: null
	}
];
var USUARIOS_BASE = [
	{
		id: "u1",
		nome: "Rayssa Paiva",
		email: "rayssa@senacdf.com.br",
		perfil: "Instrutor",
		unidade: "Senac Taguatinga Sul - Taguatinga/DF"
	},
	{
		id: "u2",
		nome: "Carla Mendes",
		email: "carla@senacdf.com.br",
		perfil: "Coordenação",
		unidade: "Senac Taguatinga Sul - Taguatinga/DF"
	},
	{
		id: "u3",
		nome: "Paulo Lima",
		email: "paulo@senacdf.com.br",
		perfil: "Instrutor",
		unidade: "Senac Taguatinga Sul - Taguatinga/DF"
	},
	{
		id: "u4",
		nome: "Ana Coordenação",
		email: "ana.coord@senacdf.com.br",
		perfil: "Coordenação",
		unidade: "Senac Taguatinga Sul - Taguatinga/DF"
	},
	{
		id: "u5",
		nome: "João Suporte",
		email: "joao.ti@senacdf.com.br",
		perfil: "Suporte TI",
		unidade: "Senac Taguatinga Sul - Taguatinga/DF"
	},
	{
		id: "u6",
		nome: "Mariana Admin",
		email: "admin@senacdf.com.br",
		perfil: "Administrador",
		unidade: "Senac Taguatinga Sul - Taguatinga/DF"
	}
];
var UNIDADES_BASE = [
	{
		id: "un1",
		nome: "Senac Taguatinga Sul",
		cidade: "Taguatinga/DF",
		salas: 12
	},
	{
		id: "un2",
		nome: "Senac Plano Piloto",
		cidade: "Brasília/DF",
		salas: 20
	},
	{
		id: "un3",
		nome: "Senac Ceilândia",
		cidade: "Ceilândia/DF",
		salas: 14
	}
];
function readStore(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const v = localStorage.getItem(key);
		return v ? JSON.parse(v) : fallback;
	} catch {
		return fallback;
	}
}
function writeStore(key, val) {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(val));
}
function ensureSeed(key, seed) {
	if (typeof window === "undefined") return seed;
	if (!localStorage.getItem(key)) writeStore(key, seed);
	return readStore(key, seed);
}
var uid = (p) => p + "_" + Math.random().toString(36).slice(2, 8);
var slug = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
var getSalas = () => ensureSeed("conectati_salas", SALAS_BASE);
var setSalas = (v) => writeStore("conectati_salas", v);
var getUsuarios = () => ensureSeed("conectati_usuarios", USUARIOS_BASE);
var getUnidades = () => ensureSeed("conectati_unidades", UNIDADES_BASE);
var setUnidades = (v) => writeStore("conectati_unidades", v);
var getSolicitacoes = () => ensureSeed("conectati_solicitacoes", []);
var setSolicitacoes = (v) => writeStore("conectati_solicitacoes", v);
var toastTimer;
function toast(msg) {
	if (typeof document === "undefined") return;
	let t = document.getElementById("toast");
	if (!t) {
		t = document.createElement("div");
		t.id = "toast";
		t.className = "toast";
		document.body.appendChild(t);
	}
	t.textContent = msg;
	t.classList.remove("hidden");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t?.classList.add("hidden"), 3e3);
}
function dataHojeBR() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
}
export { getUnidades as a, setSolicitacoes as c, toast as d, uid as f, getSolicitacoes as i, setUnidades as l, dataHojeBR as n, getUsuarios as o, getSalas as r, setSalas as s, TURMAS_DEFAULT as t, slug as u };
