import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { i as equipamentosService, r as chamadosService } from "./conectati-3jMJYayc.mjs";
import { n as getUsuario } from "./session-nq0S3h9M.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/dashboard-BZC5Dfjm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const [dados, setDados] = (0, import_react.useState)(null);
	const [erro, setErro] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const equipamentosPromise = getUsuario()?.tipo === "INSTRUTOR" ? Promise.resolve([]) : equipamentosService.listar();
		Promise.all([chamadosService.listar(), equipamentosPromise]).then(([chamados, equipamentos]) => setDados({
			chamados,
			equipamentos
		})).catch((error) => setErro(error.message));
	}, []);
	const cards = dados ? [
		[dados.chamados.length, "Chamados"],
		[dados.chamados.filter((item) => item.status === "ABERTO").length, "Abertos"],
		[dados.chamados.filter((item) => item.status === "CONCLUIDO").length, "Concluidos"],
		[dados.equipamentos.length, "Equipamentos"]
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Indicadores calculados a partir dos dados da API."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/chamados",
					className: "btn btn-primary",
					children: "Ver chamados"
				})]
			}),
			erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alerta erro",
				children: erro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "cards-grid",
				children: cards.map(([numero, titulo]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card kpi reveal visible",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: numero }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: titulo })] })
				}, String(titulo)))
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	active: "dashboard",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {})
});
export { SplitComponent as component };
