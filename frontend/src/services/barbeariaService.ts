import api from './api'
import type { Barbearia } from '../types/Barbearia'

export async function listarBarbearias(): Promise<Barbearia[]> {
  const response = await api.get<Barbearia[]>('/api/barbearias')

  return response.data
}

export async function buscarBarbeariaPorId(
  id: number,
): Promise<Barbearia> {
  const response = await api.get<Barbearia>(`/api/barbearias/${id}`)

  return response.data
}