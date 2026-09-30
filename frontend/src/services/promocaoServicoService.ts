import api from './api'

import type {
  PromocaoServico,
  PromocaoServicoRequest,
} from '../types/PromocaoServico'

export async function listarPromocoesServicos(): Promise<
  PromocaoServico[]
> {
  const response = await api.get<
    PromocaoServico[]
  >('/api/promocoes-servicos')

  return response.data
}

export async function listarServicosPorPromocao(
  idPromocao: number,
): Promise<PromocaoServico[]> {
  const response = await api.get<
    PromocaoServico[]
  >(
    `/api/promocoes-servicos/promocao/${idPromocao}`,
  )

  return response.data
}

export async function buscarPromocaoServicoPorId(
  id: number,
): Promise<PromocaoServico> {
  const response = await api.get<
    PromocaoServico
  >(
    `/api/promocoes-servicos/${id}`,
  )

  return response.data
}

export async function cadastrarPromocaoServico(
  dados: PromocaoServicoRequest,
): Promise<PromocaoServico> {
  const response =
    await api.post<PromocaoServico>(
      '/api/promocoes-servicos',
      dados,
    )

  return response.data
}

export async function excluirPromocaoServico(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/promocoes-servicos/${id}`,
  )
}