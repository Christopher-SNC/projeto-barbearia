import api from './api'

import type {
  Endereco,
  EnderecoRequest,
} from '../types/Endereco'

export async function listarEnderecos(): Promise<
  Endereco[]
> {
  const response = await api.get<Endereco[]>(
    '/api/enderecos',
  )

  return response.data
}

export async function buscarEnderecoPorId(
  id: number,
): Promise<Endereco> {
  const response = await api.get<Endereco>(
    `/api/enderecos/${id}`,
  )

  return response.data
}

export async function cadastrarEndereco(
  dados: EnderecoRequest,
): Promise<Endereco> {
  const response = await api.post<Endereco>(
    '/api/enderecos',
    dados,
  )

  return response.data
}

export async function atualizarEndereco(
  id: number,
  dados: EnderecoRequest,
): Promise<Endereco> {
  const response = await api.put<Endereco>(
    `/api/enderecos/${id}`,
    dados,
  )

  return response.data
}