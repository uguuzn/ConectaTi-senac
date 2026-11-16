import { i as __toESM } from "../_runtime.mjs";
import { i as equipamentosService, o as usuariosService, r as chamadosService } from "./conectati-3jMJYayc.mjs";
import { n as getUsuario } from "./session-nq0S3h9M.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-9xvom04i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const nav = useNavigate();
	const [dados, setDados] = (0, import_react.useState)(null);
	const [erro, setErro] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (getUsuario()?.tipo !== "ADMINISTRADOR") {
			nav({ to: "/login" });
			return;
		}
		Promise.all([
			chamadosService.listar(),
			equipamentosService.listar(),
			usuariosService.listar()
		]).then(([chamados, equipamentos, usuarios]) => setDados({
			chamados,
			equipamentos,
			usuarios
		})).catch((error) => setErro(error.message));
	}, [nav]);
	if (!dados && !erro) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "content",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted",
			children: "Carregando administracao..."
		})
	});
	const abertos = dados?.chamados.filter((item) => item.status === "ABERTO").length || 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content admin-desktop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Administracao" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Visao de gerenciamento para computador."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/home",
					className: "btn btn-outline",
					children: "Abrir area web"
				})]
			}),
			erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alerta erro",
				children: erro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "cards-grid",
				children: [
					[dados?.usuarios.length || 0, "Usuarios"],
					[dados?.chamados.length || 0, "Chamados"],
					[abertos, "Chamados abertos"],
					[dados?.equipamentos.length || 0, "Equipamentos"]
				].map(([valor, rotulo]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card kpi reveal visible",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: valor }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: rotulo })] })
				}, String(rotulo)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "charts",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Atalhos administrativos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "actions-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "btn btn-primary",
								to: "/usuarios",
								children: "Gerenciar usuarios"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "btn btn-outline",
								to: "/chamados",
								children: "Todos os chamados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "btn btn-outline",
								to: "/equipamentos",
								children: "Equipamentos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "btn btn-outline",
								to: "/relatorios",
								children: "Indicadores"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Chamados recentes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "tabela",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "#" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Titulo" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Solicitante" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: dados?.chamados.slice(0, 6).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: ["#", item.id] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.titulo }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.solicitanteNome || "-" })
							] }, item.id)) })]
						})
					})]
				})]
			})
		]
	});
}
export { AdminPage as component };
