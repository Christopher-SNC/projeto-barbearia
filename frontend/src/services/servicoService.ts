import api from './api'

import type {
  Servico,
  ServicoRequest,
} from '../types/Servico'

export async function listarServicos(): Promise<
  Servico[]
> {
  const response = await api.get<Servico[]>(
    '/api/servicos',
  )

  return response.data
}

export async function buscarServicoPorId(
  id: number,
): Promise<Servico> {
  const response = await api.get<Servico>(
    `/api/servicos/${id}`,
  )

  return response.data
}

export async function cadastrarServico(
  dados: ServicoRequest,
): Promise<Servico> {
  const response = await api.post<Servico>(
    '/api/servicos',
    dados,
  )

  return response.data
}

export async function atualizarServico(
  id: number,
  dados: ServicoRequest,
): Promise<Servico> {
  const response = await api.put<Servico>(
    `/api/servicos/${id}`,
    dados,
  )

  return response.data
}

export async function ativarServico(
  id: number,
): Promise<Servico> {
  const response = await api.patch<Servico>(
    `/api/servicos/${id}/ativar`,
  )

  return response.data
}

export async function desativarServico(
  id: number,
): Promise<Servico> {
  const response = await api.patch<Servico>(
    `/api/servicos/${id}/desativar`,
  )

  return response.data
}