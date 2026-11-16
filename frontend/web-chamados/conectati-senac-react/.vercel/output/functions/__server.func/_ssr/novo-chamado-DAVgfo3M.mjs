import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { a as salasService, n as categoriasService, r as chamadosService } from "./conectati-3jMJYayc.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/novo-chamado-DAVgfo3M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	titulo: "",
	descricao: "",
	prioridade: "MEDIA",
	categoriaId: "",
	salaId: ""
};
function NovoChamado() {
	const [categorias, setCategorias] = (0, import_react.useState)([]);
	const [salas, setSalas] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		Promise.all([categoriasService.listar(), salasService.listar()]).then(([itemsCategorias, itemsSalas]) => {
			if (!active) return;
			setCategorias(itemsCategorias);
			setSalas(itemsSalas);
		}).catch((error) => {
			if (active) setFeedback({
				kind: "error",
				text: error instanceof Error ? error.message : "Não foi possível carregar categorias e salas."
			});
		});
		return () => {
			active = false;
		};
	}, []);
	const submit = async (event) => {
		event.preventDefault();
		setFeedback(null);
		setSubmitting(true);
		try {
			const chamado = await chamadosService.criar({
				titulo: form.titulo.trim(),
				descricao: form.descricao.trim(),
				prioridade: form.prioridade,
				categoriaId: Number(form.categoriaId),
				...form.salaId ? { salaId: Number(form.salaId) } : {}
			});
			setFeedback({
				kind: "success",
				text: `Chamado #${chamado.id} criado com sucesso.`
			});
			setForm(emptyForm);
		} catch (error) {
			setFeedback({
				kind: "error",
				text: error instanceof Error ? error.message : "Não foi possível registrar o chamado."
			});
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "topbar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Abrir novo chamado" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted",
				children: "Descreva sua solicitação."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "card reveal visible",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "form form-grid",
				onSubmit: submit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Título", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						maxLength: 150,
						value: form.titulo,
						onChange: (event) => setForm({
							...form,
							titulo: event.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Prioridade", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.prioridade,
						onChange: (event) => setForm({
							...form,
							prioridade: event.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "BAIXA",
								children: "Baixa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "MEDIA",
								children: "Média"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALTA",
								children: "Alta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "URGENTE",
								children: "Urgente"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Categoria", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						required: true,
						value: form.categoriaId,
						onChange: (event) => setForm({
							...form,
							categoriaId: event.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Selecione"
						}), categorias.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.nome
						}, item.id))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Sala (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.salaId,
						onChange: (event) => setForm({
							...form,
							salaId: event.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Não informar"
						}), salas.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.nome
						}, item.id))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "full",
						children: ["Descrição", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							maxLength: 5e3,
							rows: 5,
							value: form.descricao,
							onChange: (event) => setForm({
								...form,
								descricao: event.target.value
							})
						})]
					}),
					feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "status",
						"aria-live": "polite",
						className: `alerta ${feedback.kind === "success" ? "sucesso" : "erro"} full`,
						children: feedback.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "full actions-row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: submitting,
							children: submitting ? "Enviando..." : "Enviar chamado"
						})
					})
				]
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	active: "novo-chamado",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NovoChamado, {})
});
export { SplitComponent as component };
