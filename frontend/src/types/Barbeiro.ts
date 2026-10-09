export interface Barbeiro {
  idBarbeiro: number
  idUsuario: number
  nomeUsuario: string
  idBarbearia: number
  descricao: string | null
  ativo: boolean
}

export interface BarbeiroRequest {
  idUsuario: number
  idBarbearia: number
  descricao: string | null
}
export interface BarbeiroCadastroRequest {
  nome: string
  email: string
  senha: string
  telefone: string | null
  idBarbearia: number
  descricao: string | null
}
