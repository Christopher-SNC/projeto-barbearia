import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/Button/Button'

import './Home.css'

const barbeariasDestaque = [
  {
    nome: 'Barbearia Central',
    local: 'Praia do Canto • 1,8 km',
    servicos: 'Corte • Barba • Combo',
    avaliacao: '★ 4,9 (128 avaliações)',
  },
  {
    nome: 'Studio Navalha',
    local: 'Jardim da Penha • 2,4 km',
    servicos: 'Corte • Degradê • Barba',
    avaliacao: '★ 4,8 (94 avaliações)',
  },
  {
    nome: 'Casa do Barbeiro',
    local: 'Mata da Praia • 3,1 km',
    servicos: 'Corte • Barba • Sobrancelha',
    avaliacao: '★ 4,9 (76 avaliações)',
  },
]

function Home() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

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

          <div className="home-featured__grid">
            {barbeariasDestaque.map((barbearia) => (
              <article
                className="home-barbershop-card"
                key={barbearia.nome}
              >
                <div className="home-barbershop-card__image">
                  <span />
                </div>

                <div className="home-barbershop-card__content">
                  <h3>{barbearia.nome}</h3>

                  <p>{barbearia.local}</p>
                  <p>{barbearia.servicos}</p>

                  <strong>
                    {barbearia.avaliacao}
                  </strong>
                </div>
              </article>
            ))}
          </div>

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