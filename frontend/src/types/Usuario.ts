export interface Usuario {
  idUsuario: number
  nome: string
  email: string
  telefone: string | null
  ativo: boolean
}

export interface UsuarioRequest {
  nome: string
  email: string
  senha: string
  telefone: string | null
}

export interface UsuarioUpdateRequest {
  nome: string
  email: string
  telefone: string | null
}

export interface AlterarSenhaRequest {
  senhaAtual: string
  novaSenha: string
  confirmarNovaSenha: string
}