import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import DateInput from '../../components/DateInput/DateInput'

import { DEMO_IDS } from '../../config/demo'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarDisponibilidades } from '../../services/disponibilidadeService'
import { listarHorariosFuncionamento } from '../../services/horarioFuncionamentoService'
import { listarUsuarios } from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Disponibilidade } from '../../types/Disponibilidade'
import type { HorarioFuncionamento } from '../../types/HorarioFuncionamento'
import type { Usuario } from '../../types/Usuario'

import './AgendaBarbeiro.css'

const INTERVALO_GRADE = 15
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

function dataAtualISO() {
    const data = new Date()

    const ano = data.getFullYear()
    const mes = String(
        data.getMonth() + 1,
    ).padStart(2, '0')
    const dia = String(
        data.getDate(),
    ).padStart(2, '0')

    return `${ano}-${mes}-${dia}`
}

function horaParaMinutos(hora: string) {
    const [horas, minutos] = hora
        .substring(0, 5)
        .split(':')
        .map(Number)

    return horas * 60 + minutos
}

function minutosParaHora(total: number) {
    const horas = Math.floor(total / 60)
    const minutos = total % 60

    return `${String(horas).padStart(
        2,
        '0',
    )}:${String(minutos).padStart(2, '0')}`
}

function obterDiaSemana(data: string) {
    return diasSemana[
        new Date(`${data}T12:00:00`).getDay()
    ]
}

function formatarDataTitulo(data: string) {
    const dataLocal = new Date(
        `${data}T12:00:00`,
    )

    const texto =
        new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
        }).format(dataLocal)

    return (
        texto.charAt(0).toUpperCase() +
        texto.slice(1)
    )
}

function AgendaBarbeiro() {
    const [data, setData] = useState(
        dataAtualISO(),
    )

    const [agendamentos, setAgendamentos] =
        useState<Agendamento[]>([])

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([])

    const [
        disponibilidades,
        setDisponibilidades,
    ] = useState<Disponibilidade[]>([])

    const [
        horariosFuncionamento,
        setHorariosFuncionamento,
    ] = useState<HorarioFuncionamento[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    dadosAgendamentos,
                    dadosUsuarios,
                    dadosDisponibilidades,
                    dadosHorarios,
                ] = await Promise.all([
                    listarAgendamentos(),
                    listarUsuarios(),
                    listarDisponibilidades(),
                    listarHorariosFuncionamento(),
                ])

                setAgendamentos(
                    dadosAgendamentos,
                )

                setUsuarios(dadosUsuarios)

                setDisponibilidades(
                    dadosDisponibilidades,
                )

                setHorariosFuncionamento(
                    dadosHorarios,
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar sua agenda.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const diaSemana = obterDiaSemana(data)

    const horarioBarbearia = useMemo(() => {
        return horariosFuncionamento.find(
            (horario) =>
                horario.idBarbearia ===
                DEMO_IDS.barbearia &&
                horario.diaSemana ===
                diaSemana,
        )
    }, [
        horariosFuncionamento,
        diaSemana,
    ])

    const disponibilidadeBarbeiro =
        useMemo(() => {
            return disponibilidades.find(
                (disponibilidade) =>
                    disponibilidade.idBarbeiro ===
                    DEMO_IDS.barbeiro &&
                    disponibilidade.diaSemana ===
                    diaSemana &&
                    disponibilidade.ativo,
            )
        }, [
            disponibilidades,
            diaSemana,
        ])

    const agendamentosDoDia =
        useMemo(() => {
            return agendamentos.filter(
                (agendamento) =>
                    agendamento.idBarbearia ===
                    DEMO_IDS.barbearia &&
                    agendamento.idBarbeiro ===
                    DEMO_IDS.barbeiro &&
                    agendamento.status ===
                    'CONFIRMADO' &&
                    agendamento.dataHoraInicio.startsWith(
                        data,
                    ),
            )
        }, [
            agendamentos,
            data,
        ])

    const horariosGrade = useMemo(() => {
        if (
            !horarioBarbearia ||
            horarioBarbearia.fechado ||
            !horarioBarbearia.horaAbertura ||
            !horarioBarbearia.horaFechamento
        ) {
            return []
        }

        const inicio = horaParaMinutos(
            horarioBarbearia.horaAbertura,
        )

        const fim = horaParaMinutos(
            horarioBarbearia.horaFechamento,
        )

        const horarios = new Set<number>()

        for (
            let atual = inicio;
            atual < fim;
            atual += INTERVALO_GRADE
        ) {
            horarios.add(atual)
        }

        agendamentosDoDia.forEach(
            (agendamento) => {
                const hora =
                    agendamento.dataHoraInicio.split(
                        'T',
                    )[1]

                horarios.add(
                    horaParaMinutos(hora),
                )
            },
        )

        return Array.from(horarios)
            .sort((a, b) => a - b)
            .map(minutosParaHora)
    }, [
        horarioBarbearia,
        agendamentosDoDia,
    ])

    function barbeiroEstaDisponivel(
        horario: string,
    ) {
        if (
            !horarioBarbearia ||
            horarioBarbearia.fechado ||
            !horarioBarbearia.horaAbertura ||
            !horarioBarbearia.horaFechamento ||
            !disponibilidadeBarbeiro
        ) {
            return false
        }

        const minutos =
            horaParaMinutos(horario)

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

        return (
            minutos >= inicio &&
            minutos < fim
        )
    }

    function buscarAgendamento(
        horario: string,
    ) {
        return agendamentosDoDia.find(
            (agendamento) => {
                const horaAgendamento =
                    agendamento.dataHoraInicio
                        .split('T')[1]
                        .substring(0, 5)

                return (
                    horaAgendamento === horario
                )
            },
        )
    }

    function buscarBloqueioPorAgendamento(
        horario: string,
    ) {
        const minutosHorario =
            horaParaMinutos(horario)

        return agendamentosDoDia.find(
            (agendamento) => {
                const horaInicio =
                    agendamento.dataHoraInicio
                        .split('T')[1]
                        .substring(0, 5)

                const inicio =
                    horaParaMinutos(horaInicio)

                const duracao =
                    agendamento.itens.reduce(
                        (total, item) =>
                            total +
                            item.duracaoMinutos,
                        0,
                    )

                const fimComBuffer =
                    inicio +
                    duracao +
                    BUFFER_MINUTOS

                return (
                    minutosHorario > inicio &&
                    minutosHorario <
                    fimComBuffer
                )
            },
        )
    }

    function nomeCliente(
        idCliente: number,
    ) {
        return (
            usuarios.find(
                (usuario) =>
                    usuario.idUsuario ===
                    idCliente,
            )?.nome ?? 'Cliente'
        )
    }

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

    function textoDisponibilidade() {
        if (!disponibilidadeBarbeiro) {
            return 'Sem disponibilidade cadastrada para este dia'
        }

        return `Sua disponibilidade: ${disponibilidadeBarbeiro.horaInicio.substring(
            0,
            5,
        )} às ${disponibilidadeBarbeiro.horaFim.substring(
            0,
            5,
        )}`
    }

    return (
        <section className="barber-agenda">
            <div className="barber-agenda__top">
                <div className="barber-agenda__heading">
                    <h1>Minha Agenda</h1>

                    <p>
                        Visualize seus horários e
                        atendimentos.
                    </p>

                    <DateInput
                        value={data}
                        onChange={(event) =>
                            setData(
                                event.target.value,
                            )
                        }
                    />
                </div>
            </div>

            {erro && (
                <p className="barber-agenda__message barber-agenda__message--error">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="barber-agenda__message">
                    Carregando agenda...
                </p>
            ) : (
                <section className="barber-agenda__card">
                    <div className="barber-agenda__card-header">
                        <h2>
                            {formatarDataTitulo(
                                data,
                            )}
                        </h2>

                        <p>
                            {textoDisponibilidade()}
                        </p>
                    </div>

                    {!horarioBarbearia ||
                        horarioBarbearia.fechado ? (
                        <div className="barber-agenda__empty">
                            <strong>
                                Barbearia fechada
                            </strong>

                            <span>
                                A barbearia não possui
                                expediente nesta data.
                            </span>
                        </div>
                    ) : horariosGrade.length ===
                        0 ? (
                        <div className="barber-agenda__empty">
                            <strong>
                                Nenhum horário
                                disponível
                            </strong>

                            <span>
                                Não existem horários
                                cadastrados para esta
                                data.
                            </span>
                        </div>
                    ) : (
                        <div className="barber-agenda__schedule">
                            <div className="barber-agenda__schedule-header">
                                <span>Horário</span>

                                <span>
                                    Situação
                                </span>
                            </div>

                            {horariosGrade.map(
                                (horario) => {
                                    const agendamento =
                                        buscarAgendamento(
                                            horario,
                                        )

                                    const bloqueio =
                                        agendamento
                                            ? undefined
                                            : buscarBloqueioPorAgendamento(
                                                horario,
                                            )

                                    const disponivel =
                                        barbeiroEstaDisponivel(
                                            horario,
                                        )

                                    return (
                                        <div
                                            className="barber-agenda__row"
                                            key={
                                                horario
                                            }
                                        >
                                            <strong className="barber-agenda__time">
                                                {
                                                    horario
                                                }
                                            </strong>

                                            <div
                                                className={[
                                                    'barber-agenda__slot',
                                                    agendamento
                                                        ? 'barber-agenda__slot--booked'
                                                        : '',
                                                    !agendamento &&
                                                        (bloqueio ||
                                                            !disponivel)
                                                        ? 'barber-agenda__slot--unavailable'
                                                        : '',
                                                ]
                                                    .filter(
                                                        Boolean,
                                                    )
                                                    .join(
                                                        ' ',
                                                    )}
                                            >
                                                {agendamento ? (
                                                    <>
                                                        <div className="barber-agenda__slot-top">
                                                            <strong>
                                                                {nomeCliente(
                                                                    agendamento.idCliente,
                                                                )}
                                                            </strong>

                                                            <span className="barber-agenda__pill">
                                                                Agendado
                                                            </span>
                                                        </div>

                                                        <span>
                                                            {nomeServicos(
                                                                agendamento,
                                                            )}
                                                        </span>
                                                    </>
                                                ) : bloqueio ? (
                                                    <>
                                                        <strong>
                                                            Ocupado
                                                        </strong>

                                                        <span>
                                                            Atendimento em andamento
                                                            ou intervalo
                                                        </span>
                                                    </>
                                                ) : disponivel ? (
                                                    <>
                                                        <strong>
                                                            Livre
                                                        </strong>

                                                        <span>
                                                            Horário disponível
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>
                                                            Indisponível
                                                        </strong>

                                                        <span>
                                                            Fora da sua
                                                            disponibilidade
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                },
                            )}
                        </div>
                    )}
                </section>
            )}
        </section>
    )
}

export default AgendaBarbeiro