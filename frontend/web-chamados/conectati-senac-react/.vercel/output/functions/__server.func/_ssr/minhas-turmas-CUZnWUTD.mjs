import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { c as setSolicitacoes, d as toast, f as uid, i as getSolicitacoes, o as getUsuarios, r as getSalas, t as TURMAS_DEFAULT, u as slug } from "./store-pwHPOLYi.mjs";
import { n as getUsuario } from "./session-nq0S3h9M.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/minhas-turmas-CUZnWUTD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Turmas() {
	const turmas = TURMAS_DEFAULT;
	const [modalTurma, setModalTurma] = (0, import_react.useState)(null);
	const [minhas, setMinhas] = (0, import_react.useState)([]);
	const [data, setData] = (0, import_react.useState)("");
	const [hora, setHora] = (0, import_react.useState)("");
	const [sala, setSala] = (0, import_react.useState)("");
	const [obs, setObs] = (0, import_react.useState)("");
	const email = getUsuario()?.email.toLowerCase() || "";
	const salas = typeof window !== "undefined" ? getSalas() : [];
	const refresh = () => setMinhas(getSolicitacoes().filter((s) => s.instrutorEmail === email).slice().reverse());
	(0, import_react.useEffect)(refresh, [email]);
	const abrir = (t) => {
		setModalTurma(t);
		setData((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
		setHora(t.horario.slice(0, 5));
		setSala(salas[0]?.nome || "");
		setObs("");
	};
	const enviar = (e) => {
		e.preventDefault();
		if (!modalTurma) return;
		const nova = {
			id: uid("sol"),
			n: String(Math.floor(Math.random() * 900) + 100),
			instrutorEmail: email,
			instrutorNome: getUsuarios().find((u) => u.email.toLowerCase() === email)?.nome || "Instrutor",
			turma: modalTurma.turma,
			salaPreferida: sala,
			data,
			hora,
			obs,
			status: "Pendente",
			salaAtribuida: null
		};
		const arr = getSolicitacoes();
		arr.push(nova);
		setSolicitacoes(arr);
		toast("Solicitação enviada.");
		setModalTurma(null);
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "topbar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Minhas turmas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Visualize suas turmas e solicite uma sala para a aula."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "cards-grid",
				children: turmas.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card turma-card reveal visible",
					style: { animationDelay: `${i * 60}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "turma-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t.turma }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "badge-mini",
								children: [t.alunos, " alunos"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted",
							children: t.curso
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "turma-info",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Horário:" }),
								" ",
								t.horario
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Dias:" }),
								" ",
								t.dias
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary btn-block",
							onClick: () => abrir(t),
							children: "Solicitar sala"
						})
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card reveal visible",
				style: { marginTop: 24 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Minhas solicitações de sala" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "tabela",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Nº" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Turma" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sala preferida" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Data" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Horário" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sala atribuída" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: minhas.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["#", s.n] }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.turma }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.salaPreferida }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.data }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.hora }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `status ${slug(s.status)}`,
									children: s.status
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.salaAtribuida || "—" })
							] }, s.id)) })]
						})
					}),
					minhas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "muted center",
						children: "Você ainda não fez solicitações."
					})
				]
			}),
			modalTurma && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: ["Solicitar sala — ", modalTurma.turma] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "form",
						onSubmit: enviar,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
								"Data",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: data,
									onChange: (e) => setData(e.target.value),
									required: true
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
								"Horário",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "time",
									value: hora,
									onChange: (e) => setHora(e.target.value),
									required: true
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Sala preferida", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: sala,
								onChange: (e) => setSala(e.target.value),
								children: salas.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s.nome,
									children: [
										s.nome,
										" (",
										s.tipo,
										")"
									]
								}, s.nome))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Observação", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: obs,
								onChange: (e) => setObs(e.target.value),
								placeholder: "Ex.: preciso de projetor..."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setModalTurma(null),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary",
									children: "Enviar solicitação"
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
	active: "minhas-turmas",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Turmas, {})
});
export { SplitComponent as component };
