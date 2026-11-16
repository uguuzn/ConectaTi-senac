import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { i as equipamentosService } from "./conectati-3jMJYayc.mjs";
import { u as slug } from "./store-pwHPOLYi.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/equipamentos-CFExG85n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Equipamentos() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [erro, setErro] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		equipamentosService.listar().then(setItems).catch((error) => setErro(error.message));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "topbar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Equipamentos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Disponibilidade consultada em tempo real."
				})] })
			}),
			erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alerta erro",
				children: erro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "cards-grid equip-grid",
				children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `equip-card ${slug(item.status)} reveal visible`,
					style: { animationDelay: `${index * 40}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: item.nome }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tipo",
							children: item.tipo || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "patr",
							children: ["Patrimônio ", item.patrimonio]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `status ${slug(item.status)}`,
							children: item.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "loc",
							children: item.salaNome || "Sem sala"
						})
					]
				}, item.id))
			}),
			!erro && !items.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted center",
				children: "Nenhum equipamento cadastrado."
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	active: "equipamentos",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equipamentos, {})
});
export { SplitComponent as component };
