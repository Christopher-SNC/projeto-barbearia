import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import BarbeariaCard from '../../components/BarbeariaCard/BarbeariaCard'
import BotaoFavorito from '../../components/BotaoFavorito/BotaoFavorito'
import useAuth from '../../hooks/useAuth'

import { listarBarbearias } from '../../services/barbeariaService'
import { listarEnderecos } from '../../services/enderecoService'
import { listarFavoritos } from '../../services/favoritoService'
import { listarFotosPublicas } from '../../services/fotoService'

import type { Barbearia } from '../../types/Barbearia'
import type { Endereco } from '../../types/Endereco'
import type { Foto } from '../../types/Foto'
import type { Favorito } from '../../services/favoritoService'

import './MeusFavoritos.css'

function MeusFavoritos() {
  const { usuario } = useAuth()
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [barbearias, setBarbearias] = useState<Barbearia[]>([])
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [fotos, setFotos] = useState<Foto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const [dadosFavoritos, dadosBarbearias, dadosEnderecos, dadosFotos] =
          await Promise.all([
            listarFavoritos(),
            listarBarbearias(),
            listarEnderecos(),
            listarFotosPublicas(),
          ])

        setFavoritos(dadosFavoritos)
        setBarbearias(dadosBarbearias)
        setEnderecos(dadosEnderecos)
        setFotos(dadosFotos)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar seus favoritos.')
      } finally {
        setCarregando(false)
      }
    }

    if (usuario?.idUsuario) {
      void carregar()
    }
  }, [usuario?.idUsuario])

  return (
    <main className="favorites-page">
      <h1>Meus favoritos</h1>
      <p>Suas barbearias salvas em um só lugar.</p>

      <Link to="/barbearias">← Explorar barbearias</Link>

      {carregando ? (
        <p>Carregando favoritos...</p>
      ) : erro ? (
        <p role="alert">{erro}</p>
      ) : favoritos.length === 0 ? (
        <p>Você ainda não favoritou nenhuma barbearia.</p>
      ) : (
        <div className="favorites-page__list">
          {favoritos.map((favorito) => {
            const barbearia = barbearias.find(
              (item) =>
                item.idBarbearia === favorito.idBarbearia,
            )

            if (!barbearia) return null

            return (
              <div
                className="favorites-page__item"
                key={favorito.idFavorito}
              >
                <BarbeariaCard
                  barbearia={barbearia}
                  endereco={enderecos.find(
                    (item) =>
                      item.idBarbearia === favorito.idBarbearia,
                  )}
                  fotoPrincipal={
                    fotos.find(
                      (foto) =>
                        foto.idBarbearia === favorito.idBarbearia,
                    ) ?? null
                  }
                />

                <BotaoFavorito
                  idBarbearia={favorito.idBarbearia}
                  favorito={favorito}
                  onAlterado={(idBarbearia, atualizado) => {
                    setFavoritos((atuais) => [
                      ...atuais.filter(
                        (item) =>
                          item.idBarbearia !== idBarbearia,
                      ),
                      ...(atualizado ? [atualizado] : []),
                    ])
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default MeusFavoritos