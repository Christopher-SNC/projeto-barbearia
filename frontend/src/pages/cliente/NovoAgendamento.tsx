import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { listarAgendamentos, criarAgendamento } from '../../services/agendamentoService'
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

const BUFFER_MINUTOS = 15
const ID_CLIENTE_TESTE = 1

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

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
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

function NovoAgendamento() {
  const { id } = useParams()

  const idBarbearia = Number(id)

  const [servicos, setServicos] = useState<Servico[]>([])
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [vinculos, setVinculos] = useState<BarbeiroServico[]>([])
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([])
  const [horariosFuncionamento, setHorariosFuncionamento] = useState<HorarioFuncionamento[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  const [idServico, setIdServico] = useState<number | null>(null)
  const [idBarbeiro, setIdBarbeiro] = useState<number | null>(null)
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
              barbeiro.idBarbearia === idBarbearia &&
              barbeiro.ativo,
          ),
        )

        setUsuarios(dadosUsuarios)
        setVinculos(dadosVinculos)
        setDisponibilidades(dadosDisponibilidades)
        setHorariosFuncionamento(dadosHorarios)
        setAgendamentos(dadosAgendamentos)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os dados do agendamento.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [idBarbearia])

  const servicoSelecionado = servicos.find(
    (servico) => servico.idServico === idServico,
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

    const horarioBarbearia = horariosFuncionamento.find(
      (horario) =>
        horario.idBarbearia === idBarbearia &&
        horario.diaSemana === diaSemana &&
        !horario.fechado,
    )

    const disponibilidadeBarbeiro = disponibilidades.find(
      (disponibilidade) =>
        disponibilidade.idBarbeiro === idBarbeiro &&
        disponibilidade.diaSemana === diaSemana &&
        disponibilidade.ativo,
    )

    if (!horarioBarbearia || !disponibilidadeBarbeiro) {
      return []
    }

    const inicio = Math.max(
      horaParaMinutos(horarioBarbearia.horaAbertura),
      horaParaMinutos(disponibilidadeBarbeiro.horaInicio),
    )

    const fim = Math.min(
      horaParaMinutos(horarioBarbearia.horaFechamento),
      horaParaMinutos(disponibilidadeBarbeiro.horaFim),
    )

    const duracao = servicoSelecionado.duracaoMinutos

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

      const conflito = ocupados.some((agendamento) => {
        const dataHora = agendamento.dataHoraInicio
        const horaExistente = dataHora.split('T')[1]

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
      })

      if (!conflito) {
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

  async function confirmarAgendamento() {
    if (
      !idServico ||
      !idBarbeiro ||
      !data ||
      !hora
    ) {
      setErro('Preencha todas as informações do agendamento.')
      return
    }

    try {
      setEnviando(true)
      setErro('')
      setSucesso('')

      const agendamento = await criarAgendamento({
        idCliente: ID_CLIENTE_TESTE,
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

      const atualizados = await listarAgendamentos()
      setAgendamentos(atualizados)
    } catch (error) {
      console.error(error)
      setErro('Não foi possível criar o agendamento.')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <main className="page">
        <p>Carregando opções de agendamento...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>Novo agendamento</h1>

      {erro && (
        <p className="mensagem-erro">{erro}</p>
      )}

      {sucesso && (
        <p className="mensagem-sucesso">{sucesso}</p>
      )}

      <div className="agendamento-form">
        <label>
          Serviço

          <select
            value={idServico ?? ''}
            onChange={(event) => {
              const valor = Number(event.target.value)

              setIdServico(valor || null)
              setIdBarbeiro(null)
              setData('')
              setHora('')
            }}
          >
            <option value="">
              Selecione um serviço
            </option>

            {servicos.map((servico) => (
              <option
                key={servico.idServico}
                value={servico.idServico}
              >
                {servico.nome} -{' '}
                {formatarPreco(servico.preco)} -{' '}
                {servico.duracaoMinutos} min
              </option>
            ))}
          </select>
        </label>

        <label>
          Barbeiro

          <select
            value={idBarbeiro ?? ''}
            disabled={!idServico}
            onChange={(event) => {
              const valor = Number(event.target.value)

              setIdBarbeiro(valor || null)
              setData('')
              setHora('')
            }}
          >
            <option value="">
              Selecione um barbeiro
            </option>

            {barbeirosDisponiveis.map((barbeiro) => (
              <option
                key={barbeiro.idBarbeiro}
                value={barbeiro.idBarbeiro}
              >
                {nomeBarbeiro(barbeiro)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data

          <input
            type="date"
            value={data}
            disabled={!idBarbeiro}
            min={new Date().toISOString().split('T')[0]}
            onChange={(event) => {
              setData(event.target.value)
              setHora('')
            }}
          />
        </label>

        <label>
          Horário

          <select
            value={hora}
            disabled={!data}
            onChange={(event) =>
              setHora(event.target.value)
            }
          >
            <option value="">
              Selecione um horário
            </option>

            {horariosDisponiveis.map((horario) => (
              <option
                key={horario}
                value={horario}
              >
                {horario}
              </option>
            ))}
          </select>
        </label>

        {data &&
          idBarbeiro &&
          horariosDisponiveis.length === 0 && (
            <p>
              Nenhum horário disponível para esta data.
            </p>
          )}

        <button
          type="button"
          disabled={
            !idServico ||
            !idBarbeiro ||
            !data ||
            !hora ||
            enviando
          }
          onClick={confirmarAgendamento}
        >
          {enviando
            ? 'Confirmando...'
            : 'Confirmar agendamento'}
        </button>
      </div>

      <p>
        <Link to={`/barbearias/${idBarbearia}`}>
          Voltar para a barbearia
        </Link>
      </p>
    </main>
  )
}

export default NovoAgendamento