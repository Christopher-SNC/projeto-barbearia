import api from './api'

import type {
  LoginRequest,
  UsuarioAutenticado,
} from '../types/Auth'

export async function prepararCsrf(): Promise<void> {
  await api.get('/api/auth/csrf')
}

export async function buscarSessao(): Promise<UsuarioAutenticado> {
  const response =
    await api.get<UsuarioAutenticado>(
      '/api/auth/me',
    )

  return response.data
}

export async function fazerLogin(
  dados: LoginRequest,
): Promise<UsuarioAutenticado> {
  await api.post(
    '/api/auth/login',
    dados,
  )

  // O token utilizado antes do login é invalidado
  // após a autenticação. Obtemos um novo.
  await prepararCsrf()

  return buscarSessao()
}

export async function fazerLogout(): Promise<void> {
  await api.post(
    '/api/auth/logout',
  )

  // O logout invalida o token anterior.
  // Preparamos outro para um futuro login.
  await prepararCsrf()
}