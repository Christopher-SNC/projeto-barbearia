export interface Barbearia {
  idBarbearia: number
  nome: string
  cnpj: string | null
  descricao: string | null
  telefone: string | null
  ativa: boolean
}

export interface BarbeariaRequest {
  nome: string
  cnpj: string | null
  descricao: string | null
  telefone: string | null
}