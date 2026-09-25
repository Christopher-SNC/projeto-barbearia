import api from './api'
import type { HorarioFuncionamento } from '../types/HorarioFuncionamento'

export async function listarHorariosFuncionamento(): Promise<
  HorarioFuncionamento[]
> {
  const response = await api.get<HorarioFuncionamento[]>(
    '/api/horarios-funcionamento',
  )

  return response.data
}