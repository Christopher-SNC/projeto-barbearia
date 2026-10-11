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
export interface AvaliacaoRequest {
  idAgendamento: number
  notaBarbearia: number
  notaBarbeiro: number | null
  comentario: string | null
}

export async function criarAvaliacao(
  dados: AvaliacaoRequest,
): Promise<Avaliacao> {
  const response = await api.post<Avaliacao>(
    '/api/avaliacoes',
    dados,
  )

  return response.data
}