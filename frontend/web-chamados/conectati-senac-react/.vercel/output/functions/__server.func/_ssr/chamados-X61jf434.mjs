import { i as __toESM } from "../_runtime.mjs";
import { n as getPermissoes, t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { r as chamadosService } from "./conectati-3jMJYayc.mjs";
import { n as getUsuario } from "./session-nq0S3h9M.mjs";
import { u as slug } from "./store-pwHPOLYi.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/chamados-X61jf434.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Chamados() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [busca, setBusca] = (0, import_react.useState)("");
	const [erro, setErro] = (0, import_react.useState)("");
	const [mensagem, setMensagem] = (0, import_react.useState)("");
	const [ocupado, setOcupado] = (0, import_react.useState)(null);
	const [relatorioId, setRelatorioId] = (0, import_react.useState)(null);
	const [relatorio, setRelatorio] = (0, import_react.useState)({
		problemaIdentificado: "",
		diagnostico: "",
		procedimentosRealizados: "",
		solucaoAplicada: "",
		observacoes: ""
	});
	const perm = getPermissoes();
	const usuario = getUsuario();
	const suporte = perm?.acoes === true;
	const recarregar = async () => setItems(await chamadosService.listar());
	const executarAcao = async (item, acao) => {
		setErro("");
		setMensagem("");
		setOcupado(item.id);
		try {
			if (acao === "assumir") await chamadosService.assumir(item.id);
			if (acao === "iniciar") await chamadosService.alterarStatus(item.id, { status: "EM_ANDAMENTO" });
			if (acao === "concluir") await chamadosService.alterarStatus(item.id, {
				status: "CONCLUIDO",
				solucao: item.solucao
			});
			if (acao === "cancelar") {
				const justificativaCancelamento = window.prompt("Informe a justificativa do cancelamento:")?.trim();
				if (!justificativaCancelamento) return;
				await chamadosService.alterarStatus(item.id, {
					status: "CANCELADO",
					justificativaCancelamento
				});
			}
			await recarregar();
			setMensagem(`Chamado #${item.id} atualizado.`);
		} catch (error) {
			setErro(error instanceof Error ? error.message : "Não foi possível atualizar o chamado.");
		} finally {
			setOcupado(null);
		}
	};
	const salvarRelatorio = async (event) => {
		event.preventDefault();
		if (relatorioId === null) return;
		setErro("");
		setMensagem("");
		setOcupado(relatorioId);
		try {
			await chamadosService.registrarRelatorio(relatorioId, relatorio);
			await recarregar();
			setMensagem(`Relatório técnico do chamado #${relatorioId} salvo.`);
			setRelatorioId(null);
			setRelatorio({
				problemaIdentificado: "",
				diagnostico: "",
				procedimentosRealizados: "",
				solucaoAplicada: "",
				observacoes: ""
			});
		} catch (error) {
			setErro(error instanceof Error ? error.message : "Não foi possível salvar o relatório técnico.");
		} finally {
			setOcupado(null);
		}
	};
	(0, import_react.useEffect)(() => {
		chamadosService.listar().then(setItems).catch((error) => setErro(error.message));
	}, []);
	const filtrados = (0, import_react.useMemo)(() => items.filter((item) => (perm?.verChamados !== "proprios" || item.solicitanteId === usuario?.id) && (!busca || `${item.titulo} ${item.solicitanteNome} ${item.categoriaNome}`.toLowerCase().includes(busca.toLowerCase()))), [
		items,
		busca,
		perm?.verChamados,
		usuario?.id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Chamados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Solicitacoes registradas na API."
				})] }), perm?.novoChamado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/novo-chamado",
					className: "btn btn-primary",
					children: "+ Novo chamado"
				})]
			}),
			suporte && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "support-intro card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Central de suporte" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Assuma chamados, registre o atendimento e acompanhe sua fila pelo celular."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "filters card reveal visible",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					placeholder: "Buscar chamado...",
					value: busca,
					onChange: (event) => setBusca(event.target.value)
				})
			}),
			erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alerta erro",
				children: erro
			}),
			mensagem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "alerta sucesso",
				role: "status",
				children: mensagem
			}),
			suporte ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "support-queue",
				"aria-label": "Fila de chamados de suporte",
				children: [filtrados.map((item) => {
					const meuChamado = item.tecnicoResponsavelId === usuario?.id;
					const terminal = item.status === "CONCLUIDO" || item.status === "CANCELADO";
					const temRelatorio = Boolean(item.problemaIdentificado && item.diagnostico && item.procedimentosRealizados && item.solucao);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "support-ticket card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "support-ticket-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "muted",
									children: ["Chamado #", item.id]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: item.titulo })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `status ${slug(item.status)}`,
									children: item.status.replaceAll("_", " ")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.descricao }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "support-ticket-facts",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Solicitante" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: item.solicitanteNome || "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: item.categoriaNome || "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Prioridade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: item.prioridade })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Responsável" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: item.tecnicoResponsavelNome || "Fila aberta" })] })
								]
							}),
							!terminal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "support-actions",
								children: [
									!item.tecnicoResponsavelId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-primary",
										disabled: ocupado === item.id,
										onClick: () => executarAcao(item, "assumir"),
										children: "Assumir chamado"
									}),
									meuChamado && item.status === "EM_ANALISE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-primary",
										disabled: ocupado === item.id,
										onClick: () => executarAcao(item, "iniciar"),
										children: "Iniciar atendimento"
									}),
									meuChamado && item.status !== "ABERTO" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-outline",
										onClick: () => setRelatorioId(relatorioId === item.id ? null : item.id),
										children: "Registrar atendimento"
									}),
									meuChamado && item.status === "EM_ANDAMENTO" && temRelatorio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-primary",
										disabled: ocupado === item.id,
										onClick: () => executarAcao(item, "concluir"),
										children: "Concluir chamado"
									}),
									meuChamado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-ghost",
										disabled: ocupado === item.id,
										onClick: () => executarAcao(item, "cancelar"),
										children: "Cancelar"
									})
								]
							}),
							meuChamado && !temRelatorio && item.status !== "ABERTO" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "muted support-hint",
								children: "Para concluir, registre os dados do atendimento."
							}),
							relatorioId === item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "support-report",
								onSubmit: salvarRelatorio,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Relatório técnico" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Problema identificado", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										value: relatorio.problemaIdentificado,
										onChange: (event) => setRelatorio({
											...relatorio,
											problemaIdentificado: event.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Diagnóstico", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										rows: 3,
										value: relatorio.diagnostico,
										onChange: (event) => setRelatorio({
											...relatorio,
											diagnostico: event.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Procedimentos realizados", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										rows: 3,
										value: relatorio.procedimentosRealizados,
										onChange: (event) => setRelatorio({
											...relatorio,
											procedimentosRealizados: event.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Solução aplicada", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										rows: 3,
										value: relatorio.solucaoAplicada,
										onChange: (event) => setRelatorio({
											...relatorio,
											solucaoAplicada: event.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Observações (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: relatorio.observacoes,
										onChange: (event) => setRelatorio({
											...relatorio,
											observacoes: event.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-primary",
										disabled: ocupado === item.id,
										children: ocupado === item.id ? "Salvando…" : "Salvar relatório"
									})
								]
							})
						]
					}, item.id);
				}), !erro && !filtrados.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted center card",
					children: "Nenhum chamado na fila."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card reveal visible",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "tabela",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "#" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Titulo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Solicitante" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Categoria" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sala" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Prioridade" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Data" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtrados.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["#", item.id] }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.titulo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.solicitanteNome || "-" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.categoriaNome || "-" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.salaNome || "-" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `prioridade ${slug(item.prioridade)}`,
								children: item.prioridade
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `status ${slug(item.status)}`,
								children: item.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(item.dataCriacao).toLocaleDateString("pt-BR") })
						] }, item.id)) })]
					})
				}), !erro && !filtrados.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted center",
					children: "Nenhum chamado encontrado."
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	active: "chamados",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chamados, {})
});
export { SplitComponent as component };
