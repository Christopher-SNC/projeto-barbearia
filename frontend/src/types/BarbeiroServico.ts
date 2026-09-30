export interface BarbeiroServico {
  idBarbeiroServico: number
  idBarbeiro: number
  idServico: number
  ativo: boolean
}

export interface BarbeiroServicoRequest {
  idBarbeiro: number
  idServico: number
}