import api from './api'

import type {
  Agendamento,
  AgendamentoRequest,
  OcupacaoAgendamento,
} from '../types/Agendamento'

export async function listarAgendamentos(): Promise<Agendamento[]> {
  const response = await api.get<Agendamento[]>(
    '/api/agendamentos',
  )

  return response.data
}

export async function listarOcupacoesAgendamento(
  idBarbeiro: number,
  data: string,
): Promise<OcupacaoAgendamento[]> {
  const response = await api.get<OcupacaoAgendamento[]>(
    '/api/agendamentos/ocupacoes',
    {
      params: {
        idBarbeiro,
        data,
      },
    },
  )

  return response.data
}


export async function criarAgendamento(
  dados: AgendamentoRequest,
): Promise<Agendamento> {
  const response = await api.post<Agendamento>(
    '/api/agendamentos',
    dados,
  )

  return response.data
}