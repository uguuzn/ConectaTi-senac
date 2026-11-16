import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { a as getUnidades, d as toast, f as uid, l as setUnidades } from "./store-pwHPOLYi.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/unidades-5ESsyWSh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Uns() {
	const [arr, setArr] = (0, import_react.useState)([]);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		cidade: "",
		salas: 10
	});
	const refresh = () => setArr(getUnidades());
	(0, import_react.useEffect)(refresh, []);
	const abrir = (u) => {
		if (u) {
			setEditing(u);
			setForm({
				nome: u.nome,
				cidade: u.cidade,
				salas: u.salas
			});
		} else {
			setEditing(null);
			setForm({
				nome: "",
				cidade: "",
				salas: 10
			});
		}
		setOpen(true);
	};
	const salvar = (e) => {
		e.preventDefault();
		if (!form.nome) {
			toast("Informe o nome.");
			return;
		}
		const list = getUnidades();
		if (editing) {
			const u = list.find((x) => x.id === editing.id);
			if (u) Object.assign(u, form);
		} else list.push({
			id: uid("un"),
			...form
		});
		setUnidades(list);
		toast(editing ? "Unidade atualizada." : "Unidade criada.");
		setOpen(false);
		refresh();
	};
	const excluir = (id) => {
		if (!confirm("Excluir esta unidade?")) return;
		setUnidades(getUnidades().filter((x) => x.id !== id));
		toast("Unidade excluída.");
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Gestão de unidades" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Cadastre e gerencie as unidades Senac."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					onClick: () => abrir(),
					children: "+ Nova unidade"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card reveal visible",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "tabela",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Nome" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Cidade / DF" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Salas cadastradas" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Ações" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: arr.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: u.nome }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: u.cidade }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: u.salas }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-ghost",
								onClick: () => abrir(u),
								children: "Editar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-ghost",
								onClick: () => excluir(u.id),
								children: "Excluir"
							})] })
						] }, u.id)) })]
					})
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: editing ? "Editar unidade" : "Nova unidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "form",
						onSubmit: salvar,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
								"Nome",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.nome,
									onChange: (e) => setForm({
										...form,
										nome: e.target.value
									}),
									placeholder: "Ex.: Senac Taguatinga Sul",
									required: true
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
								"Cidade / DF",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.cidade,
									onChange: (e) => setForm({
										...form,
										cidade: e.target.value
									}),
									placeholder: "Ex.: Taguatinga/DF",
									required: true
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
								"Salas cadastradas",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: form.salas,
									onChange: (e) => setForm({
										...form,
										salas: parseInt(e.target.value, 10) || 0
									})
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary",
									children: "Salvar"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	active: "unidades",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Uns, {})
});
export { SplitComponent as component };
