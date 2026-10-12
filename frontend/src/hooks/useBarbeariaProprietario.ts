import useBarbeariaAtual from './useBarbeariaAtual'

function useBarbeariaProprietario(): number {
  return useBarbeariaAtual().idBarbearia
}

export default useBarbeariaProprietario
