import api from './api'

import type {
  BarbeiroServico,
  BarbeiroServicoRequest,
} from '../types/BarbeiroServico'

export async function listarBarbeirosServicos(): Promise<
  BarbeiroServico[]
> {
  const response = await api.get<
    BarbeiroServico[]
  >('/api/barbeiros-servicos')

  return response.data
}

export async function cadastrarBarbeiroServico(
  dados: BarbeiroServicoRequest,
): Promise<BarbeiroServico> {
  const response =
    await api.post<BarbeiroServico>(
      '/api/barbeiros-servicos',
      dados,
    )

  return response.data
}

export async function ativarBarbeiroServico(
  id: number,
): Promise<BarbeiroServico> {
  const response =
    await api.patch<BarbeiroServico>(
      `/api/barbeiros-servicos/${id}/ativar`,
    )

  return response.data
}

export async function desativarBarbeiroServico(
  id: number,
): Promise<BarbeiroServico> {
  const response =
    await api.patch<BarbeiroServico>(
      `/api/barbeiros-servicos/${id}/desativar`,
    )

  return response.data
}