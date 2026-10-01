export interface Foto {
  idFoto: number
  idBarbearia: number
  url: string
  legenda: string | null
  ordem: number
  ativa: boolean
}

export interface FotoRequest {
  idBarbearia: number
  url: string
  legenda: string | null
  ordem: number
}