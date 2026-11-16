import { i as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./AppLayout-XshK3MsM.mjs";
import { r as chamadosService } from "./conectati-3jMJYayc.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/relatorios-B39cerrj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cores = [
	"var(--grad-red)",
	"var(--grad-orange)",
	"var(--grad-yellow)",
	"var(--grad-blue)",
	"var(--grad-teal)"
];
function agrupar(items, campo) {
	const contagem = /* @__PURE__ */ new Map();
	for (const item of items) {
		const nome = campo(item)?.trim();
		if (nome) contagem.set(nome, (contagem.get(nome) || 0) + 1);
	}
	return [...contagem].map(([nome, total]) => ({
		nome,
		total
	})).sort((a, b) => b.total - a.total).slice(0, 5);
}
function Relatorios() {
	const [chamados, setChamados] = (0, import_react.useState)([]);
	const [mes, setMes] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
	const [categoria, setCategoria] = (0, import_react.useState)("");
	const [erro, setErro] = (0, import_react.useState)("");
	const [carregando, setCarregando] = (0, import_react.useState)(true);
	const carregar = (0, import_react.useCallback)(async () => {
		setCarregando(true);
		setErro("");
		try {
			setChamados(await chamadosService.listar());
		} catch (error) {
			setErro(error instanceof Error ? error.message : "Não foi possível carregar os relatórios.");
		} finally {
			setCarregando(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		carregar();
	}, [carregar]);
	const categorias = (0, import_react.useMemo)(() => [...new Set(chamados.map((item) => item.categoriaNome).filter((nome) => Boolean(nome)))].sort(), [chamados]);
	const filtrados = (0, import_react.useMemo)(() => chamados.filter((item) => {
		const data = new Date(item.dataCriacao);
		const mesItem = Number.isNaN(data.getTime()) ? "" : `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
		return (!mes || mesItem === mes) && (!categoria || item.categoriaNome === categoria);
	}), [
		chamados,
		mes,
		categoria
	]);
	const salas = (0, import_react.useMemo)(() => agrupar(filtrados, (item) => item.salaNome), [filtrados]);
	const equipamentos = (0, import_react.useMemo)(() => agrupar(filtrados, (item) => item.equipamentoNome), [filtrados]);
	const abertos = filtrados.filter((item) => [
		"ABERTO",
		"EM_ANALISE",
		"EM_ANDAMENTO"
	].includes(item.status)).length;
	const resolvidos = filtrados.filter((item) => item.status === "CONCLUIDO").length;
	const comEquipamento = filtrados.filter((item) => Boolean(item.equipamentoNome)).length;
	const barras = (items) => items.length ? items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bar-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.nome }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: {
					"--w": `${Math.max(8, item.total / items[0].total * 100)}%`,
					background: cores[index % cores.length]
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.total })
		]
	}, item.nome)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "muted",
		children: "Sem dados para os filtros selecionados."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Relatórios" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Indicadores calculados a partir dos chamados da API."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "actions-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-outline",
						onClick: () => void carregar(),
						disabled: carregando,
						children: carregando ? "Atualizando..." : "Atualizar relatório"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-primary",
						onClick: () => window.print(),
						disabled: carregando || Boolean(erro),
						children: "Exportar PDF"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "filters card",
				"aria-label": "Filtros do relatório",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Mês", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "month",
					value: mes,
					onChange: (event) => setMes(event.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Categoria", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: categoria,
					onChange: (event) => setCategoria(event.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Todas as categorias"
					}), categorias.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item,
						children: item
					}, item))]
				})] })]
			}),
			erro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "alerta erro",
				children: erro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "cards-grid",
				children: [
					[filtrados.length, "Chamados no período"],
					[resolvidos, "Resolvidos"],
					[abertos, "Pendentes"],
					[comEquipamento, "Com equipamento"]
				].map(([numero, titulo]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card kpi reveal visible",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: carregando ? "—" : numero }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: titulo })] })
				}, String(titulo)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "charts",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Salas com mais chamados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bars",
						children: barras(salas)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card reveal visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Equipamentos com mais chamados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bars",
						children: barras(equipamentos)
					})]
				})]
			}),
			!carregando && !erro && filtrados.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted center",
				children: "Nenhum chamado encontrado para esse período e categoria."
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	active: "relatorios",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Relatorios, {})
});
export { SplitComponent as component };
