import api from './api'

import type {
  Usuario,
  UsuarioUpdateRequest,
} from '../types/Usuario'

export async function buscarUsuarioBarbeiro(
  idBarbeiro: number,
): Promise<Usuario> {
  const response = await api.get<Usuario>(
    `/api/usuarios/barbeiros/${idBarbeiro}`,
  )

  return response.data
}

export async function atualizarUsuarioBarbeiro(
  idBarbeiro: number,
  dados: UsuarioUpdateRequest,
): Promise<Usuario> {
  const response = await api.put<Usuario>(
    `/api/usuarios/barbeiros/${idBarbeiro}`,
    dados,
  )

  return response.data
}
