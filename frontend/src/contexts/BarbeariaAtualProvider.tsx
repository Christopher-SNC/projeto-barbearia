import { useState, type ReactNode } from 'react'

import useAuth from '../hooks/useAuth'
import BarbeariaAtualContext from './BarbeariaAtualContext'
import {
  lerBarbeariaSelecionada,
  salvarBarbeariaSelecionada,
} from '../utils/barbeariaSelecionada'

interface Props {
  children: ReactNode
}

function BarbeariaAtualProvider({ children }: Props) {
  const { usuario } = useAuth()
  const ids = usuario?.idsBarbeariasProprietario ?? []

  const [idSelecionado, setIdSelecionado] = useState<number>(() => {
    const salvo = usuario ? lerBarbeariaSelecionada(usuario.idUsuario) : null
    return salvo !== null && ids.includes(salvo) ? salvo : (ids[0] ?? 0)
  })

  const idAtivo = ids.includes(idSelecionado) ? idSelecionado : ids[0]
  if (idAtivo === undefined) return null

  function selecionarBarbearia(id: number) {
    if (!ids.includes(id)) return
    setIdSelecionado(id)
    if (usuario) salvarBarbeariaSelecionada(usuario.idUsuario, id)
  }

  return (
    <BarbeariaAtualContext.Provider
      value={{ idBarbearia: idAtivo, selecionarBarbearia }}
    >
      {children}
    </BarbeariaAtualContext.Provider>
  )
}

export default BarbeariaAtualProvider
