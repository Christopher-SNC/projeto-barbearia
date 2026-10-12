import { createContext } from 'react'

export interface BarbeariaAtualContextValue {
  idBarbearia: number
  selecionarBarbearia: (id: number) => void
}

const BarbeariaAtualContext = createContext<BarbeariaAtualContextValue | null>(null)

export default BarbeariaAtualContext
