import api from './api'

import type {
  Foto,
  FotoRequest,
} from '../types/Foto'

export async function listarFotos(): Promise<Foto[]> {
  const response = await api.get<Foto[]>(
    '/api/fotos',
  )

  return response.data
}

export async function buscarFotoPorId(
  id: number,
): Promise<Foto> {
  const response = await api.get<Foto>(
    `/api/fotos/${id}`,
  )

  return response.data
}

export async function cadastrarFoto(
  dados: FotoRequest,
): Promise<Foto> {
  const response = await api.post<Foto>(
    '/api/fotos',
    dados,
  )

  return response.data
}

export async function atualizarFoto(
  id: number,
  dados: FotoRequest,
): Promise<Foto> {
  const response = await api.put<Foto>(
    `/api/fotos/${id}`,
    dados,
  )

  return response.data
}

export async function ativarFoto(
  id: number,
): Promise<Foto> {
  const response = await api.patch<Foto>(
    `/api/fotos/${id}/ativar`,
  )

  return response.data
}

export async function desativarFoto(
  id: number,
): Promise<Foto> {
  const response = await api.patch<Foto>(
    `/api/fotos/${id}/desativar`,
  )

  return response.data
}

export async function excluirFoto(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/fotos/${id}`,
  )
}