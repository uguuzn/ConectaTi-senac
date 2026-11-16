import type { Usuario } from "./conectati";

const KEY = "conectati_session";

export type Session = {
  usuario: Usuario;
  token: string;
  tipoToken: string;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null") as Session | Usuario | null;
    if (!value) return null;
    if ("usuario" in value) return value;
    return { usuario: value, token: "", tipoToken: "Bearer" };
  } catch {
    return null;
  }
}

export function getUsuario(): Usuario | null {
  return getSession()?.usuario || null;
}

export function getAuthHeader(): Record<string, string> {
  const session = getSession();
  return session?.token ? { Authorization: `${session.tipoToken || "Bearer"} ${session.token}` } : {};
}

export function setSession(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
