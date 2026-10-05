import api from './api'

import type {
  LoginRequest,
  UsuarioAutenticado,
} from '../types/Auth'

export async function buscarSessao(): Promise<UsuarioAutenticado> {
  const response = await api.get<UsuarioAutenticado>(
    '/api/auth/me',
  )

  return response.data
}

export async function fazerLogin(
  dados: LoginRequest,
): Promise<UsuarioAutenticado> {
  await api.post('/api/auth/login', dados)

  return buscarSessao()
}

export async function fazerLogout(): Promise<void> {
  await api.post('/api/auth/logout')
}