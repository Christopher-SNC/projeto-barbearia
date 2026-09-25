import api from './api'
import type { Usuario } from '../types/Usuario'

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>('/api/usuarios')

  return response.data
}