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