import api from './api'

import type {
  Barbearia,
  BarbeariaRequest,
} from '../types/Barbearia'

export async function listarBarbearias(): Promise<
  Barbearia[]
> {
  const response = await api.get<Barbearia[]>(
    '/api/barbearias',
  )

  return response.data
}

export async function buscarBarbeariaPorId(
  id: number,
): Promise<Barbearia> {
  const response = await api.get<Barbearia>(
    `/api/barbearias/${id}`,
  )

  return response.data
}

export async function atualizarBarbearia(
  id: number,
  dados: BarbeariaRequest,
): Promise<Barbearia> {
  const response = await api.put<Barbearia>(
    `/api/barbearias/${id}`,
    dados,
  )

  return response.data
}
export async function ativarBarbearia(
  id: number,
): Promise<Barbearia> {
  const response = await api.patch<Barbearia>(
    `/api/barbearias/${id}/ativar`,
  )

  return response.data
}

export async function desativarBarbearia(
  id: number,
): Promise<Barbearia> {
  const response = await api.patch<Barbearia>(
    `/api/barbearias/${id}/desativar`,
  )

  return response.data
}