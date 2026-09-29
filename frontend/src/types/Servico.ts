export interface Servico {
  idServico: number
  idBarbearia: number
  nome: string
  descricao: string | null
  preco: number
  duracaoMinutos: number
  ativo: boolean
}

export interface ServicoRequest {
  idBarbearia: number
  nome: string
  descricao: string | null
  preco: number
  duracaoMinutos: number
}