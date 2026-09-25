import api from './api'
import type { BarbeiroServico } from '../types/BarbeiroServico'

export async function listarBarbeirosServicos(): Promise<
  BarbeiroServico[]
> {
  const response = await api.get<BarbeiroServico[]>(
    '/api/barbeiros-servicos',
  )

  return response.data
}