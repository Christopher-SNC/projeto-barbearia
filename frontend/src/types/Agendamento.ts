export type StatusAgendamento =
  | 'CONFIRMADO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'NAO_COMPARECEU'

export interface ItemAgendamentoRequest {
  idServico: number
}

export interface AgendamentoRequest {
  idBarbearia: number
  idBarbeiro: number
  dataHoraInicio: string
  itens: ItemAgendamentoRequest[]
}

export interface ItemAgendamento {
  idItemAgendamento: number
  idServico: number
  nomeServico: string
  precoOriginal: number
  percentualDesconto: number
  precoFinal: number
  duracaoMinutos: number
}

export interface Agendamento {
  idAgendamento: number
  idCliente: number
  nomeCliente: string
  idBarbearia: number
  idBarbeiro: number
  nomeBarbeiro: string
  dataHoraInicio: string
  status: StatusAgendamento
  valorTotal: number
  dataCriacao: string
  itens: ItemAgendamento[]
}

export interface OcupacaoAgendamento {
  dataHoraInicio: string
  duracaoMinutos: number
}
