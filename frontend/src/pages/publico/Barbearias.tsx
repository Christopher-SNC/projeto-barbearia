import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'

import BarbeariaCard from '../../components/BarbeariaCard/BarbeariaCard'
import Button from '../../components/Button/Button'

import { listarBarbearias } from '../../services/barbeariaService'
import { listarEnderecos } from '../../services/enderecoService'

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
  const [searchParams, setSearchParams] =
    useSearchParams()

  const [barbearias, setBarbearias] = useState<
    Barbearia[]
  >([])

  const [enderecos, setEnderecos] = useState<
    Endereco[]
  >([])

  const [busca, setBusca] = useState(
    searchParams.get('busca') ?? '',
  )

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const latitude = Number(searchParams.get('lat'))
  const longitude = Number(searchParams.get('lng'))

  const possuiLocalizacao =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    searchParams.has('lat') &&
    searchParams.has('lng')

  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosBarbearias, dadosEnderecos] =
          await Promise.all([
            listarBarbearias(),
            listarEnderecos(),
          ])

        setBarbearias(dadosBarbearias)
        setEnderecos(dadosEnderecos)
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

  const resultados = useMemo(() => {
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
      .filter((barbearia) => barbearia.ativa)
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
              className="barbershops-filter"
              type="button"
              disabled
              title="Filtro disponível após integração das avaliações"
            >
              <span className="barbershops-filter__desktop">
                Melhor avaliadas
              </span>

              <span className="barbershops-filter__mobile">
                Avaliadas
              </span>
            </button>

            <button
              className="barbershops-filter"
              type="button"
              disabled
            >
              Corte
            </button>

            <button
              className="barbershops-filter"
              type="button"
              disabled
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
                    }) => (
                      <BarbeariaCard
                        key={barbearia.idBarbearia}
                        barbearia={barbearia}
                        endereco={endereco}
                        distanciaKm={distanciaKm}
                      />
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