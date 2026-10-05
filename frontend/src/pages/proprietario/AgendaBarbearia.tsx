import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import DateInput from '../../components/DateInput/DateInput'

import useBarbeariaProprietario from '../../hooks/useBarbeariaProprietario'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarBarbeiros } from '../../services/barbeiroService'
import { listarDisponibilidades } from '../../services/disponibilidadeService'
import { listarHorariosFuncionamento } from '../../services/horarioFuncionamentoService'
import { listarUsuarios } from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Barbeiro } from '../../types/Barbeiro'
import type { Disponibilidade } from '../../types/Disponibilidade'
import type { HorarioFuncionamento } from '../../types/HorarioFuncionamento'
import type { Usuario } from '../../types/Usuario'

import './AgendaBarbearia.css'

const INTERVALO_GRADE = 30

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
        new Intl.DateTimeFormat(
            'pt-BR',
            {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
            },
        ).format(dataLocal)

    return (
        texto.charAt(0).toUpperCase() +
        texto.slice(1)
    )
}

function AgendaBarbearia() {
    const idBarbearia =
        useBarbeariaProprietario()

    const [data, setData] = useState(
        dataAtualISO(),
    )

    const [filtroBarbeiro, setFiltroBarbeiro] =
        useState('todos')

    const [agendamentos, setAgendamentos] = useState<
        Agendamento[]
    >([])

    const [barbeiros, setBarbeiros] = useState<
        Barbeiro[]
    >([])

    const [usuarios, setUsuarios] = useState<
        Usuario[]
    >([])

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
                    dadosBarbeiros,
                    dadosUsuarios,
                    dadosDisponibilidades,
                    dadosHorarios,
                ] = await Promise.all([
                    listarAgendamentos(),
                    listarBarbeiros(),
                    listarUsuarios(),
                    listarDisponibilidades(),
                    listarHorariosFuncionamento(),
                ])

                setAgendamentos(
                    dadosAgendamentos,
                )

                setBarbeiros(
                    dadosBarbeiros.filter(
                        (barbeiro) =>
                            barbeiro.idBarbearia ===
                            idBarbearia &&
                            barbeiro.ativo,
                    ),
                )

                setUsuarios(
                    dadosUsuarios,
                )

                setDisponibilidades(
                    dadosDisponibilidades,
                )

                setHorariosFuncionamento(
                    dadosHorarios,
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar a agenda.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [idBarbearia])

    const diaSemana =
        obterDiaSemana(data)

    const horarioBarbearia = useMemo(() => {
        return horariosFuncionamento.find(
            (horario) =>
                horario.idBarbearia ===
                idBarbearia &&
                horario.diaSemana ===
                diaSemana,
        )
    }, [
        horariosFuncionamento,
        diaSemana,
        idBarbearia,
    ])

    const agendamentosDoDia = useMemo(() => {
        return agendamentos.filter(
            (agendamento) =>
                agendamento.idBarbearia ===
                idBarbearia &&
                agendamento.status ===
                'CONFIRMADO' &&
                agendamento.dataHoraInicio.startsWith(
                    data,
                ),
        )
    }, [
        agendamentos,
        data,
        idBarbearia,
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

        const inicio =
            horaParaMinutos(
                horarioBarbearia.horaAbertura,
            )

        const fim =
            horaParaMinutos(
                horarioBarbearia.horaFechamento,
            )

        const horarios =
            new Set<number>()

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
            .sort(
                (a, b) => a - b,
            )
            .map(minutosParaHora)
    }, [
        horarioBarbearia,
        agendamentosDoDia,
    ])

    function nomeUsuario(
        idUsuario: number,
    ) {
        return (
            usuarios.find(
                (usuario) =>
                    usuario.idUsuario ===
                    idUsuario,
            )?.nome ?? 'Usuário'
        )
    }

    function nomeBarbeiro(
        barbeiro: Barbeiro,
    ) {
        return nomeUsuario(
            barbeiro.idUsuario,
        )
    }

    function barbeiroEstaDisponivel(
        idBarbeiro: number,
        horario: string,
    ) {
        const disponibilidade =
            disponibilidades.find(
                (item) =>
                    item.idBarbeiro ===
                    idBarbeiro &&
                    item.diaSemana ===
                    diaSemana &&
                    item.ativo,
            )

        if (
            !horarioBarbearia ||
            horarioBarbearia.fechado ||
            !horarioBarbearia.horaAbertura ||
            !horarioBarbearia.horaFechamento ||
            !disponibilidade
        ) {
            return false
        }

        const minutos =
            horaParaMinutos(
                horario,
            )

        const inicio = Math.max(
            horaParaMinutos(
                horarioBarbearia.horaAbertura,
            ),
            horaParaMinutos(
                disponibilidade.horaInicio,
            ),
        )

        const fim = Math.min(
            horaParaMinutos(
                horarioBarbearia.horaFechamento,
            ),
            horaParaMinutos(
                disponibilidade.horaFim,
            ),
        )

        return (
            minutos >= inicio &&
            minutos < fim
        )
    }

    function buscarAgendamento(
        idBarbeiro: number,
        horario: string,
    ) {
        return agendamentosDoDia.find(
            (agendamento) => {
                if (
                    agendamento.idBarbeiro !==
                    idBarbeiro
                ) {
                    return false
                }

                const horaAgendamento =
                    agendamento.dataHoraInicio
                        .split('T')[1]
                        .substring(0, 5)

                return (
                    horaAgendamento ===
                    horario
                )
            },
        )
    }

    function nomeServicos(
        agendamento: Agendamento,
    ) {
        return agendamento.itens
            .map(
                (item) =>
                    item.nomeServico,
            )
            .join(' + ')
    }

    const barbeirosMobile =
        useMemo(() => {
            if (
                filtroBarbeiro ===
                'todos'
            ) {
                return barbeiros
            }

            return barbeiros.filter(
                (barbeiro) =>
                    barbeiro.idBarbeiro ===
                    Number(
                        filtroBarbeiro,
                    ),
            )
        }, [
            barbeiros,
            filtroBarbeiro,
        ])

    const agendaMobile =
        horariosGrade
            .map((horario) => {
                const candidatos =
                    barbeirosMobile.map(
                        (barbeiro) => {
                            const agendamento =
                                buscarAgendamento(
                                    barbeiro.idBarbeiro,
                                    horario,
                                )

                            return {
                                horario,
                                barbeiro,
                                agendamento,
                                disponivel:
                                    barbeiroEstaDisponivel(
                                        barbeiro.idBarbeiro,
                                        horario,
                                    ),
                            }
                        },
                    )

                const agendado =
                    candidatos.find(
                        (item) =>
                            item.agendamento,
                    )

                if (agendado) {
                    return agendado
                }

                return candidatos.find(
                    (item) =>
                        item.disponivel,
                )
            })
            .filter(
                (
                    item,
                ): item is NonNullable<
                    typeof item
                > => Boolean(item),
            )

    return (
        <section className="admin-agenda">
            <div className="admin-agenda__top">
                <div className="admin-agenda__heading">
                    <h1>Agenda</h1>

                    <p>
                        Visualize horários e ocupação dos
                        barbeiros
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

            <div className="admin-agenda__mobile-filter">
                <select
                    value={filtroBarbeiro}
                    onChange={(event) =>
                        setFiltroBarbeiro(
                            event.target.value,
                        )
                    }
                >
                    <option value="todos">
                        Todos os barbeiros
                    </option>

                    {barbeiros.map(
                        (barbeiro) => (
                            <option
                                key={
                                    barbeiro.idBarbeiro
                                }
                                value={
                                    barbeiro.idBarbeiro
                                }
                            >
                                {nomeBarbeiro(
                                    barbeiro,
                                )}
                            </option>
                        ),
                    )}
                </select>
            </div>

            {erro && (
                <p className="admin-agenda__message">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="admin-agenda__message">
                    Carregando agenda...
                </p>
            ) : (
                <>
                    <div className="admin-agenda__desktop">
                        <div className="admin-agenda__grid-card">
                            <h2>
                                {formatarDataTitulo(
                                    data,
                                )}
                            </h2>

                            <p className="admin-agenda__subtitle">
                                {barbeiros.length}{' '}
                                {barbeiros.length ===
                                    1
                                    ? 'barbeiro ativo'
                                    : 'barbeiros ativos'}
                            </p>

                            {!horarioBarbearia ||
                                horarioBarbearia.fechado ? (
                                <p className="admin-agenda__empty">
                                    A barbearia está
                                    fechada nesta data.
                                </p>
                            ) : (
                                <div className="admin-agenda__table-scroll">
                                    <div
                                        className="admin-agenda__table"
                                        style={{
                                            gridTemplateColumns: `90px repeat(${barbeiros.length}, minmax(190px, 1fr))`,
                                            width: '100%',
                                            minWidth: `${90 + barbeiros.length * 190}px`,
                                        }}
                                    >
                                        <div className="admin-agenda__table-header">
                                            Horário
                                        </div>

                                        {barbeiros.map(
                                            (
                                                barbeiro,
                                            ) => (
                                                <div
                                                    className="admin-agenda__table-header admin-agenda__table-header--barber"
                                                    key={
                                                        barbeiro.idBarbeiro
                                                    }
                                                >
                                                    {nomeBarbeiro(
                                                        barbeiro,
                                                    )}
                                                </div>
                                            ),
                                        )}

                                        {horariosGrade.map(
                                            (
                                                horario,
                                            ) => (
                                                <div
                                                    className="admin-agenda__row"
                                                    key={
                                                        horario
                                                    }
                                                    style={{
                                                        gridColumn:
                                                            '1 / -1',
                                                        display:
                                                            'grid',
                                                        gridTemplateColumns: `90px repeat(${barbeiros.length}, minmax(190px, 1fr))`,
                                                    }}
                                                >
                                                    <div className="admin-agenda__time">
                                                        {
                                                            horario
                                                        }
                                                    </div>

                                                    {barbeiros.map(
                                                        (
                                                            barbeiro,
                                                        ) => {
                                                            const agendamento =
                                                                buscarAgendamento(
                                                                    barbeiro.idBarbeiro,
                                                                    horario,
                                                                )

                                                            const disponivel =
                                                                barbeiroEstaDisponivel(
                                                                    barbeiro.idBarbeiro,
                                                                    horario,
                                                                )

                                                            return (
                                                                <div
                                                                    className={[
                                                                        'admin-agenda__slot',
                                                                        agendamento
                                                                            ? 'admin-agenda__slot--booked'
                                                                            : '',
                                                                        !agendamento &&
                                                                            !disponivel
                                                                            ? 'admin-agenda__slot--unavailable'
                                                                            : '',
                                                                    ]
                                                                        .filter(
                                                                            Boolean,
                                                                        )
                                                                        .join(
                                                                            ' ',
                                                                        )}
                                                                    key={
                                                                        barbeiro.idBarbeiro
                                                                    }
                                                                >
                                                                    {agendamento ? (
                                                                        <>
                                                                            <strong>
                                                                                Agendado
                                                                            </strong>

                                                                            <span>
                                                                                {nomeUsuario(
                                                                                    agendamento.idCliente,
                                                                                )}
                                                                            </span>

                                                                            <small>
                                                                                {nomeServicos(
                                                                                    agendamento,
                                                                                )}
                                                                            </small>
                                                                        </>
                                                                    ) : disponivel ? (
                                                                        <strong>
                                                                            Livre
                                                                        </strong>
                                                                    ) : (
                                                                        <strong>
                                                                            Indisponível
                                                                        </strong>
                                                                    )}
                                                                </div>
                                                            )
                                                        },
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="admin-agenda__mobile">
                        <h2>
                            {formatarDataTitulo(
                                data,
                            )}
                        </h2>

                        <p className="admin-agenda__subtitle">
                            {barbeiros.length}{' '}
                            {barbeiros.length === 1
                                ? 'barbeiro ativo'
                                : 'barbeiros ativos'}
                        </p>

                        {!horarioBarbearia ||
                            horarioBarbearia.fechado ? (
                            <p className="admin-agenda__empty">
                                A barbearia está
                                fechada nesta data.
                            </p>
                        ) : agendaMobile.length ===
                            0 ? (
                            <p className="admin-agenda__empty">
                                Nenhum horário
                                disponível nesta data.
                            </p>
                        ) : (
                            <div className="admin-agenda__mobile-list">
                                {agendaMobile.map(
                                    (item) => (
                                        <article
                                            className="admin-agenda__mobile-item"
                                            key={`${item.horario}-${item.barbeiro.idBarbeiro}`}
                                        >
                                            <div className="admin-agenda__mobile-item-top">
                                                <strong>
                                                    {
                                                        item.horario
                                                    }{' '}
                                                    •{' '}
                                                    {item.agendamento
                                                        ? nomeUsuario(
                                                            item
                                                                .agendamento
                                                                .idCliente,
                                                        )
                                                        : 'Livre'}
                                                </strong>

                                                {item.agendamento && (
                                                    <span className="admin-agenda__pill">
                                                        Agendado
                                                    </span>
                                                )}
                                            </div>

                                            <p>
                                                {nomeBarbeiro(
                                                    item.barbeiro,
                                                )}

                                                {item.agendamento &&
                                                    ` • ${nomeServicos(
                                                        item.agendamento,
                                                    )}`}
                                            </p>
                                        </article>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}

export default AgendaBarbearia