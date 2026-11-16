import { api } from "./api";

export type TipoUsuario = "ADMINISTRADOR" | "INSTRUTOR" | "TECNICO" | "COORDENADOR";
export type StatusChamado = "ABERTO" | "EM_ANALISE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";
export type Usuario = { id: number; nome: string; email: string; telefone?: string; tipo: TipoUsuario; ativo: boolean };
export type Categoria = { id: number; nome: string; descricao?: string };
export type Sala = { id: number; nome: string; capacidade?: number; laboratorioId: number; laboratorioNome?: string };
export type Equipamento = { id: number; nome: string; patrimonio: string; tipo?: string; fabricante?: string; modelo?: string; status: string; salaId: number; salaNome?: string; categoriaId: number; categoriaNome?: string };
export type Chamado = { id: number; titulo: string; descricao: string; prioridade: string; status: StatusChamado; solicitanteId: number; solicitanteNome?: string; tecnicoResponsavelId?: number; tecnicoResponsavelNome?: string; categoriaId: number; categoriaNome?: string; equipamentoId?: number; equipamentoNome?: string; salaId?: number; salaNome?: string; dataCriacao: string; dataFechamento?: string; solucao?: string };
export type LoginResponse = { usuario: Usuario; token: string; tipoToken: string };

export const authService = { login: (email: string, senha: string) => api<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) }) };
export const usuariosService = { listar: () => api<Usuario[]>("/usuarios"), criar: (body: Omit<Usuario, "id"> & { senha: string }) => api<Usuario>("/usuarios", { method: "POST", body: JSON.stringify(body) }), atualizar: (id: number, body: Partial<Usuario> & { senha?: string }) => api<Usuario>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(body) }), remover: (id: number) => api<void>(`/usuarios/${id}`, { method: "DELETE" }) };
export const chamadosService = {
  listar: () => api<Chamado[]>("/chamados"),
  criar: (body: { titulo: string; descricao: string; prioridade: string; categoriaId: number; equipamentoId?: number; salaId?: number }) => api<Chamado>("/chamados", { method: "POST", body: JSON.stringify(body) }),
  assumir: (id: number) => api<Chamado>(`/chamados/${id}/assumir`, { method: "PATCH" }),
  alterarStatus: (id: number, body: { status: StatusChamado; solucao?: string; justificativaCancelamento?: string }) => api<Chamado>(`/chamados/${id}/status`, { method: "PATCH", body: JSON.stringify(body) }),
};
export const equipamentosService = { listar: () => api<Equipamento[]>("/equipamentos") };
export const categoriasService = { listar: () => api<Categoria[]>("/categorias") };
export const salasService = { listar: () => api<Sala[]>("/salas") };
