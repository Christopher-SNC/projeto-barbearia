import api from './api'
import type { Disponibilidade } from '../types/Disponibilidade'

export async function listarDisponibilidades(): Promise<
  Disponibilidade[]
> {
  const response = await api.get<Disponibilidade[]>(
    '/api/disponibilidades',
  )

  return response.data
}