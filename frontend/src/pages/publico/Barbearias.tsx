import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'

import BarbeariaCard from '../../components/BarbeariaCard/BarbeariaCard'
import BotaoFavorito from '../../components/BotaoFavorito/BotaoFavorito'
import useAuth from '../../hooks/useAuth'
import { listarFavoritos } from '../../services/favoritoService'
import type { Favorito } from '../../services/favoritoService'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'

import { listarBarbearias } from '../../services/barbeariaService'
import { listarEnderecos } from '../../services/enderecoService'
import { listarServicos } from '../../services/servicoService'
import { listarFotosPublicas } from '../../services/fotoService'
import type { Foto } from '../../types/Foto'
import type { Servico } from '../../types/Servico'
import {
  listarResumoAvaliacoes,
} from '../../services/avaliacaoResumoService'
import type {
  ResumoAvaliacaoBarbearia,
} from '../../services/avaliacaoResumoService'

import type { Barbearia } from '../../types/Barbearia'
import type { Endereco } from '../../types/Endereco'

import './Barbearias.css'

interface Coordenadas {
  latitude: number
  longitude: number
}

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function calcularDistancia(
  origem: Coordenadas,
  destino: Coordenadas,
) {
  const raioTerra = 6371

  const grausParaRadianos = (valor: number) =>
    (valor * Math.PI) / 180

  const diferencaLatitude = grausParaRadianos(
    destino.latitude - origem.latitude,
  )

  const diferencaLongitude = grausParaRadianos(
    destino.longitude - origem.longitude,
  )

  const latitudeOrigem = grausParaRadianos(
    origem.latitude,
  )

  const latitudeDestino = grausParaRadianos(
    destino.latitude,
  )

  const a =
    Math.sin(diferencaLatitude / 2) ** 2 +
    Math.cos(latitudeOrigem) *
    Math.cos(latitudeDestino) *
    Math.sin(diferencaLongitude / 2) ** 2

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return raioTerra * c
}

function Barbearias() {
  const { usuario } = useAuth()
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [erroFavoritos, setErroFavoritos] = useState('')
  const [searchParams, setSearchParams] =
    useSearchParams()

  const [barbearias, setBarbearias] = useState<
    Barbearia[]
  >([])

  const [enderecos, setEnderecos] = useState<
    Endereco[]
  >([])

  const [servicos, setServicos] = useState<Servico[]>([])
  const [fotos, setFotos] = useState<Foto[]>([])

  const [resumos, setResumos] = useState<
    ResumoAvaliacaoBarbearia[]
  >([])
  const [carregandoResumos, setCarregandoResumos] =
    useState(true)
  const [erroResumos, setErroResumos] = useState('')

  const [busca, setBusca] = useState(
    searchParams.get('busca') ?? '',
  )

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const latitude = Number(searchParams.get('lat'))
  const longitude = Number(searchParams.get('lng'))

  const filtrarCorte = searchParams.get('corte') === '1'
  const filtrarBarba = searchParams.get('barba') === '1'

  const ordenarPorAvaliacao =
    searchParams.get('avaliadas') === '1'

  const possuiLocalizacao =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    searchParams.has('lat') &&
    searchParams.has('lng')

  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosBarbearias, dadosEnderecos, dadosServicos, dadosFotos] =
          await Promise.all([
            listarBarbearias(),
            listarEnderecos(),
            listarServicos(),
            listarFotosPublicas(),
          ])

        setBarbearias(dadosBarbearias)
        setEnderecos(dadosEnderecos)
        setServicos(dadosServicos)
        setFotos(dadosFotos)
      } catch (error) {
        console.error(error)

        setErro(
          'Não foi possível carregar as barbearias.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  useEffect(() => {
    if (!usuario?.idUsuario) return

    let ativo = true

    void listarFavoritos()
      .then((dados) => {
        if (ativo) setFavoritos(dados)
      })
      .catch((error) => {
        console.error(error)
        if (ativo) {
          setErroFavoritos('Não foi possível carregar os favoritos.')
        }
      })

    return () => {
      ativo = false
    }
  }, [usuario?.idUsuario])
  useEffect(() => {
    let ativo = true

    void listarResumoAvaliacoes()
      .then((dados) => {
        if (ativo) setResumos(dados)
      })
      .catch((error) => {
        console.error(error)
        if (ativo) {
          setErroResumos(
            'Não foi possível carregar as avaliações.',
          )
        }
      })
      .finally(() => {
        if (ativo) setCarregandoResumos(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  function alternarFiltroServico(tipo: 'corte' | 'barba') {
    const novosParametros = new URLSearchParams(searchParams)

    if (novosParametros.get(tipo) === '1') {
      novosParametros.delete(tipo)
    } else {
      novosParametros.set(tipo, '1')
    }

    setSearchParams(novosParametros)
  }

  function alternarMelhorAvaliadas() {
    const novosParametros = new URLSearchParams(searchParams)

    if (ordenarPorAvaliacao) {
      novosParametros.delete('avaliadas')
    } else {
      novosParametros.set('avaliadas', '1')
    }

    setSearchParams(novosParametros)
  }

  const resultados = useMemo(() => {
    const idsComCorte = new Set<number>()
    const idsComBarba = new Set<number>()

    for (const servico of servicos) {
      if (!servico.ativo) continue

      const nome = normalizarTexto(servico.nome)

      if (/\bcortes?\b/.test(nome)) {
        idsComCorte.add(servico.idBarbearia)
      }

      if (/\bbarbas?\b/.test(nome)) {
        idsComBarba.add(servico.idBarbearia)
      }
    }

    const termo = normalizarTexto(
      searchParams.get('busca')?.trim() ?? '',
    )

    const origem = possuiLocalizacao
      ? {
        latitude,
        longitude,
      }
      : null

    return barbearias
      .filter(
        (barbearia) =>
          barbearia.ativa &&
          (!filtrarCorte ||
            idsComCorte.has(barbearia.idBarbearia)) &&
          (!filtrarBarba ||
            idsComBarba.has(barbearia.idBarbearia)),
      )
      .map((barbearia) => {
        const endereco = enderecos.find(
          (item) =>
            item.idBarbearia ===
            barbearia.idBarbearia,
        )

        let distanciaKm: number | null = null

        if (
          origem &&
          endereco?.latitude !== null &&
          endereco?.latitude !== undefined &&
          endereco.longitude !== null &&
          endereco.longitude !== undefined
        ) {
          distanciaKm = calcularDistancia(origem, {
            latitude: endereco.latitude,
            longitude: endereco.longitude,
          })
        }

        return {
          barbearia,
          endereco,
          distanciaKm,
        resumo: resumos.find((item) => item.idBarbearia === barbearia.idBarbearia),
        }
      })
      .filter(({ barbearia, endereco }) => {
        if (!termo) {
          return true
        }

        const conteudo = normalizarTexto(
          [
            barbearia.nome,
            barbearia.descricao ?? '',
            endereco?.bairro ?? '',
            endereco?.cidade ?? '',
          ].join(' '),
        )

        return conteudo.includes(termo)
      })
      .sort((a, b) => {
        if (ordenarPorAvaliacao) {
          const mediaA = a.resumo?.media ?? -1
          const mediaB = b.resumo?.media ?? -1

          if (mediaA !== mediaB) {
            return mediaB - mediaA
          }

          const quantidadeA = a.resumo?.quantidade ?? 0
          const quantidadeB = b.resumo?.quantidade ?? 0

          if (quantidadeA !== quantidadeB) {
            return quantidadeB - quantidadeA
          }
        }

        if (!possuiLocalizacao) {
          return 0
        }

        if (a.distanciaKm === null) {
          return 1
        }

        if (b.distanciaKm === null) {
          return -1
        }

        return a.distanciaKm - b.distanciaKm
      })
  }, [
    barbearias,
    enderecos,
    resumos,
    ordenarPorAvaliacao,
    filtrarCorte,
    filtrarBarba,
    servicos,
    latitude,
    longitude,
    possuiLocalizacao,
    searchParams,
  ])

  function buscar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const novosParametros =
      new URLSearchParams(searchParams)

    const termo = busca.trim()

    if (termo) {
      novosParametros.set('busca', termo)
    } else {
      novosParametros.delete('busca')
    }

    setSearchParams(novosParametros)
  }

  function buscarMaisProximas() {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const novosParametros =
          new URLSearchParams(searchParams)

        novosParametros.set(
          'lat',
          String(coords.latitude),
        )

        novosParametros.set(
          'lng',
          String(coords.longitude),
        )

        setSearchParams(novosParametros)
      },
    )
  }

  if (carregando) {
    return (
      <main className="barbershops-page">
        <section className="barbershops-results">
          <div className="barbershops-container">
            <p className="barbershops-feedback">
              Carregando barbearias...
            </p>
          </div>
        </section>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="barbershops-page">
        <section className="barbershops-results">
          <div className="barbershops-container">
            <p className="barbershops-feedback">
              {erro}
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="barbershops-page">
      <section className="barbershops-search">
        <div className="barbershops-container">
          <h1>
            Encontre uma barbearia perto de você
          </h1>

          <p className="barbershops-search__description">
            Pesquise por localização, preço e serviços.
          </p>

          <form
            className="barbershops-search__form"
            onSubmit={buscar}
          >
            <div className="barbershops-search__field">
              <span
                className="barbershops-search__dot"
                aria-hidden="true"
              />

              <input
                type="text"
                value={busca}
                placeholder="Digite seu bairro ou cidade"
                aria-label="Buscar por bairro ou cidade"
                onChange={(event) =>
                  setBusca(event.target.value)
                }
              />
            </div>

            <Button type="submit">Buscar</Button>
          </form>

          <div className="barbershops-filters">
            <button
              className={[
                'barbershops-filter',
                possuiLocalizacao
                  ? 'barbershops-filter--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={buscarMaisProximas}
            >
              <span className="barbershops-filter__desktop">
                Mais próximas
              </span>

              <span className="barbershops-filter__mobile">
                Próximas
              </span>
            </button>

            <button
              className={[
                'barbershops-filter',
                ordenarPorAvaliacao
                  ? 'barbershops-filter--active'
                  : '',
              ].filter(Boolean).join(' ')}
              type="button"
              aria-pressed={ordenarPorAvaliacao}
              disabled={carregandoResumos || Boolean(erroResumos)}
              onClick={alternarMelhorAvaliadas}
            >
              <span className="barbershops-filter__desktop">
                Melhor avaliadas
              </span>

              <span className="barbershops-filter__mobile">
                Avaliadas
              </span>
            </button>

            <button
              className={[
                'barbershops-filter',
                filtrarCorte
                  ? 'barbershops-filter--active'
                  : '',
              ].filter(Boolean).join(' ')}
              type="button"
              aria-pressed={filtrarCorte}
              onClick={() => alternarFiltroServico('corte')}
            >
              Corte
            </button>

            <button
              className={[
                'barbershops-filter',
                filtrarBarba
                  ? 'barbershops-filter--active'
                  : '',
              ].filter(Boolean).join(' ')}
              type="button"
              aria-pressed={filtrarBarba}
              onClick={() => alternarFiltroServico('barba')}
            >
              Barba
            </button>
            
          </div>
        </div>
      </section>

      <section className="barbershops-results">
        <div className="barbershops-container">
          <div className="barbershops-results__grid">
            <div>
              {usuario && (
                <p>
                  <Link to="/meus-favoritos">
                    ♥ Meus favoritos
                  </Link>
                </p>
              )}

              {erroFavoritos && (
                <p role="alert">{erroFavoritos}</p>
              )}
              {erroResumos && (
                <p role="alert">{erroResumos}</p>
              )}
              <p className="barbershops-results__count">
                {resultados.length}{' '}
                {resultados.length === 1
                  ? 'barbearia encontrada'
                  : 'barbearias encontradas'}
              </p>

              {resultados.length === 0 ? (
                <p className="barbershops-empty">
                  Nenhuma barbearia encontrada para
                  essa busca.
                </p>
              ) : (
                <div className="barbershops-list">
                  {resultados.map(
                    ({
                      barbearia,
                      endereco,
                      distanciaKm,
                      resumo,
                    }) => (
                      <div key={barbearia.idBarbearia}>
                        <BarbeariaCard
                          barbearia={barbearia}
                          endereco={endereco}
                          distanciaKm={distanciaKm}
                          fotoPrincipal={
                            fotos.find(
                              (foto) =>
                                foto.idBarbearia === barbearia.idBarbearia,
                            ) ?? null
                          }
                        />
                        <p className="barbershops-rating">
                          {resumo
                            ? `★ ${resumo.media.toFixed(1).replace('.', ',')} · ${resumo.quantidade} ${resumo.quantidade === 1 ? 'avaliação' : 'avaliações'}`
                            : 'Ainda sem avaliações'}
                        </p>
                        <BotaoFavorito
                          idBarbearia={barbearia.idBarbearia}
                          favorito={favoritos.find(
                            (item) =>
                              item.idBarbearia ===
                              barbearia.idBarbearia,
                          )}
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
                    ),
                  )}
                </div>
              )}
            </div>

            <div
              className="barbershops-map"
              aria-label="Mapa ilustrativo das barbearias"
            >
              <span className="barbershops-map__block barbershops-map__block--1" />
              <span className="barbershops-map__block barbershops-map__block--2" />
              <span className="barbershops-map__block barbershops-map__block--3" />
              <span className="barbershops-map__block barbershops-map__block--4" />
              <span className="barbershops-map__block barbershops-map__block--5" />
              <span className="barbershops-map__block barbershops-map__block--6" />

              <span className="barbershops-map__road barbershops-map__road--horizontal" />
              <span className="barbershops-map__road barbershops-map__road--diagonal" />

              <span className="barbershops-map__pin barbershops-map__pin--1" />
              <span className="barbershops-map__pin barbershops-map__pin--2" />
              <span className="barbershops-map__pin barbershops-map__pin--3" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Barbearias