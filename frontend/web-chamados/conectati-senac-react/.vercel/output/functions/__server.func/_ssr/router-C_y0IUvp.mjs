import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createRootRouteWithContext, b as useRouter, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
// node_modules/.nitro/vite/services/ssr/assets/router-C_y0IUvp.js
var router_C_y0IUvp_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DYNHebB0.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página que você procura não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Ir para o início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Esta página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Ocorreu um erro inesperado. Você pode tentar novamente ou voltar para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ir para o início"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ConectaTI Senac" },
			{
				name: "description",
				content: "Sistema de chamados de TI, salas e gestão de equipamentos do Senac."
			},
			{
				name: "author",
				content: "ConectaTI Senac"
			},
			{
				property: "og:title",
				content: "ConectaTI Senac"
			},
			{
				property: "og:description",
				content: "Chamados de TI, salas e gestão de equipamentos."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "/css/style.css"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$12 = () => import("./routes-2rRUdO2s.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "ConectaTI Senac" }, {
		name: "description",
		content: "Sistema de chamados, salas e gestão do Senac."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin-9xvom04i.mjs");
var Route$11 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./chamados-X61jf434.mjs");
var Route$10 = createFileRoute("/chamados")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./dashboard-BZC5Dfjm.mjs");
var Route$9 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./equipamentos-CFExG85n.mjs");
var Route$8 = createFileRoute("/equipamentos")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./home-8Edzy1UB.mjs");
var Route$7 = createFileRoute("/home")({
	head: () => ({ meta: [
		{ title: "ConectaTI Senac — Início" },
		{
			name: "description",
			content: "Plataforma interna do Senac Taguatinga para chamados, salas e equipamentos."
		},
		{
			property: "og:title",
			content: "ConectaTI Senac"
		},
		{
			property: "og:description",
			content: "Chamados, suporte técnico e gestão de equipamentos."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./login-B8wUWyDs.mjs");
var Route$6 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./mapa-salas-Ct2YSKa-.mjs");
var Route$5 = createFileRoute("/mapa-salas")({
	head: () => ({ meta: [{ title: "ConectaTI Senac — Mapa de salas" }, {
		name: "description",
		content: "Controle das chaves de salas e auditórios."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./minhas-turmas-CUZnWUTD.mjs");
var Route$4 = createFileRoute("/minhas-turmas")({
	head: () => ({ meta: [{ title: "ConectaTI Senac — Minhas turmas" }, {
		name: "description",
		content: "Turmas do instrutor e solicitações de sala."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./novo-chamado-DAVgfo3M.mjs");
var Route$3 = createFileRoute("/novo-chamado")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./relatorios-B39cerrj.mjs");
var Route$2 = createFileRoute("/relatorios")({
	head: () => ({ meta: [{ title: "ConectaTI Senac — Relatórios" }, {
		name: "description",
		content: "Indicadores e exportações da unidade."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./unidades-5ESsyWSh.mjs");
var Route$1 = createFileRoute("/unidades")({
	head: () => ({ meta: [{ title: "ConectaTI Senac — Unidades" }, {
		name: "description",
		content: "Cadastre e gerencie as unidades Senac."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./usuarios-CAHukZHZ.mjs");
var Route = createFileRoute("/usuarios")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$12.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$13
	}),
	AdminRoute: Route$11.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$13
	}),
	ChamadosRoute: Route$10.update({
		id: "/chamados",
		path: "/chamados",
		getParentRoute: () => Route$13
	}),
	DashboardRoute: Route$9.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$13
	}),
	EquipamentosRoute: Route$8.update({
		id: "/equipamentos",
		path: "/equipamentos",
		getParentRoute: () => Route$13
	}),
	HomeRoute: Route$7.update({
		id: "/home",
		path: "/home",
		getParentRoute: () => Route$13
	}),
	LoginRoute: Route$6.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$13
	}),
	MapaSalasRoute: Route$5.update({
		id: "/mapa-salas",
		path: "/mapa-salas",
		getParentRoute: () => Route$13
	}),
	MinhasTurmasRoute: Route$4.update({
		id: "/minhas-turmas",
		path: "/minhas-turmas",
		getParentRoute: () => Route$13
	}),
	NovoChamadoRoute: Route$3.update({
		id: "/novo-chamado",
		path: "/novo-chamado",
		getParentRoute: () => Route$13
	}),
	RelatoriosRoute: Route$2.update({
		id: "/relatorios",
		path: "/relatorios",
		getParentRoute: () => Route$13
	}),
	UnidadesRoute: Route$1.update({
		id: "/unidades",
		path: "/unidades",
		getParentRoute: () => Route$13
	}),
	UsuariosRoute: Route.update({
		id: "/usuarios",
		path: "/usuarios",
		getParentRoute: () => Route$13
	})
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
export { getRouter, router_C_y0IUvp_exports as t };
