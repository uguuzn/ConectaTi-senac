export interface Categoria {
  id: number;
  nome: string;
  valorDiaria: number;
}

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  ano: number;
  categoria: Categoria;
  status: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  telefone: string;
  email: string;
}

export interface Seguro {
  id: number;
  nome: string;
  valorDiaria: number;
}

export interface Locacao {
  id: number;
  veiculo: Veiculo;
  cliente: Cliente;
  seguro: Seguro | null;
  dataInicio: string;
  dataFimPrevista: string;
  dataFimReal: string | null;
  status: string;
  valorTotal: number;
}

export interface Multa {
  id: number;
  locacao: Locacao;
  motivo: string;
  valor: number;
}

export interface Manutencao {
  id: number;
  veiculo: Veiculo;
  descricao: string;
  dataInicio: string;
  dataFim: string | null;
  custo: number;
}
