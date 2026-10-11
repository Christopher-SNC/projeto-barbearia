import api from './api'

export interface ResumoAvaliacaoBarbearia {
  idBarbearia: number
  media: number
  quantidade: number
}

export async function listarResumoAvaliacoes(): Promise<
  ResumoAvaliacaoBarbearia[]
> {
  const response = await api.get<
    ResumoAvaliacaoBarbearia[]
  >('/api/barbearias/avaliacoes-resumo')

  return response.data
}