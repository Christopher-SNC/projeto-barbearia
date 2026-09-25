import api from './api'
import type { Barbeiro } from '../types/Barbeiro'

export async function listarBarbeiros(): Promise<Barbeiro[]> {
  const response = await api.get<Barbeiro[]>('/api/barbeiros')

  return response.data
}