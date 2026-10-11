import api from './api'

export interface PrecoServico {
  precoOriginal: number
  percentualDesconto: number
  precoFinal: number
}

export async function buscarPrecoServico(
  idServico: number,
  data: string,
): Promise<PrecoServico> {
  const response = await api.get<PrecoServico>(
    `/api/servicos/${idServico}/preco`,
    { params: { data } },
  )

  return response.data
}