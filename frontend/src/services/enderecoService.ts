import api from './api'
import type { Endereco } from '../types/Endereco'

export async function listarEnderecos(): Promise<Endereco[]> {
  const response = await api.get<Endereco[]>('/api/enderecos')

  return response.data
}