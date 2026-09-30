export type TipoPromocao =
  | 'SERVICO'
  | 'COMBO'

export interface Promocao {
  idPromocao: number
  idBarbearia: number
  titulo: string
  descricao: string | null
  percentualDesconto: number
  dataInicio: string
  dataFim: string
  tipo: TipoPromocao
  ativa: boolean
}

export interface PromocaoRequest {
  idBarbearia: number
  titulo: string
  descricao: string | null
  percentualDesconto: number
  dataInicio: string
  dataFim: string
  tipo: TipoPromocao
}
