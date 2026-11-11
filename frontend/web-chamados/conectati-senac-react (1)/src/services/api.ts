import { getAuthHeader } from "./session";

// A URL da API deve vir EXCLUSIVAMENTE de VITE_API_URL (nunca hardcoded).
const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!rawApiUrl) {
  if (import.meta.env.DEV) {
    console.warn(
      "[api] VITE_API_URL não definida — usando http://localhost:8080 (apenas desenvolvimento).",
    );
  } else {
    // Falha explícita no build de produção: sem isso o app tentaria
    // http://localhost:8080 silenciosamente e todas as requisições falhariam.
    throw new Error("[api] VITE_API_URL não configurada no build de produção.");
  }
}

const baseUrl = (rawApiUrl || "http://localhost:8080").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeader(), ...init.headers },
  });
  if (response.status === 204) return undefined as T;
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(
      body?.message || "Não foi possível concluir a solicitação.",
      response.status,
    );
  }
  return response.json() as Promise<T>;
}
