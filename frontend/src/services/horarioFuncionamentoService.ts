import api from './api'

import type {
  HorarioFuncionamento,
  HorarioFuncionamentoRequest,
} from '../types/HorarioFuncionamento'

export async function listarHorariosFuncionamento(): Promise<
  HorarioFuncionamento[]
> {
  const response = await api.get<HorarioFuncionamento[]>(
    '/api/horarios-funcionamento',
  )

  return response.data
}

export async function cadastrarHorarioFuncionamento(
  dados: HorarioFuncionamentoRequest,
): Promise<HorarioFuncionamento> {
  const response = await api.post<HorarioFuncionamento>(
    '/api/horarios-funcionamento',
    dados,
  )

  return response.data
}

export async function atualizarHorarioFuncionamento(
  idHorario: number,
  dados: HorarioFuncionamentoRequest,
): Promise<HorarioFuncionamento> {
  const response = await api.put<HorarioFuncionamento>(
    `/api/horarios-funcionamento/${idHorario}`,
    dados,
  )

  return response.data
}

export async function excluirHorarioFuncionamento(
  idHorario: number,
): Promise<void> {
  await api.delete(
    `/api/horarios-funcionamento/${idHorario}`,
  )
}