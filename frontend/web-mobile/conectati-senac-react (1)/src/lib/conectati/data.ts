export type Chamado = {
  n: string; solicitante: string; perfil: string; categoria: string;
  sala: string; prioridade: string; status: string; data: string;
};
export type Equipamento = { nome: string; tipo: string; patr: string; status: string; loc: string };
export type Turma = { id: string; curso: string; turma: string; horario: string; dias: string; alunos: number };
export type Sala = { nome: string; tipo: string; chave: null | { responsavelId: string; responsavelNome: string; perfil: string; motivo: string; desde: string } };
export type Usuario = { id: string; nome: string; email: string; perfil: string; unidade: string };
export type Unidade = { id: string; nome: string; cidade: string; salas: number };
export type Solicitacao = {
  id: string; n: string; instrutorEmail: string; instrutorNome: string; turma: string;
  salaPreferida: string; data: string; hora: string; obs: string;
  status: "Pendente" | "Atribuída" | "Negada"; salaAtribuida: string | null;
};

export const CHAMADOS: Chamado[] = [
  { n: "001", solicitante: "Rayssa Paiva", perfil: "Instrutor", categoria: "Notebook", sala: "Lab 02", prioridade: "Alta", status: "Em atendimento", data: "03/07/2026" },
  { n: "002", solicitante: "Carla Mendes", perfil: "Coordenação", categoria: "Projetor", sala: "Sala 12", prioridade: "Média", status: "Aberto", data: "03/07/2026" },
  { n: "003", solicitante: "João Suporte", perfil: "Suporte TI", categoria: "Internet/Rede", sala: "Lab 01", prioridade: "Urgente", status: "Resolvido", data: "02/07/2026" },
  { n: "004", solicitante: "Ana Souza", perfil: "Instrutor", categoria: "Impressora", sala: "Secretaria", prioridade: "Baixa", status: "Aguardando", data: "02/07/2026" },
  { n: "005", solicitante: "Paulo Lima", perfil: "Instrutor", categoria: "Software", sala: "Lab 03", prioridade: "Média", status: "Em atendimento", data: "01/07/2026" },
  { n: "006", solicitante: "Fernanda Reis", perfil: "Coordenação", categoria: "Notebook", sala: "Sala 08", prioridade: "Alta", status: "Atrasado", data: "30/06/2026" },
  { n: "007", solicitante: "Ricardo Alves", perfil: "Instrutor", categoria: "Internet/Rede", sala: "Lab 02", prioridade: "Urgente", status: "Aberto", data: "03/07/2026" },
  { n: "008", solicitante: "Mariana Costa", perfil: "Instrutor", categoria: "Projetor", sala: "Sala 15", prioridade: "Média", status: "Resolvido", data: "29/06/2026" },
];

export const EQUIPAMENTOS: Equipamento[] = [
  { nome: "Notebook Dell 01", tipo: "Notebook", patr: "2024001", status: "Disponível", loc: "Sala TI" },
  { nome: "Notebook Dell 02", tipo: "Notebook", patr: "2024002", status: "Reservado", loc: "Lab 02" },
  { nome: "Notebook Lenovo 03", tipo: "Notebook", patr: "2024003", status: "Em uso", loc: "Lab 01" },
  { nome: "Projetor Epson 01", tipo: "Projetor", patr: "2024010", status: "Em manutenção", loc: "Sala TI" },
  { nome: "Projetor BenQ 02", tipo: "Projetor", patr: "2024011", status: "Disponível", loc: "Sala TI" },
  { nome: "Cabo HDMI 01", tipo: "Cabo", patr: "2024020", status: "Disponível", loc: "Sala TI" },
  { nome: "Cabo HDMI 02", tipo: "Cabo", patr: "2024021", status: "Em uso", loc: "Lab 02" },
  { nome: "Impressora HP 01", tipo: "Impressora", patr: "2024030", status: "Em uso", loc: "Secretaria" },
  { nome: "Mouse Logitech 01", tipo: "Mouse", patr: "2024040", status: "Disponível", loc: "Sala TI" },
  { nome: "Teclado Multilaser 01", tipo: "Teclado", patr: "2024050", status: "Danificado", loc: "Sala TI" },
  { nome: "Roteador TP-Link 01", tipo: "Rede", patr: "2024060", status: "Em uso", loc: "Sala TI" },
  { nome: "Carregador Dell 02", tipo: "Carregador", patr: "2024070", status: "Disponível", loc: "Sala TI" },
];

export const TURMAS_DEFAULT: Turma[] = [
  { id: "t1", curso: "Técnico em Desenvolvimento de Sistemas", turma: "TDS Manhã", horario: "08:00 - 12:00", dias: "Seg / Qua / Sex", alunos: 28 },
  { id: "t2", curso: "Informática Básica", turma: "INF-B Noite", horario: "19:00 - 22:00", dias: "Ter / Qui", alunos: 22 },
  { id: "t3", curso: "Design Gráfico", turma: "DG Tarde", horario: "14:00 - 17:00", dias: "Seg à Sex", alunos: 18 },
];

export const SALAS_BASE: Sala[] = [
  { nome: "Sala 01", tipo: "Sala", chave: null }, { nome: "Sala 02", tipo: "Sala", chave: null },
  { nome: "Sala 03", tipo: "Sala", chave: null }, { nome: "Sala 04", tipo: "Sala", chave: null },
  { nome: "Sala 05", tipo: "Sala", chave: null }, { nome: "Sala 08", tipo: "Sala", chave: null },
  { nome: "Sala 12", tipo: "Sala", chave: null }, { nome: "Sala 15", tipo: "Sala", chave: null },
  { nome: "Lab 01", tipo: "Laboratório", chave: null },
  { nome: "Lab 02", tipo: "Laboratório", chave: null },
  { nome: "Lab 03", tipo: "Laboratório", chave: null },
  { nome: "Auditório", tipo: "Auditório", chave: null },
];

export const USUARIOS_BASE: Usuario[] = [
  { id: "u1", nome: "Rayssa Paiva", email: "rayssa@senacdf.com.br", perfil: "Instrutor", unidade: "Senac Taguatinga Sul - Taguatinga/DF" },
  { id: "u2", nome: "Carla Mendes", email: "carla@senacdf.com.br", perfil: "Coordenação", unidade: "Senac Taguatinga Sul - Taguatinga/DF" },
  { id: "u3", nome: "Paulo Lima", email: "paulo@senacdf.com.br", perfil: "Instrutor", unidade: "Senac Taguatinga Sul - Taguatinga/DF" },
  { id: "u4", nome: "Ana Coordenação", email: "ana.coord@senacdf.com.br", perfil: "Coordenação", unidade: "Senac Taguatinga Sul - Taguatinga/DF" },
  { id: "u5", nome: "João Suporte", email: "joao.ti@senacdf.com.br", perfil: "Suporte TI", unidade: "Senac Taguatinga Sul - Taguatinga/DF" },
  { id: "u6", nome: "Mariana Admin", email: "admin@senacdf.com.br", perfil: "Administrador", unidade: "Senac Taguatinga Sul - Taguatinga/DF" },
];

export const UNIDADES_BASE: Unidade[] = [
  { id: "un1", nome: "Senac Taguatinga Sul", cidade: "Taguatinga/DF", salas: 12 },
  { id: "un2", nome: "Senac Plano Piloto", cidade: "Brasília/DF", salas: 20 },
  { id: "un3", nome: "Senac Ceilândia", cidade: "Ceilândia/DF", salas: 14 },
];

export const UNIDADES_SELECT = [
  "Senac Taguatinga Sul - Taguatinga/DF", "Senac Taguatinga Norte - Taguatinga/DF",
  "Senac Plano Piloto - Brasília/DF", "Senac Ceilândia - Ceilândia/DF",
  "Senac Gama - Gama/DF", "Senac Sobradinho - Sobradinho/DF",
  "Senac Planaltina - Planaltina/DF", "Senac Guará - Guará/DF",
  "Senac Samambaia - Samambaia/DF", "Senac São Sebastião - São Sebastião/DF",
  "Senac Recanto das Emas - Recanto das Emas/DF", "Senac 903 Sul - Brasília/DF",
];
