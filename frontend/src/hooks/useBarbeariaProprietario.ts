import useAuth from './useAuth'

function useBarbeariaProprietario(): number {
  const { usuario } = useAuth()

  const idBarbearia =
    usuario?.idsBarbeariasProprietario[0]

  if (idBarbearia === undefined) {
    throw new Error(
      'O proprietário autenticado não possui uma barbearia ativa.',
    )
  }

  return idBarbearia
}

export default useBarbeariaProprietario