import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/Button/Button'
import AgendamentoAcoes from '../../components/AgendamentoAcoes/AgendamentoAcoes'
import StatusBadge from '../../components/StatusBadge/StatusBadge'

import useBarbeariaProprietario from '../../hooks/useBarbeariaProprietario'

import { listarAgendamentos } from '../../services/agendamentoService'

import type {
  Agendamento,
  StatusAgendamento,
} from '../../types/Agendamento'

import './AgendamentosProprietario.css'

type FiltroAgendamento =
  | 'hoje'
  | 'confirmados'
  | 'concluidos'
  | 'cancelados'
  | 'nao-compareceu'

type StatusBadgeVariant =
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show'

function dataAtualISO() {
  const data = new Date()

  const ano = data.getFullYear()
  const mes = String(
    data.getMonth() + 1,
  ).padStart(
    2,
    '0',
  )

  const dia = String(
    data.getDate(),
  ).padStart(
    2,
    '0',
  )

  return `${ano}-${mes}-${dia}`
}

function formatarHora(dataHora: string) {
  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(dataHora))
}

function formatarData(dataHora: string) {
  return new Intl.DateTimeFormat(
    'pt-BR',
  ).format(
    new Date(dataHora),
  )
}

function obterStatusVariant(
  status: StatusAgendamento,
): StatusBadgeVariant {
  switch (status) {
    case 'CONCLUIDO':
      return 'completed'

    case 'CANCELADO':
      return 'cancelled'

    case 'NAO_COMPARECEU':
      return 'no-show'

    default:
      return 'confirmed'
  }
}

function obterStatusLabel(
  status: StatusAgendamento,
) {
  switch (status) {
    case 'CONCLUIDO':
      return 'CONCLUÍDO'

    case 'CANCELADO':
      return 'CANCELADO'

    case 'NAO_COMPARECEU':
      return 'NÃO COMPARECEU'

    default:
      return 'CONFIRMADO'
  }
}

function AgendamentosProprietario() {
  const navigate = useNavigate()

  const idBarbearia =
    useBarbeariaProprietario()

  const [filtro, setFiltro] =
    useState<FiltroAgendamento>('hoje')

  const [agendamentos, setAgendamentos] =
    useState<Agendamento[]>([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosAgendamentos =
          await listarAgendamentos()

        setAgendamentos(
          dadosAgendamentos.filter(
            (agendamento) =>
              agendamento.idBarbearia ===
              idBarbearia,
          ),
        )

      } catch (error) {
        console.error(error)

        setErro(
          'Não foi possível carregar os agendamentos.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [idBarbearia])

  const agendamentosFiltrados =
    useMemo(() => {
      const hoje = dataAtualISO()

      const resultado =
        agendamentos.filter(
          (agendamento) => {
            switch (filtro) {
              case 'confirmados':
                return (
                  agendamento.status ===
                  'CONFIRMADO'
                )

              case 'concluidos':
                return (
                  agendamento.status ===
                  'CONCLUIDO'
                )

              case 'cancelados':
                return (
                  agendamento.status ===
                  'CANCELADO'
                )

              case 'nao-compareceu':
                return (
                  agendamento.status ===
                  'NAO_COMPARECEU'
                )

              default:
                return (
                  agendamento.dataHoraInicio
                    .startsWith(hoje)
                )
            }
          },
        )

      return resultado.sort(
        (a, b) => {
          const dataA =
            new Date(
              a.dataHoraInicio,
            ).getTime()

          const dataB =
            new Date(
              b.dataHoraInicio,
            ).getTime()

          if (
            filtro === 'concluidos' ||
            filtro === 'cancelados' ||
            filtro ===
            'nao-compareceu'
          ) {
            return dataB - dataA
          }

          return dataA - dataB
        },
      )
    }, [
      agendamentos,
      filtro,
    ])

  function nomeServicos(
    agendamento: Agendamento,
  ) {
    if (
      agendamento.itens.length === 0
    ) {
      return 'Serviço'
    }

    return agendamento.itens
      .map(
        (item) =>
          item.nomeServico,
      )
      .join(' + ')
  }

  function tituloLista() {
    switch (filtro) {
      case 'confirmados':
        return 'Agendamentos confirmados'

      case 'concluidos':
        return 'Agendamentos concluídos'

      case 'cancelados':
        return 'Agendamentos cancelados'

      case 'nao-compareceu':
        return 'Não compareceram'

      default:
        return 'Agendamentos de hoje'
    }
  }

  function novoAgendamento() {
    navigate(
      `/barbearias/${idBarbearia}/agendar`,
    )
  }

  const filtros: {
    id: FiltroAgendamento
    label: string
  }[] = [
      {
        id: 'hoje',
        label: 'Hoje',
      },
      {
        id: 'confirmados',
        label: 'Confirmados',
      },
      {
        id: 'concluidos',
        label: 'Concluídos',
      },
      {
        id: 'cancelados',
        label: 'Cancelados',
      },
      {
        id: 'nao-compareceu',
        label: 'Não compareceu',
      },
    ]

  return (
    <section className="admin-appointments">
      <div className="admin-appointments__topbar">
        <div>
          <h1>Agendamentos</h1>

          <p className="admin-appointments__description admin-appointments__description--desktop">
            Gerencie confirmações, cancelamentos e
            histórico
          </p>

          <p className="admin-appointments__description admin-appointments__description--mobile">
            Gerencie status e histórico
          </p>
        </div>

        <Button
          type="button"
          onClick={novoAgendamento}
        >
          Novo agendamento
        </Button>
      </div>

      <div className="admin-appointments__filters">
        {filtros.map(
          (item) => (
            <button
              className={[
                'admin-appointments__filter',
                filtro === item.id
                  ? 'admin-appointments__filter--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={item.id}
              type="button"
              onClick={() =>
                setFiltro(
                  item.id,
                )
              }
            >
              {item.label}
            </button>
          ),
        )}
      </div>

      {erro && (
        <p className="admin-appointments__message">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="admin-appointments__message">
          Carregando agendamentos...
        </p>
      ) : (
        <>
          <div className="admin-appointments__desktop">
            <div className="admin-appointments__table">
              <h2>
                {tituloLista()}
              </h2>

              <p className="admin-appointments__count">
                {
                  agendamentosFiltrados.length
                }{' '}
                {agendamentosFiltrados.length ===
                  1
                  ? 'registro'
                  : 'registros'}
              </p>

              {agendamentosFiltrados.length ===
                0 ? (
                <p className="admin-appointments__empty">
                  Nenhum agendamento encontrado.
                </p>
              ) : (
                <div className="admin-appointments__rows">
                  {agendamentosFiltrados.map(
                    (agendamento) => (
                      <article
                        className="admin-appointments__row"
                        key={
                          agendamento.idAgendamento
                        }
                      >
                        <div className="admin-appointments__primary">
                          <strong>
                            {formatarHora(
                              agendamento.dataHoraInicio,
                            )}{' '}
                            •{' '}
                            {agendamento.nomeCliente || 'Cliente'}
                          </strong>

                          {filtro !==
                            'hoje' && (
                              <span>
                                {formatarData(
                                  agendamento.dataHoraInicio,
                                )}
                              </span>
                            )}
                        </div>

                        <span className="admin-appointments__service">
                          {nomeServicos(
                            agendamento,
                          )}{' '}
                          •{' '}
                          {agendamento.nomeBarbeiro || 'Barbeiro'}
                        </span>

                        <StatusBadge
                          variant={obterStatusVariant(
                            agendamento.status,
                          )}
                        >
                          {obterStatusLabel(
                            agendamento.status,
                          )}
                        </StatusBadge>
<AgendamentoAcoes
    agendamento={agendamento}
    perfil="proprietario"
    onAtualizado={(atualizado) =>
        setAgendamentos((atuais) =>
            atuais.map((item) =>
                item.idAgendamento === atualizado.idAgendamento
                    ? atualizado
                    : item,
            ),
        )
    }
/>
                      </article>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="admin-appointments__mobile">
            {agendamentosFiltrados.length ===
              0 ? (
              <p className="admin-appointments__empty">
                Nenhum agendamento encontrado.
              </p>
            ) : (
              <div className="admin-appointments__cards">
                {agendamentosFiltrados.map(
                  (agendamento) => (
                    <article
                      className="admin-appointments__card"
                      key={
                        agendamento.idAgendamento
                      }
                    >
                      <div className="admin-appointments__card-top">
                        <div>
                          <strong>
                            {formatarHora(
                              agendamento.dataHoraInicio,
                            )}{' '}
                            •{' '}
                            {agendamento.nomeCliente || 'Cliente'}
                          </strong>

                          {filtro !==
                            'hoje' && (
                              <span className="admin-appointments__card-date">
                                {formatarData(
                                  agendamento.dataHoraInicio,
                                )}
                              </span>
                            )}
                        </div>

                        <StatusBadge
                          variant={obterStatusVariant(
                            agendamento.status,
                          )}
                        >
                          {obterStatusLabel(
                            agendamento.status,
                          )}
                        </StatusBadge>
<AgendamentoAcoes
    agendamento={agendamento}
    perfil="proprietario"
    onAtualizado={(atualizado) =>
        setAgendamentos((atuais) =>
            atuais.map((item) =>
                item.idAgendamento === atualizado.idAgendamento
                    ? atualizado
                    : item,
            ),
        )
    }
/>
                      </div>

                      <p>
                        {nomeServicos(
                          agendamento,
                        )}{' '}
                        •{' '}
                        {agendamento.nomeBarbeiro || 'Barbeiro'}
                      </p>
                    </article>
                  ),
                )}
              </div>
            )}

            <Button
              fullWidth
              type="button"
              onClick={novoAgendamento}
            >
              Novo agendamento
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

export default AgendamentosProprietario