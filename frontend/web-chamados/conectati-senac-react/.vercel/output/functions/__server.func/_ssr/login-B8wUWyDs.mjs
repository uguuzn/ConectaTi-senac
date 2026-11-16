import { i as __toESM } from "../_runtime.mjs";
import { t as authService } from "./conectati-3jMJYayc.mjs";
import { r as setSession } from "./session-nq0S3h9M.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/login-B8wUWyDs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const nav = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [senha, setSenha] = (0, import_react.useState)("");
	const [alerta, setAlerta] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const onSubmit = async (event) => {
		event.preventDefault();
		if (!email || !senha) {
			setAlerta({
				tipo: "erro",
				msg: "Informe e-mail e senha para continuar."
			});
			return;
		}
		setLoading(true);
		try {
			const session = await authService.login(email, senha);
			const { usuario } = session;
			setSession(session);
			setAlerta({
				tipo: "sucesso",
				msg: `Bem-vindo(a), ${usuario.nome}.`
			});
			nav({ to: usuario.tipo === "ADMINISTRADOR" ? "/admin" : "/chamados" });
		} catch (error) {
			setAlerta({
				tipo: "erro",
				msg: error instanceof Error ? error.message : "Não foi possível entrar."
			});
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "auth",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-orbs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb orb-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb orb-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb orb-3" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "auth-card reveal visible",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/logo-senac.png",
						alt: "Logo Senac",
						className: "logo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "brand-name",
						children: ["ConectaTI ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Senac" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Acesse sua conta" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: "Use as credenciais cadastradas na plataforma."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "form",
					onSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["E-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: "seu@senacdf.com.br"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Senha", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: senha,
							onChange: (event) => setSenha(event.target.value),
							placeholder: "••••••••"
						})] }),
						alerta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `alerta ${alerta.tipo}`,
							children: alerta.msg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: loading,
							type: "submit",
							className: "btn btn-primary btn-block",
							children: loading ? "Entrando..." : "Entrar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/home",
							className: "link center",
							children: "Voltar para o início"
						})
					]
				})
			]
		})]
	});
}
export { LoginPage as component };
