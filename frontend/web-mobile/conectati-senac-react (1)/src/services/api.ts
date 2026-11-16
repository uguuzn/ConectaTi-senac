import { getAuthHeader } from "./session";

const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeader(), ...init.headers },
  });
  if (response.status === 204) return undefined as T;
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new ApiError(body?.message || "Não foi possível concluir a solicitação.", response.status);
  }
  return response.json() as Promise<T>;
}
