export type StatusAgendamento =
  | 'CONFIRMADO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'NAO_COMPARECEU'

export interface ItemAgendamentoRequest {
  idServico: number
}

export interface AgendamentoRequest {
  idCliente: number
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
  idBarbearia: number
  idBarbeiro: number
  dataHoraInicio: string
  status: StatusAgendamento
  valorTotal: number
  dataCriacao: string
  itens: ItemAgendamento[]
}
