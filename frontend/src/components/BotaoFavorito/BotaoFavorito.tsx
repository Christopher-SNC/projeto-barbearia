import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import {
  adicionarFavorito,
  removerFavorito,
} from '../../services/favoritoService'

import type { Favorito } from '../../services/favoritoService'

import useAuth from '../../hooks/useAuth'

import './BotaoFavorito.css'

interface Props {
  idBarbearia: number
  favorito?: Favorito
  onAlterado: (
    idBarbearia: number,
    favorito: Favorito | null,
  ) => void
}

function BotaoFavorito({
  idBarbearia,
  favorito,
  onAlterado,
}: Props) {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState('')

  async function alternar() {
    if (!usuario) {
      navigate('/login')
      return
    }

    if (!usuario.perfis?.includes('CLIENTE')) {
      setErro('Entre com um perfil de cliente para salvar favoritos.')
      return
    }

    if (processando) return

    setProcessando(true)
    setErro('')

    try {
      if (favorito) {
        await removerFavorito(favorito.idFavorito)
        onAlterado(idBarbearia, null)
      } else {
        const novo = await adicionarFavorito(idBarbearia)
        onAlterado(idBarbearia, novo)
      }
    } catch (error) {
      setErro(
        axios.isAxiosError<{ erro?: string }>(error)
          ? error.response?.data?.erro ??
              'Não foi possível atualizar o favorito.'
          : 'Não foi possível atualizar o favorito.',
      )
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="favorite-control">
      <button
        type="button"
        className={[
          'favorite-control__button',
          favorito ? 'favorite-control__button--active' : '',
        ].filter(Boolean).join(' ')}
        onClick={alternar}
        disabled={processando}
        aria-pressed={Boolean(favorito)}
        aria-label={
          favorito
            ? 'Remover barbearia dos favoritos'
            : 'Adicionar barbearia aos favoritos'
        }
      >
        {favorito ? '♥ Salvo' : '♡ Favoritar'}
      </button>

      {erro && (
        <p className="favorite-control__error" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}

export default BotaoFavorito