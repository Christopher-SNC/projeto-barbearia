import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../../components/Button/Button'

import { listarBarbearias } from '../../services/barbeariaService'
import { listarEnderecos } from '../../services/enderecoService'
import { listarServicos } from '../../services/servicoService'
import { listarFotosPublicas } from '../../services/fotoService'
import { listarResumoAvaliacoes } from '../../services/avaliacaoResumoService'

import type { Barbearia } from '../../types/Barbearia'
import type { Endereco } from '../../types/Endereco'
import type { Foto } from '../../types/Foto'
import type { Servico } from '../../types/Servico'
import type { ResumoAvaliacaoBarbearia } from '../../services/avaliacaoResumoService'

import './Home.css'

interface DestaqueBarbearia {
  barbearia: Barbearia
  endereco?: Endereco
  servicos: Servico[]
  foto?: Foto
  resumo?: ResumoAvaliacaoBarbearia
}

function Home() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [destaques, setDestaques] = useState<DestaqueBarbearia[]>([])
  const [carregandoDestaques, setCarregandoDestaques] = useState(true)
  const [erroDestaques, setErroDestaques] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDestaques() {
      try {
        const [barbearias, enderecos, servicos, fotos, resumos] =
          await Promise.all([
            listarBarbearias(),
            listarEnderecos(),
            listarServicos(),
            listarFotosPublicas(),
            listarResumoAvaliacoes(),
          ])

        if (!ativo) return

        const resumosPorId = new Map(
          resumos.map((resumo) => [resumo.idBarbearia, resumo]),
        )

        const dados: DestaqueBarbearia[] = barbearias
          .filter((barbearia) => barbearia.ativa)
          .sort((a, b) => {
            const resumoA = resumosPorId.get(a.idBarbearia)
            const resumoB = resumosPorId.get(b.idBarbearia)
            const possuiA = (resumoA?.quantidade ?? 0) > 0
            const possuiB = (resumoB?.quantidade ?? 0) > 0

            if (possuiA !== possuiB) return possuiA ? -1 : 1

            if (possuiA && possuiB) {
              const mediaA = resumoA?.media ?? 0
              const mediaB = resumoB?.media ?? 0
              if (mediaA !== mediaB) return mediaB - mediaA

              const quantidadeA = resumoA?.quantidade ?? 0
              const quantidadeB = resumoB?.quantidade ?? 0
              if (quantidadeA !== quantidadeB) {
                return quantidadeB - quantidadeA
              }
            }

            return a.nome.localeCompare(b.nome, 'pt-BR')
          })
          .slice(0, 3)
          .map((barbearia) => ({
            barbearia,
            endereco: enderecos.find(
              (endereco) => endereco.idBarbearia === barbearia.idBarbearia,
            ),
            servicos: servicos
              .filter(
                (servico) =>
                  servico.idBarbearia === barbearia.idBarbearia &&
                  servico.ativo,
              )
              .slice(0, 3),
            foto: fotos
              .filter(
                (foto) =>
                  foto.idBarbearia === barbearia.idBarbearia &&
                  foto.ativa,
              )
              .sort((a, b) => a.ordem - b.ordem)[0],
            resumo: resumosPorId.get(barbearia.idBarbearia),
          }))

        setDestaques(dados)
      } catch (erro) {
        console.error('Nao foi possivel carregar os destaques:', erro)
        if (ativo) {
          setErroDestaques(
            'Não foi possível carregar as barbearias em destaque.',
          )
        }
      } finally {
        if (ativo) setCarregandoDestaques(false)
      }
    }

    void carregarDestaques()

    return () => {
      ativo = false
    }
  }, [])

  function buscarBarbearias(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const termo = busca.trim()

    if (!termo) {
      navigate('/barbearias')
      return
    }

    navigate(
      `/barbearias?busca=${encodeURIComponent(termo)}`,
    )
  }

  function usarLocalizacao() {
    if (!navigator.geolocation) {
      navigate('/barbearias')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        navigate(
          `/barbearias?lat=${coords.latitude}&lng=${coords.longitude}`,
        )
      },
      () => {
        navigate('/barbearias')
      },
    )
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-container home-hero__grid">
          <div className="home-hero__content">
            <p className="home-eyebrow">
              Agendamento fácil. Estilo certo.
            </p>

            <h1>
              Sua próxima
              <br />
              barbearia, a poucos
              <br />
              cliques.
            </h1>

            <p className="home-hero__description">
              Descubra profissionais, compare serviços e
              encontre horários disponíveis perto de você.
            </p>

            <form
              className="home-search"
              onSubmit={buscarBarbearias}
            >
              <div className="home-search__field">
                <span
                  className="home-search__dot"
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

              <Button type="submit">
                Buscar barbearias
              </Button>
            </form>

            <button
              className="home-location"
              type="button"
              onClick={usarLocalizacao}
            >
              <span aria-hidden="true">⌖</span>
              Usar minha localização
            </button>
          </div>

          <div
            className="home-map"
            aria-label="Mapa ilustrativo com barbearias próximas"
          >
            <span className="home-map__road home-map__road--horizontal" />
            <span className="home-map__road home-map__road--diagonal" />

            <span className="home-map__block home-map__block--1" />
            <span className="home-map__block home-map__block--2" />
            <span className="home-map__block home-map__block--3" />
            <span className="home-map__block home-map__block--4" />
            <span className="home-map__block home-map__block--5" />
            <span className="home-map__block home-map__block--6" />
            <span className="home-map__block home-map__block--7" />

            <span className="home-map__pin home-map__pin--1">
              ●
            </span>

            <span className="home-map__pin home-map__pin--2">
              ●
            </span>

            <span className="home-map__pin home-map__pin--3">
              ●
            </span>
          </div>
        </div>
      </section>

      <section className="home-featured">
        <div className="home-container">
          <div className="home-section-heading">
            <h2>Barbearias em destaque</h2>

            <p>
              Boas opções para começar sua busca.
            </p>
          </div>

          {carregandoDestaques ? (
            <p className="home-featured__status" role="status">
              Carregando barbearias em destaque...
            </p>
          ) : erroDestaques ? (
            <p className="home-featured__status" role="alert">
              {erroDestaques}
            </p>
          ) : destaques.length === 0 ? (
            <p className="home-featured__status">
              Ainda não há barbearias ativas para destacar.
            </p>
          ) : (
            <div className="home-featured__grid">
              {destaques.map(({ barbearia, endereco, servicos, foto, resumo }) => (
                <Link
                  className="home-barbershop-card"
                  key={barbearia.idBarbearia}
                  to={`/barbearias/${barbearia.idBarbearia}`}
                >
                  <div className="home-barbershop-card__image">
                    {foto && (
                      <img
                        src={foto.url}
                        alt={foto.legenda || barbearia.nome}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span aria-hidden="true" />
                  </div>

                  <div className="home-barbershop-card__content">
                    <h3>{barbearia.nome}</h3>
                    <p>
                      {endereco
                        ? `${endereco.bairro} • ${endereco.cidade}`
                        : 'Localização não informada'}
                    </p>
                    {servicos.length > 0 && (
                      <p>{servicos.map((servico) => servico.nome).join(' • ')}</p>
                    )}
                    <strong>
                      {resumo && resumo.quantidade > 0
                        ? `★ ${resumo.media.toLocaleString('pt-BR', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })} (${resumo.quantidade} ${
                            resumo.quantidade === 1 ? 'avaliação' : 'avaliações'
                          })`
                        : 'Ainda sem avaliações'}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="home-featured__mobile-action">
            <Button
              fullWidth
              type="button"
              onClick={() => navigate('/barbearias')}
            >
              Ver todas as barbearias
            </Button>
          </div>
        </div>
      </section>

      <section
        className="home-steps"
        id="como-funciona"
      >
        <div className="home-container">
          <div className="home-section-heading">
            <h2>Agendar pode ser simples.</h2>
          </div>

          <div className="home-steps__grid">
            <article className="home-step-card">
              <span>01</span>
              <h3>Escolha a barbearia</h3>
              <p>
                Veja serviços, preços e profissionais
                disponíveis.
              </p>
            </article>

            <article className="home-step-card">
              <span>02</span>
              <h3>Selecione o melhor horário</h3>
              <p>
                Escolha entre horários realmente livres.
              </p>
            </article>

            <article className="home-step-card">
              <span>03</span>
              <h3>Confirme e pronto</h3>
              <p>
                Seu agendamento fica registrado para
                acompanhar.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="home-container home-final-cta__content">
          <div>
            <h2>
              Pronto para encontrar seu próximo barbeiro?
            </h2>

            <p>
              Pesquise por localização e encontre um horário
              que funcione para você.
            </p>
          </div>

          <Button
            variant="accent"
            type="button"
            onClick={() => navigate('/barbearias')}
          >
            Encontrar barbearias
          </Button>
        </div>
      </section>
    </main>
  )
}

export default Home
