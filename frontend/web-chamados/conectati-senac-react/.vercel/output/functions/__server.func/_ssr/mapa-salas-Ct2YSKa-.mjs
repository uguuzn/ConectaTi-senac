import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { c as setSolicitacoes, d as toast, i as getSolicitacoes, o as getUsuarios, r as getSalas, s as setSalas, u as slug } from "./store-pwHPOLYi.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/mapa-salas-Ct2YSKa-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MapaPage() {
	const [salas, setSalasSt] = (0, import_react.useState)([]);
	const [pend, setPend] = (0, import_react.useState)([]);
	const [modal, setModal] = (0, import_react.useState)(null);
	const [respId, setRespId] = (0, import_react.useState)("");
	const [motivo, setMotivo] = (0, import_react.useState)("");
	const refresh = () => {
		setSalasSt(getSalas());
		setPend(getSolicitacoes().filter((s) => s.status === "Pendente"));
	};
	(0, import_react.useEffect)(refresh, []);
	const usuarios = typeof window !== "undefined" ? getUsuarios().filter((u) => u.perfil === "Instrutor" || u.perfil === "Coordenação") : [];
	const abrirModal = (sala, opts) => {
		setModal({
			sala,
			...opts
		});
		setRespId(opts?.respId || usuarios[0]?.id || "");
		setMotivo(opts?.motivo || "");
	};
	const entregarChave = (e) => {
		e.preventDefault();
		if (!modal) return;
		const resp = getUsuarios().find((u) => u.id === respId);
		if (!resp) return;
		const arr = getSalas();
		const idx = arr.findIndex((x) => x.nome === modal.sala);
		if (idx < 0) return;
		arr[idx].chave = {
			responsavelId: resp.id,
			responsavelNome: resp.nome,
			perfil: resp.perfil,
			motivo,
			desde: (/* @__PURE__ */ new Date()).toISOString()
		};
		setSalas(arr);
		if (modal.solicitacaoId) {
			const sols = getSolicitacoes();
			const s = sols.find((x) => x.id === modal.solicitacaoId);
			if (s) {
				s.status = "Atribuída";
				s.salaAtribuida = modal.sala;
				setSolicitacoes(sols);
			}
		}
		toast(`Chave da ${modal.sala} entregue a ${resp.nome}.`);
		setModal(null);
		refresh();
	};
	const devolver = (nome) => {
		const arr = getSalas();
		const idx = arr.findIndex((x) => x.nome === nome);
		if (idx < 0) return;
		arr[idx].chave = null;
		setSalas(arr);
		toast(`Chave da ${nome} devolvida.`);
		refresh();
	};
	const negar = (id) => {
		const arr = getSolicitacoes();
		const s = arr.find((x) => x.id === id);
		if (!s) return;
		s.status = "Negada";
		setSolicitacoes(arr);
		toast("Solicitação negada.");
		refresh();
	};
	const livres = salas.filter((s) => !s.chave).length;
	const chaves = salas.length - livres;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "topbar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Mapa de salas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Controle das chaves de salas e auditórios da unidade."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "cards-grid kpi-small",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card kpi reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kpi-icon",
							style: { background: "var(--grad-green)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: livres }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Salas livres" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card kpi reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kpi-icon",
							style: { background: "var(--grad-yellow)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: chaves }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Chaves em uso" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card kpi reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kpi-icon",
							style: { background: "var(--grad-orange)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: pend.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Solicitações pendentes" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card kpi reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kpi-icon",
							style: { background: "var(--grad-blue)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: salas.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Salas cadastradas" })] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card reveal visible",
				style: { marginTop: 20 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Mapa das salas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mapa-grid",
					children: salas.map((s) => {
						const emUso = !!s.chave;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `sala-cell ${emUso ? "ocupada" : "livre"} ${slug(s.tipo)}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sala-topo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: s.nome }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge-mini",
										children: s.tipo
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sala-status",
									children: emUso ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "status em-atendimento",
										children: ["Chave com ", s.chave.responsavelNome]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "muted",
										children: s.chave.motivo || ""
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "status resolvido",
										children: "Chave disponível"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sala-actions",
									children: emUso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-ghost",
										onClick: () => devolver(s.nome),
										children: "Devolver chave"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-primary",
										onClick: () => abrirModal(s.nome),
										children: "Atribuir chave"
									})
								})
							]
						}, s.nome);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card reveal visible",
				style: { marginTop: 20 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Solicitações de sala pendentes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "tabela",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Nº" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Instrutor" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Turma" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sala preferida" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Data" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Horário" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Ações" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pend.map((s) => {
								const inst = getUsuarios().find((u) => u.email.toLowerCase() === s.instrutorEmail);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["#", s.n] }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.instrutorNome }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.turma }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.salaPreferida }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.data }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.hora }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-primary",
										onClick: () => abrirModal(s.salaPreferida, {
											solicitacaoId: s.id,
											respId: inst?.id,
											motivo: `${s.turma} — ${s.data} ${s.hora}`
										}),
										children: "Atribuir chave"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-ghost",
										onClick: () => negar(s.id),
										children: "Negar"
									})] })
								] }, s.id);
							}) })]
						})
					}),
					pend.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "muted center",
						children: "Nenhuma solicitação pendente."
					})
				]
			}),
			modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: ["Atribuir chave — ", modal.sala] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "form",
						onSubmit: entregarChave,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Responsável (Instrutor / Coordenador)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: respId,
								onChange: (e) => setRespId(e.target.value),
								children: usuarios.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: u.id,
									children: [
										u.nome,
										" — ",
										u.perfil
									]
								}, u.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Turma / Motivo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: motivo,
								onChange: (e) => setMotivo(e.target.value),
								placeholder: "Ex.: Turma TDS Manhã / Reunião"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setModal(null),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary",
									children: "Entregar chave"
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
	active: "mapa-salas",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapaPage, {})
});
export { SplitComponent as component };
