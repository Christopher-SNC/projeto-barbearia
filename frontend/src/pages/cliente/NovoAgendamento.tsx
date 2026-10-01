import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link, useParams } from 'react-router-dom'

import Button from '../../components/Button/Button'
import DateInput from '../../components/DateInput/DateInput'

import {
  criarAgendamento,
  listarAgendamentos,
} from '../../services/agendamentoService'
import { listarBarbeiros } from '../../services/barbeiroService'
import { listarBarbeirosServicos } from '../../services/barbeiroServicoService'
import { listarDisponibilidades } from '../../services/disponibilidadeService'
import { listarHorariosFuncionamento } from '../../services/horarioFuncionamentoService'
import { listarServicos } from '../../services/servicoService'
import { listarUsuarios } from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Barbeiro } from '../../types/Barbeiro'
import type { BarbeiroServico } from '../../types/BarbeiroServico'
import type { Disponibilidade } from '../../types/Disponibilidade'
import type { HorarioFuncionamento } from '../../types/HorarioFuncionamento'
import type { Servico } from '../../types/Servico'
import type { Usuario } from '../../types/Usuario'

import './NovoAgendamento.css'

import { DEMO_IDS } from '../../config/demo'

const BUFFER_MINUTOS = 15


const diasSemana: Record<number, string> = {
  0: 'DOMINGO',
  1: 'SEGUNDA',
  2: 'TERCA',
  3: 'QUARTA',
  4: 'QUINTA',
  5: 'SEXTA',
  6: 'SABADO',
}

function horaParaMinutos(hora: string) {
  const [horas, minutos] = hora.split(':').map(Number)

  return horas * 60 + minutos
}

function minutosParaHora(total: number) {
  const horas = Math.floor(total / 60)
  const minutos = total % 60

  return `${String(horas).padStart(2, '0')}:${String(
    minutos,
  ).padStart(2, '0')}`
}

function obterDiaSemana(data: string) {
  const dataLocal = new Date(`${data}T12:00:00`)

  return diasSemana[dataLocal.getDay()]
}

function formatarPreco(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

function formatarData(data: string) {
  if (!data) {
    return '—'
  }

  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

function NovoAgendamento() {
  const { id } = useParams()

  const idBarbearia = Number(id)

  const [servicos, setServicos] = useState<Servico[]>([])
  const [barbeiros, setBarbeiros] = useState<
    Barbeiro[]
  >([])
  const [usuarios, setUsuarios] = useState<Usuario[]>(
    [],
  )
  const [vinculos, setVinculos] = useState<
    BarbeiroServico[]
  >([])
  const [disponibilidades, setDisponibilidades] =
    useState<Disponibilidade[]>([])
  const [
    horariosFuncionamento,
    setHorariosFuncionamento,
  ] = useState<HorarioFuncionamento[]>([])
  const [agendamentos, setAgendamentos] = useState<
    Agendamento[]
  >([])

  const [idServico, setIdServico] = useState<
    number | null
  >(null)
  const [idBarbeiro, setIdBarbeiro] = useState<
    number | null
  >(null)
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    async function carregarDados() {
      if (Number.isNaN(idBarbearia)) {
        setErro('Barbearia inválida.')
        setCarregando(false)
        return
      }

      try {
        const [
          dadosServicos,
          dadosBarbeiros,
          dadosUsuarios,
          dadosVinculos,
          dadosDisponibilidades,
          dadosHorarios,
          dadosAgendamentos,
        ] = await Promise.all([
          listarServicos(),
          listarBarbeiros(),
          listarUsuarios(),
          listarBarbeirosServicos(),
          listarDisponibilidades(),
          listarHorariosFuncionamento(),
          listarAgendamentos(),
        ])

        setServicos(
          dadosServicos.filter(
            (servico) =>
              servico.idBarbearia === idBarbearia &&
              servico.ativo,
          ),
        )

        setBarbeiros(
          dadosBarbeiros.filter(
            (barbeiro) =>
              barbeiro.idBarbearia ===
              idBarbearia && barbeiro.ativo,
          ),
        )

        setUsuarios(dadosUsuarios)
        setVinculos(dadosVinculos)
        setDisponibilidades(dadosDisponibilidades)
        setHorariosFuncionamento(dadosHorarios)
        setAgendamentos(dadosAgendamentos)
      } catch (error) {
        console.error(error)

        setErro(
          'Não foi possível carregar os dados do agendamento.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [idBarbearia])

  const servicoSelecionado = servicos.find(
    (servico) => servico.idServico === idServico,
  )

  const barbeiroSelecionado = barbeiros.find(
    (barbeiro) => barbeiro.idBarbeiro === idBarbeiro,
  )

  const barbeirosDisponiveis = useMemo(() => {
    if (!idServico) {
      return []
    }

    const idsBarbeiros = vinculos
      .filter(
        (vinculo) =>
          vinculo.idServico === idServico &&
          vinculo.ativo,
      )
      .map((vinculo) => vinculo.idBarbeiro)

    return barbeiros.filter((barbeiro) =>
      idsBarbeiros.includes(barbeiro.idBarbeiro),
    )
  }, [idServico, vinculos, barbeiros])

  const horariosDisponiveis = useMemo(() => {
    if (
      !data ||
      !idBarbeiro ||
      !servicoSelecionado
    ) {
      return []
    }

    const diaSemana = obterDiaSemana(data)

    const horarioBarbearia =
      horariosFuncionamento.find(
        (horario) =>
          horario.idBarbearia === idBarbearia &&
          horario.diaSemana === diaSemana &&
          !horario.fechado,
      )

    const disponibilidadeBarbeiro =
      disponibilidades.find(
        (disponibilidade) =>
          disponibilidade.idBarbeiro ===
          idBarbeiro &&
          disponibilidade.diaSemana ===
          diaSemana &&
          disponibilidade.ativo,
      )

    if (
      !horarioBarbearia ||
      horarioBarbearia.fechado ||
      !horarioBarbearia.horaAbertura ||
      !horarioBarbearia.horaFechamento ||
      !disponibilidadeBarbeiro
    ) {
      return []
    }

    const inicio = Math.max(
      horaParaMinutos(
        horarioBarbearia.horaAbertura,
      ),
      horaParaMinutos(
        disponibilidadeBarbeiro.horaInicio,
      ),
    )

    const fim = Math.min(
      horaParaMinutos(
        horarioBarbearia.horaFechamento,
      ),
      horaParaMinutos(
        disponibilidadeBarbeiro.horaFim,
      ),
    )

    const duracao =
      servicoSelecionado.duracaoMinutos

    const ocupados = agendamentos.filter(
      (agendamento) =>
        agendamento.idBarbeiro === idBarbeiro &&
        agendamento.status === 'CONFIRMADO' &&
        agendamento.dataHoraInicio.startsWith(data),
    )

    const opcoes: string[] = []

    for (
      let candidato = inicio;
      candidato + duracao <= fim;
      candidato += 15
    ) {
      const candidatoFimComBuffer =
        candidato + duracao + BUFFER_MINUTOS

      const conflito = ocupados.some(
        (agendamento) => {
          const dataHora =
            agendamento.dataHoraInicio

          const horaExistente =
            dataHora.split('T')[1]

          const inicioExistente =
            horaParaMinutos(horaExistente)

          const duracaoExistente =
            agendamento.itens.reduce(
              (total, item) =>
                total + item.duracaoMinutos,
              0,
            )

          const fimExistenteComBuffer =
            inicioExistente +
            duracaoExistente +
            BUFFER_MINUTOS

          return (
            candidato < fimExistenteComBuffer &&
            candidatoFimComBuffer > inicioExistente
          )
        },
      )

      const hoje = new Date()

      const dataSelecionada = new Date(
        `${data}T00:00:00`,
      )

      const mesmaDataDeHoje =
        dataSelecionada.getFullYear() ===
        hoje.getFullYear() &&
        dataSelecionada.getMonth() ===
        hoje.getMonth() &&
        dataSelecionada.getDate() ===
        hoje.getDate()

      const minutosAgora =
        hoje.getHours() * 60 +
        hoje.getMinutes()

      const horarioJaPassou =
        mesmaDataDeHoje &&
        candidato <= minutosAgora

      if (!conflito && !horarioJaPassou) {
        opcoes.push(minutosParaHora(candidato))
      }
    }

    return opcoes
  }, [
    data,
    idBarbeiro,
    servicoSelecionado,
    horariosFuncionamento,
    disponibilidades,
    idBarbearia,
    agendamentos,
  ])

  function nomeBarbeiro(barbeiro: Barbeiro) {
    return (
      usuarios.find(
        (usuario) =>
          usuario.idUsuario === barbeiro.idUsuario,
      )?.nome ?? 'Barbeiro'
    )
  }

  function selecionarServico(idSelecionado: number) {
    setIdServico(idSelecionado)
    setIdBarbeiro(null)
    setData('')
    setHora('')
    setErro('')
    setSucesso('')
  }

  function selecionarBarbeiro(idSelecionado: number) {
    setIdBarbeiro(idSelecionado)
    setData('')
    setHora('')
    setErro('')
    setSucesso('')
  }

  const agendamentoCompleto = Boolean(
    idServico &&
    idBarbeiro &&
    data &&
    hora,
  )

  async function confirmarAgendamento() {
    if (!idServico) {
      setErro('Escolha um serviço.')
      return
    }

    if (!idBarbeiro) {
      setErro('Escolha um barbeiro.')
      return
    }

    if (!data) {
      setErro('Escolha uma data.')
      return
    }

    if (!hora) {
      setErro('Escolha um horário.')
      return
    }

    try {
      setEnviando(true)
      setErro('')
      setSucesso('')

      const agendamento = await criarAgendamento({
        idCliente: DEMO_IDS.cliente,
        idBarbearia,
        idBarbeiro,
        dataHoraInicio: `${data}T${hora}:00`,
        itens: [
          {
            idServico,
          },
        ],
      })

      setSucesso(
        `Agendamento #${agendamento.idAgendamento} criado com sucesso.`,
      )

      setHora('')

      const atualizados =
        await listarAgendamentos()

      setAgendamentos(atualizados)
    } catch (error) {
      console.error(error)

      setErro(
        'Não foi possível criar o agendamento.',
      )
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <main className="booking-page">
        <div className="booking-container">
          <p>Carregando opções de agendamento...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="booking-page">
      <section className="booking-header">
        <div className="booking-container">
          <h1>Novo agendamento</h1>

          <p>
            Escolha o serviço, profissional, data e
            horário.
          </p>

          <div className="booking-progress">
            <span
              className={
                idServico
                  ? 'booking-progress__item booking-progress__item--complete'
                  : 'booking-progress__item booking-progress__item--active'
              }
            >
              Serviço
            </span>

            <span
              className={
                idBarbeiro
                  ? 'booking-progress__item booking-progress__item--complete'
                  : 'booking-progress__item'
              }
            >
              Barbeiro
            </span>

            <span
              className={
                data
                  ? 'booking-progress__item booking-progress__item--complete'
                  : 'booking-progress__item'
              }
            >
              Data
            </span>

            <span
              className={
                hora
                  ? 'booking-progress__item booking-progress__item--complete'
                  : 'booking-progress__item'
              }
            >
              Horário
            </span>
          </div>
        </div>
      </section>

      <section className="booking-content">
        <div className="booking-container booking-layout">
          <div className="booking-form">
            {erro && (
              <p className="booking-message booking-message--error">
                {erro}
              </p>
            )}

            {sucesso && (
              <p className="booking-message booking-message--success">
                {sucesso}
              </p>
            )}

            <section className="booking-section">
              <h2>1. Escolha o serviço</h2>

              <div className="booking-options">
                {servicos.map((servico) => {
                  const selecionado =
                    servico.idServico === idServico

                  return (
                    <button
                      className={[
                        'booking-option',
                        selecionado
                          ? 'booking-option--selected'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={servico.idServico}
                      type="button"
                      onClick={() =>
                        selecionarServico(
                          servico.idServico,
                        )
                      }
                    >
                      <span className="booking-option__content">
                        <strong>{servico.nome}</strong>

                        <small>
                          {servico.duracaoMinutos} min •{' '}
                          {formatarPreco(
                            servico.preco,
                          )}
                        </small>
                      </span>

                      <span
                        className={[
                          'booking-option__action',
                          selecionado
                            ? 'booking-option__action--selected'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {selecionado
                          ? 'Selecionado'
                          : 'Selecionar'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="booking-section">
              <h2>2. Escolha o barbeiro</h2>

              {!idServico ? (
                <p className="booking-help">
                  Escolha primeiro um serviço.
                </p>
              ) : barbeirosDisponiveis.length ===
                0 ? (
                <p className="booking-help">
                  Nenhum barbeiro disponível para este
                  serviço.
                </p>
              ) : (
                <div className="booking-options">
                  {barbeirosDisponiveis.map(
                    (barbeiro) => {
                      const selecionado =
                        barbeiro.idBarbeiro ===
                        idBarbeiro

                      return (
                        <button
                          className={[
                            'booking-option',
                            selecionado
                              ? 'booking-option--selected'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          key={barbeiro.idBarbeiro}
                          type="button"
                          onClick={() =>
                            selecionarBarbeiro(
                              barbeiro.idBarbeiro,
                            )
                          }
                        >
                          <span className="booking-option__content">
                            <strong>
                              {nomeBarbeiro(barbeiro)}
                            </strong>

                            {barbeiro.descricao && (
                              <small>
                                {barbeiro.descricao}
                              </small>
                            )}
                          </span>

                          <span
                            className={[
                              'booking-option__action',
                              selecionado
                                ? 'booking-option__action--selected'
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {selecionado
                              ? 'Selecionado'
                              : 'Selecionar'}
                          </span>
                        </button>
                      )
                    },
                  )}
                </div>
              )}
            </section>

            <section className="booking-section">
              <h2>3. Escolha a data</h2>

              <DateInput
                id="booking-date"
                value={data}
                disabled={!idBarbeiro}
                min={
                  new Date()
                    .toISOString()
                    .split('T')[0]
                }
                onChange={(event) => {
                  setData(event.target.value)
                  setHora('')
                  setErro('')
                }}
              />
            </section>

            <section className="booking-section">
              <h2>4. Escolha o horário</h2>

              {!data ? (
                <p className="booking-help">
                  Escolha primeiro uma data.
                </p>
              ) : horariosDisponiveis.length === 0 ? (
                <p className="booking-help">
                  Nenhum horário disponível para esta
                  data.
                </p>
              ) : (
                <div className="booking-times">
                  {horariosDisponiveis.map(
                    (horario) => (
                      <button
                        className={[
                          'booking-time',
                          hora === horario
                            ? 'booking-time--selected'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        key={horario}
                        type="button"
                        onClick={() => {
                          setHora(horario)
                          setErro('')
                        }}
                      >
                        {horario}
                      </button>
                    ),
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="booking-summary">
            <h2>Resumo</h2>

            <dl>
              <div>
                <dt>Serviço</dt>
                <dd>
                  {servicoSelecionado?.nome ?? '—'}
                </dd>
              </div>

              <div>
                <dt>Barbeiro</dt>
                <dd>
                  {barbeiroSelecionado
                    ? nomeBarbeiro(
                      barbeiroSelecionado,
                    )
                    : '—'}
                </dd>
              </div>

              <div>
                <dt>Data</dt>
                <dd>{formatarData(data)}</dd>
              </div>

              <div>
                <dt>Horário</dt>
                <dd>{hora || '—'}</dd>
              </div>

              <div>
                <dt>Total</dt>
                <dd>
                  {servicoSelecionado
                    ? formatarPreco(
                      servicoSelecionado.preco,
                    )
                    : '—'}
                </dd>
              </div>
            </dl>

            <Button
              className={[
                'booking-confirm-button',
                agendamentoCompleto
                  ? 'booking-confirm-button--ready'
                  : 'booking-confirm-button--incomplete',
              ]
                .filter(Boolean)
                .join(' ')}
              fullWidth
              type="button"
              disabled={enviando}
              onClick={confirmarAgendamento}
            >
              {enviando
                ? 'Confirmando...'
                : 'Confirmar agendamento'}
            </Button>
          </aside>
        </div>

        <div className="booking-container booking-back">
          <Link to={`/barbearias/${idBarbearia}`}>
            ← Voltar para a barbearia
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NovoAgendamento
