import api from './api'
import type { Avaliacao } from '../types/Avaliacao'

export async function listarAvaliacoes(): Promise<
  Avaliacao[]
> {
  const response = await api.get<Avaliacao[]>(
    '/api/avaliacoes',
  )

  return response.data
}