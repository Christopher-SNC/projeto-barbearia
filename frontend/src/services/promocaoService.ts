import api from './api'

import type {
  Promocao,
  PromocaoRequest,
} from '../types/Promocao'

export async function listarPromocoes(): Promise<
  Promocao[]
> {
  const response = await api.get<Promocao[]>(
    '/api/promocoes',
  )

  return response.data
}

export async function buscarPromocaoPorId(
  id: number,
): Promise<Promocao> {
  const response = await api.get<Promocao>(
    `/api/promocoes/${id}`,
  )

  return response.data
}

export async function cadastrarPromocao(
  dados: PromocaoRequest,
): Promise<Promocao> {
  const response = await api.post<Promocao>(
    '/api/promocoes',
    dados,
  )

  return response.data
}

export async function atualizarPromocao(
  id: number,
  dados: PromocaoRequest,
): Promise<Promocao> {
  const response = await api.put<Promocao>(
    `/api/promocoes/${id}`,
    dados,
  )

  return response.data
}

export async function ativarPromocao(
  id: number,
): Promise<Promocao> {
  const response = await api.patch<Promocao>(
    `/api/promocoes/${id}/ativar`,
  )

  return response.data
}

export async function desativarPromocao(
  id: number,
): Promise<Promocao> {
  const response = await api.patch<Promocao>(
    `/api/promocoes/${id}/desativar`,
  )

  return response.data
}

export async function excluirPromocao(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/promocoes/${id}`,
  )
}