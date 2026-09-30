import api from './api'

import type {
  Barbeiro,
  BarbeiroRequest,
} from '../types/Barbeiro'

export async function listarBarbeiros(): Promise<
  Barbeiro[]
> {
  const response = await api.get<Barbeiro[]>(
    '/api/barbeiros',
  )

  return response.data
}

export async function cadastrarBarbeiro(
  dados: BarbeiroRequest,
): Promise<Barbeiro> {
  const response = await api.post<Barbeiro>(
    '/api/barbeiros',
    dados,
  )

  return response.data
}

export async function atualizarBarbeiro(
  id: number,
  dados: BarbeiroRequest,
): Promise<Barbeiro> {
  const response = await api.put<Barbeiro>(
    `/api/barbeiros/${id}`,
    dados,
  )

  return response.data
}

export async function ativarBarbeiro(
  id: number,
): Promise<Barbeiro> {
  const response = await api.patch<Barbeiro>(
    `/api/barbeiros/${id}/ativar`,
  )

  return response.data
}

export async function desativarBarbeiro(
  id: number,
): Promise<Barbeiro> {
  const response = await api.patch<Barbeiro>(
    `/api/barbeiros/${id}/desativar`,
  )

  return response.data
}