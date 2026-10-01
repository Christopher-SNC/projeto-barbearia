import api from './api'

import type {
  AlterarSenhaRequest,
  Usuario,
  UsuarioRequest,
  UsuarioUpdateRequest,
} from '../types/Usuario'

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>(
    '/api/usuarios',
  )

  return response.data
}

export async function buscarUsuarioPorId(
  id: number,
): Promise<Usuario> {
  const response = await api.get<Usuario>(
    `/api/usuarios/${id}`,
  )

  return response.data
}

export async function cadastrarUsuario(
  dados: UsuarioRequest,
): Promise<Usuario> {
  const response = await api.post<Usuario>(
    '/api/usuarios',
    dados,
  )

  return response.data
}

export async function atualizarUsuario(
  id: number,
  dados: UsuarioUpdateRequest,
): Promise<Usuario> {
  const response = await api.put<Usuario>(
    `/api/usuarios/${id}`,
    dados,
  )

  return response.data
}

export async function alterarSenhaUsuario(
  id: number,
  dados: AlterarSenhaRequest,
): Promise<void> {
  await api.patch(
    `/api/usuarios/${id}/senha`,
    dados,
  )
}