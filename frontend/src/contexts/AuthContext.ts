import { createContext } from 'react'

import type {
  PerfilUsuario,
  UsuarioAutenticado,
} from '../types/Auth'

export interface AuthContextValue {
  usuario: UsuarioAutenticado | null
  carregando: boolean
  entrar: (
    email: string,
    senha: string,
  ) => Promise<UsuarioAutenticado>
  sair: () => Promise<void>
  possuiPerfil: (perfil: PerfilUsuario) => boolean
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined)

export default AuthContext