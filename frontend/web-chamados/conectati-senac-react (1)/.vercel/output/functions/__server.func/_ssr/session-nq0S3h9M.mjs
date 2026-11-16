// node_modules/.nitro/vite/services/ssr/assets/session-nq0S3h9M.js
var KEY = "conectati_session";
function getSession() {
	if (typeof window === "undefined") return null;
	try {
		const value = JSON.parse(localStorage.getItem(KEY) || "null");
		if (!value) return null;
		if ("usuario" in value) return value;
		return {
			usuario: value,
			token: "",
			tipoToken: "Bearer"
		};
	} catch {
		return null;
	}
}
function getUsuario() {
	return getSession()?.usuario || null;
}
function setSession(session) {
	localStorage.setItem(KEY, JSON.stringify(session));
}
function clearSession() {
	localStorage.removeItem(KEY);
}
export { getUsuario as n, setSession as r, clearSession as t };
