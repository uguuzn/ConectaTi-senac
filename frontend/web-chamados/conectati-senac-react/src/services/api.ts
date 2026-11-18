import { getAuthHeader } from "./session";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!rawApiUrl) {
  throw new Error(
    "[api] Defina VITE_API_URL no ambiente usado para iniciar ou compilar o frontend.",
  );
}

const baseUrl = rawApiUrl.replace(/\/+$/, "");

if (!/^https?:\/\//i.test(baseUrl)) {
  throw new Error(
    "[api] VITE_API_URL precisa ser uma URL absoluta iniciada por http:// ou https://.",
  );
}

function apiUrl(path: string): string {
  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
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
