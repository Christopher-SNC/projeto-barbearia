export type PerfilUsuario =
  | 'CLIENTE'
  | 'BARBEIRO'
  | 'PROPRIETARIO'

export interface UsuarioAutenticado {
  idUsuario: number
  nome: string
  email: string
  perfis: PerfilUsuario[]
  idBarbeiro: number | null
  idBarbeariaBarbeiro: number | null
  idsBarbeariasProprietario: number[]
}

export interface LoginRequest {
  email: string
  senha: string
}