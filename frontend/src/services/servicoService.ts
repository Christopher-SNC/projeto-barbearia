import api from './api'
import type { Servico } from '../types/Servico'

export async function listarServicos(): Promise<Servico[]> {
  const response = await api.get<Servico[]>('/api/servicos')

  return response.data
}