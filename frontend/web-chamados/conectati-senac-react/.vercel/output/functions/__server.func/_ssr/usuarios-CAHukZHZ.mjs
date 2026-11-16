import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { o as usuariosService } from "./conectati-3jMJYayc.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/usuarios-CAHukZHZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Usuarios() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [erro, setErro] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		email: "",
		senha: "",
		tipo: "INSTRUTOR"
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const carregar = () => usuariosService.listar().then(setItems).catch((error) => setErro(error.message));
	(0, import_react.useEffect)(() => {
		carregar();
	}, []);
	const salvar = async (event) => {
		event.preventDefault();
		try {
			await usuariosService.criar({
				...form,
				telefone: "",
				ativo: true
			});
			setOpen(false);
			setForm({
				nome: "",
				email: "",
				senha: "",
				tipo: "INSTRUTOR"
			});
			carregar();
		} catch (error) {
			setErro(error instanceof Error ? error.message : "Nao foi possivel criar o usuario.");
		}
	};
	const remover = async (id) => {
		if (!confirm("Desativar este usuario?")) return;
		try {
			await usuariosService.remover(id);
			carregar();
		} catch (error) {
			setErro(error instanceof Error ? error.message : "Nao foi possivel desativar.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Gestao de usuarios" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Dados fornecidos pela API."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					onClick: () => setOpen(true),
					children: "+ Novo usuario"
				})]
			}),
			erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alerta erro",
				children: erro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card reveal visible",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "tabela",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Nome" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "E-mail" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Cargo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Ativo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.nome }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.email }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.tipo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.ativo ? "Sim" : "Nao" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-ghost",
								onClick: () => remover(item.id),
								children: "Desativar"
							}) })
						] }, item.id)) })]
					})
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Novo usuario" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "form",
						onSubmit: salvar,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Nome", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.nome,
								onChange: (event) => setForm({
									...form,
									nome: event.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["E-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								value: form.email,
								onChange: (event) => setForm({
									...form,
									email: event.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Senha", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								minLength: 6,
								type: "password",
								value: form.senha,
								onChange: (event) => setForm({
									...form,
									senha: event.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Cargo", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.tipo,
								onChange: (event) => setForm({
									...form,
									tipo: event.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ADMINISTRADOR",
										children: "Administrador"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "INSTRUTOR",
										children: "Instrutor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "TECNICO",
										children: "Tecnico"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "COORDENADOR",
										children: "Coordenador"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
	active: "usuarios",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Usuarios, {})
});
export { SplitComponent as component };
