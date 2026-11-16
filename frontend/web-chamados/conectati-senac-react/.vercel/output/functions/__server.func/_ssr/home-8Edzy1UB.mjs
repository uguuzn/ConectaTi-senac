import { i as __toESM } from "../_runtime.mjs";
import { n as dataHojeBR } from "./store-pwHPOLYi.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/home-8Edzy1UB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Counter({ to }) {
	const [n, setN] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t0 = performance.now();
		const dur = 1400;
		let raf = 0;
		const step = (now) => {
			const p = Math.min((now - t0) / dur, 1);
			const e = 1 - Math.pow(1 - p, 3);
			setN(Math.round(to * e));
			if (p < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [to]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: n });
}
function Home() {
	const [hoje, setHoje] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => setHoje(dataHojeBR()), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "landing",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-orbs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb orb-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb orb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb orb-3" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "landing-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/logo-senac.png",
						alt: "Logo Senac",
						className: "logo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "brand-name",
						children: ["ConectaTI ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Senac" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "landing-nav",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "btn btn-ghost",
						children: "Entrar"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-content reveal visible",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge",
							children: "Senac Taguatinga · Plataforma Interna"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "hero-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gradient-text",
								children: "Conecta"
							}), "TI Senac"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hero-subtitle",
							children: "Sistema de Chamados, Suporte Técnico e Gestão de Equipamentos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hero-desc",
							children: "Conectando instrutores, suporte técnico, coordenação e administração em uma única plataforma inteligente."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "btn btn-primary",
								children: "Acessar sistema"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "btn btn-outline",
								children: "Ver dashboard"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-stats",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "stat",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, { to: 24 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chamados abertos" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "stat",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, { to: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notebooks disponíveis" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "stat",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, { to: 96 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "% satisfação" })]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-visual reveal visible",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "floating-card card-a",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dot dot-green" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "#003 · Resolvido" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Internet · Lab 01" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "floating-card card-b",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dot dot-yellow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "#001 · Em atendimento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Notebook · Lab 02" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "floating-card card-c",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dot dot-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "#002 · Aberto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Projetor · Sala 12" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-glow" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "features",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feature reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Chamados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Abra e acompanhe solicitações de suporte técnico com histórico completo." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feature reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Equipamentos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reserve notebooks e controle o patrimônio de TI em tempo real." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feature reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Indicadores" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Dashboards visuais para coordenação e administração acompanharem tudo." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feature reveal visible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Perfis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Instrutor, Suporte TI, Coordenação e Administrador — permissões dedicadas." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "landing-footer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 ConectaTI Senac · Unidade Taguatinga" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hoje })]
			})
		]
	});
}
export { Home as component };
