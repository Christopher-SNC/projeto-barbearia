import api from './api'

export interface Favorito {
  idFavorito: number
  idBarbearia: number
  dataAdicao: string
}

export async function listarFavoritos(): Promise<Favorito[]> {
  const resposta = await api.get<Favorito[]>('/api/favoritos')
  return resposta.data
}

export async function adicionarFavorito(
  idBarbearia: number,
): Promise<Favorito> {
  const resposta = await api.post<Favorito>(
    '/api/favoritos',
    { idBarbearia },
  )
  return resposta.data
}

export async function removerFavorito(
  idFavorito: number,
): Promise<void> {
  await api.delete(`/api/favoritos/${idFavorito}`)
}