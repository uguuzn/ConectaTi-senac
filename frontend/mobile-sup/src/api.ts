/**
 * Camada de acesso à API do ConectaTI Senac (Next.js).
 *
 * ⚠️ ANTES DE GERAR O BUILD PARA TESTFLIGHT:
 * troque API_URL pelo endereço PÚBLICO do backend (com HTTPS),
 * porque "localhost" não funciona no iPhone dos testadores.
 * Ex.: "https://conectati.senac.exemplo.com.br"
 */
export const API_URL = "http://localhost:3000";

export const UNIDADES = [
  "Taguatinga",
  "Asa Norte",
  "Asa Sul",
  "Ceilândia",
  "Gama",
  "Guará",
  "Planaltina",
  "Recanto das Emas",
  "Santa Maria",
  "São Sebastião",
  "Sobradinho",
] as const;

export const TIPOS = [
  "Notebook",
  "Projetor",
  "Internet",
  "Impressora",
  "Computador",
  "Software",
  "Outro",
] as const;

export const LOCAIS = [
  "Lab 01",
  "Lab 02",
  "Lab 03",
  "Sala 05",
  "Sala 12",
  "Sala 20",
  "Biblioteca",
  "Coordenação",
  "Secretaria",
] as const;

export const PRIORIDADES = ["Baixa", "Média", "Alta"] as const;

export interface Chamado {
  id: string;
  numero: number;
  tipo: string;
  local: string;
  descricao: string;
  prioridade: string;
  status: string;
  solicitante: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvaliacaoResposta {
  avaliacoes: {
    id: string;
    nota: number;
    comentario: string;
    unidade: string;
    nome: string;
    createdAt: string;
  }[];
  total: number;
  media: number;
}

async function requisicao<T>(caminho: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const corpo = await resposta.json();
  if (!resposta.ok) {
    throw new Error((corpo as { erro?: string }).erro ?? "Falha na requisição");
  }
  return corpo as T;
}

export function listarChamados(): Promise<{ chamados: Chamado[] }> {
  return requisicao("/api/chamados", { cache: "no-store" } as RequestInit);
}

export function criarChamado(dados: {
  tipo: string;
  local: string;
  descricao: string;
  prioridade: string;
  solicitante: string;
}): Promise<{ chamado: Chamado }> {
  return requisicao("/api/chamados", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarChamado(
  id: string,
  dados: Partial<Pick<Chamado, "status" | "prioridade">>,
): Promise<unknown> {
  return requisicao(`/api/chamados/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export function enviarAvaliacao(dados: {
  nota: number;
  comentario: string;
  unidade: string;
  nome?: string;
}): Promise<unknown> {
  return requisicao("/api/avaliacoes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function listarAvaliacoes(): Promise<AvaliacaoResposta> {
  return requisicao("/api/avaliacoes");
}
