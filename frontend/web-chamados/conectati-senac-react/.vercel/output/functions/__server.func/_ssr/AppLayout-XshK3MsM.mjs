import { i as __toESM } from "../_runtime.mjs";
import { n as getUsuario, t as clearSession } from "./session-nq0S3h9M.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/AppLayout-XshK3MsM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERMISSOES = {
	ADMINISTRADOR: {
		menu: [
			"home",
			"dashboard",
			"chamados",
			"novo-chamado",
			"equipamentos",
			"usuarios",
			"relatorios",
			"mapa-salas",
			"unidades"
		],
		verChamados: "todos",
		acoes: false,
		novoChamado: true,
		cor: "#16a34a",
		descricao: "Acesso administrativo."
	},
	INSTRUTOR: {
		menu: [
			"home",
			"chamados",
			"novo-chamado",
			"minhas-turmas"
		],
		verChamados: "proprios",
		acoes: false,
		novoChamado: true,
		cor: "#2b8cff",
		descricao: "Solicita e acompanha os proprios chamados."
	},
	COORDENADOR: {
		menu: [
			"home",
			"dashboard",
			"chamados",
			"novo-chamado",
			"equipamentos",
			"mapa-salas"
		],
		verChamados: "proprios",
		acoes: false,
		novoChamado: true,
		cor: "#7c3aed",
		descricao: "Acompanha solicitacoes e equipamentos."
	},
	TECNICO: {
		menu: [
			"home",
			"dashboard",
			"chamados",
			"equipamentos",
			"relatorios",
			"mapa-salas"
		],
		verChamados: "todos",
		acoes: true,
		novoChamado: false,
		cor: "#ff8a3d",
		descricao: "Atende chamados e registra relatorios."
	}
};
function getPerfil() {
	return getUsuario()?.tipo || "";
}
function getPermissoes() {
	const perfil = getPerfil();
	return perfil ? PERMISSOES[perfil] : null;
}
var items = [
	{
		key: "home",
		label: "Inicio",
		to: "/home"
	},
	{
		key: "dashboard",
		label: "Dashboard",
		to: "/dashboard"
	},
	{
		key: "chamados",
		label: "Chamados",
		to: "/chamados"
	},
	{
		key: "novo-chamado",
		label: "Novo chamado",
		to: "/novo-chamado"
	},
	{
		key: "equipamentos",
		label: "Equipamentos",
		to: "/equipamentos"
	},
	{
		key: "minhas-turmas",
		label: "Minhas turmas",
		to: "/minhas-turmas"
	},
	{
		key: "mapa-salas",
		label: "Mapa de salas",
		to: "/mapa-salas"
	},
	{
		key: "usuarios",
		label: "Usuarios",
		to: "/usuarios"
	},
	{
		key: "unidades",
		label: "Unidades",
		to: "/unidades"
	},
	{
		key: "relatorios",
		label: "Relatorios",
		to: "/relatorios"
	}
];
function AppShell({ active, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [perfil, setPerfil] = (0, import_react.useState)("");
	const [cor, setCor] = (0, import_react.useState)("#2b8cff");
	const [menu, setMenu] = (0, import_react.useState)([]);
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		const permissao = getPermissoes();
		if (!permissao) {
			nav({ to: "/login" });
			return;
		}
		if (!permissao.menu.includes(active)) {
			nav({ to: getPerfil() === "ADMINISTRADOR" ? "/admin" : "/chamados" });
			return;
		}
		setPerfil(getPerfil());
		setCor(permissao.cor);
		setMenu(permissao.menu);
		setReady(true);
	}, [active, nav]);
	if (!ready) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `sidebar ${open ? "open" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "brand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/logo-senac.png",
						alt: "Logo Senac",
						className: "logo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "brand-name",
						children: ["Conecta", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TI" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							marginTop: 10,
							padding: "6px 10px",
							borderRadius: 999,
							fontSize: ".72rem",
							fontWeight: 700,
							color: "#fff",
							background: cor,
							textAlign: "center"
						},
						children: perfil
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
				items.filter((item) => menu.includes(item.key)).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: active === item.key ? "active" : "",
					onClick: () => setOpen(false),
					children: item.key === "chamados" && perfil === "TECNICO" ? "Central de suporte" : item.label
				}, item.key)),
				perfil === "ADMINISTRADOR" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: "Administracao"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#",
					className: "logout",
					onClick: (event) => {
						event.preventDefault();
						clearSession();
						nav({ to: "/login" });
					},
					children: "Sair"
				})
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "app-main",
			children
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: "menu-toggle-floating",
		onClick: () => setOpen((value) => !value),
		"aria-label": "Abrir ou fechar menu",
		children: "☰"
	})] });
}
export { getPermissoes as n, AppShell as t };
