import { useContext } from 'react'

import BarbeariaAtualContext from '../contexts/BarbeariaAtualContext'

function useBarbeariaAtual() {
  const contexto = useContext(BarbeariaAtualContext)
  if (!contexto) {
    throw new Error('Selecao de barbearia fora do painel administrativo.')
  }
  return contexto
}

export default useBarbeariaAtual
