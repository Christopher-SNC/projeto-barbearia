import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import Button from '../../components/Button/Button'

import { buscarBarbeariaPorId } from '../../services/barbeariaService'
import { listarBarbeiros } from '../../services/barbeiroService'
import { listarEnderecos } from '../../services/enderecoService'
import { listarHorariosFuncionamento } from '../../services/horarioFuncionamentoService'
import { listarServicos } from '../../services/servicoService'

import type { Barbearia } from '../../types/Barbearia'
import type { Barbeiro } from '../../types/Barbeiro'
import type { Endereco } from '../../types/Endereco'
import type { HorarioFuncionamento } from '../../types/HorarioFuncionamento'
import type { Servico } from '../../types/Servico'

import './DetalhesBarbearia.css'

const nomesDias: Record<string, string> = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

function formatarHora(hora: string) {
  return hora.substring(0, 5)
}

function formatarPreco(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

function DetalhesBarbearia() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [barbearia, setBarbearia] =
    useState<Barbearia | null>(null)

  const [endereco, setEndereco] =
    useState<Endereco | null>(null)

  const [horarios, setHorarios] = useState<
    HorarioFuncionamento[]
  >([])

  const [servicos, setServicos] = useState<Servico[]>([])

  const [barbeiros, setBarbeiros] = useState<
    Barbeiro[]
  >([])

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDados() {
      const idBarbearia = Number(id)

      if (!id || Number.isNaN(idBarbearia)) {
        setErro('Barbearia inválida.')
        setCarregando(false)
        return
      }

      try {
        const [
          dadosBarbearia,
          dadosEnderecos,
          dadosHorarios,
          dadosServicos,
          dadosBarbeiros,
        ] = await Promise.all([
          buscarBarbeariaPorId(idBarbearia),
          listarEnderecos(),
          listarHorariosFuncionamento(),
          listarServicos(),
          listarBarbeiros(),
        ])

        setBarbearia(dadosBarbearia)

        setEndereco(
          dadosEnderecos.find(
            (item) =>
              item.idBarbearia === idBarbearia,
          ) ?? null,
        )

        setHorarios(
          dadosHorarios.filter(
            (item) =>
              item.idBarbearia === idBarbearia,
          ),
        )

        setServicos(
          dadosServicos.filter(
            (item) =>
              item.idBarbearia === idBarbearia &&
              item.ativo,
          ),
        )

        setBarbeiros(
          dadosBarbeiros.filter(
            (item) =>
              item.idBarbearia === idBarbearia &&
              item.ativo,
          ),
        )

      } catch (error) {
        console.error(error)

        setErro(
          'Não foi possível carregar os dados da barbearia.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [id])

  function irParaAgendamento() {
    if (!barbearia) {
      return
    }

    navigate(
      `/barbearias/${barbearia.idBarbearia}/agendar`,
    )
  }

  if (carregando) {
    return (
      <main className="barbershop-details">
        <section className="barbershop-details__content">
          <div className="barbershop-details__container">
            <p>Carregando barbearia...</p>
          </div>
        </section>
      </main>
    )
  }

  if (erro || !barbearia) {
    return (
      <main className="barbershop-details">
        <section className="barbershop-details__content">
          <div className="barbershop-details__container">
            <p>
              {erro || 'Barbearia não encontrada.'}
            </p>

            <Link to="/barbearias">
              ← Voltar para barbearias
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="barbershop-details">
      <section className="barbershop-details__hero">
        <div className="barbershop-details__container barbershop-details__hero-grid">
          <div className="barbershop-details__image">
            <span />
          </div>

          <div className="barbershop-details__intro">
            <h1>{barbearia.nome}</h1>

            {endereco && (
              <p className="barbershop-details__location">
                {endereco.bairro}, {endereco.cidade}
              </p>
            )}

            {barbearia.descricao && (
              <p className="barbershop-details__description">
                {barbearia.descricao}
              </p>
            )}

            <Button
              variant="accent"
              type="button"
              onClick={irParaAgendamento}
            >
              Agendar horário
            </Button>
          </div>
        </div>
      </section>

      <section className="barbershop-details__content">
        <div className="barbershop-details__container barbershop-details__content-grid">
          <div className="barbershop-details__main">
            <section className="barbershop-details__section">
              <h2>Serviços</h2>

              {servicos.length === 0 ? (
                <p className="barbershop-details__empty">
                  Nenhum serviço disponível.
                </p>
              ) : (
                <div className="barbershop-services">
                  {servicos.map((servico) => (
                    <article
                      className="barbershop-service"
                      key={servico.idServico}
                    >
                      <div>
                        <h3>{servico.nome}</h3>

                        <p>
                          {servico.duracaoMinutos} min •{' '}
                          {formatarPreco(servico.preco)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={irParaAgendamento}
                      >
                        <span className="barbershop-service__desktop-action">
                          Agendar
                        </span>

                        <span
                          className="barbershop-service__mobile-action"
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="barbershop-details__section">
              <h2>Profissionais</h2>

              {barbeiros.length === 0 ? (
                <p className="barbershop-details__empty">
                  Nenhum profissional disponível.
                </p>
              ) : (
                <div className="barbershop-professionals">
                  {barbeiros.map((barbeiro) => (
                    <article
                      className="barbershop-professional"
                      key={barbeiro.idBarbeiro}
                    >
                      <div className="barbershop-professional__avatar" />

                      <div className="barbershop-professional__info">
                        <h3>
                          {barbeiro.nomeUsuario}
                        </h3>

                        {barbeiro.descricao && (
                          <p>{barbeiro.descricao}</p>
                        )}
                      </div>

                      <span
                        className="barbershop-professional__arrow"
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="barbershop-details__aside">
            <section className="barbershop-hours">
              <h2>Horário de funcionamento</h2>

              {horarios.length === 0 ? (
                <p>Nenhum horário cadastrado.</p>
              ) : (
                <ul>
                  {horarios.map((horario) => (
                    <li key={horario.idHorario}>
                      <span>
                        {nomesDias[
                          horario.diaSemana
                        ] ?? horario.diaSemana}
                      </span>

                      <strong>
                        {horario.fechado ||
                          !horario.horaAbertura ||
                          !horario.horaFechamento ? (
                          'Fechado'
                        ) : (
                          <>
                            {formatarHora(
                              horario.horaAbertura,
                            )}
                            {'–'}
                            {formatarHora(
                              horario.horaFechamento,
                            )}
                          </>
                        )}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}

              <div
                className="barbershop-details__map"
                aria-label="Mapa ilustrativo da localização"
              >
                <span className="barbershop-details__map-block barbershop-details__map-block--1" />
                <span className="barbershop-details__map-block barbershop-details__map-block--2" />
                <span className="barbershop-details__map-block barbershop-details__map-block--3" />

                <span className="barbershop-details__map-road barbershop-details__map-road--horizontal" />
                <span className="barbershop-details__map-road barbershop-details__map-road--diagonal" />

                <span className="barbershop-details__map-pin barbershop-details__map-pin--1" />
                <span className="barbershop-details__map-pin barbershop-details__map-pin--2" />
              </div>
            </section>
          </aside>
        </div>
      </section>

      <div className="barbershop-details__back">
        <div className="barbershop-details__container">
          <Link to="/barbearias">
            ← Voltar para barbearias
          </Link>
        </div>
      </div>
    </main>
  )
}

export default DetalhesBarbearia