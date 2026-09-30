import api from './api'

import type {
  Disponibilidade,
  DisponibilidadeRequest,
} from '../types/Disponibilidade'

export async function listarDisponibilidades(): Promise<
  Disponibilidade[]
> {
  const response = await api.get<
    Disponibilidade[]
  >('/api/disponibilidades')

  return response.data
}

export async function cadastrarDisponibilidade(
  dados: DisponibilidadeRequest,
): Promise<Disponibilidade> {
  const response =
    await api.post<Disponibilidade>(
      '/api/disponibilidades',
      dados,
    )

  return response.data
}

export async function atualizarDisponibilidade(
  id: number,
  dados: DisponibilidadeRequest,
): Promise<Disponibilidade> {
  const response =
    await api.put<Disponibilidade>(
      `/api/disponibilidades/${id}`,
      dados,
    )

  return response.data
}

export async function ativarDisponibilidade(
  id: number,
): Promise<Disponibilidade> {
  const response =
    await api.patch<Disponibilidade>(
      `/api/disponibilidades/${id}/ativar`,
    )

  return response.data
}

export async function desativarDisponibilidade(
  id: number,
): Promise<Disponibilidade> {
  const response =
    await api.patch<Disponibilidade>(
      `/api/disponibilidades/${id}/desativar`,
    )

  return response.data
}