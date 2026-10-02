import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import StatusBadge from '../../components/StatusBadge/StatusBadge'

import { DEMO_IDS } from '../../config/demo'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarUsuarios } from '../../services/usuarioService'

import type {
    Agendamento,
    StatusAgendamento,
} from '../../types/Agendamento'
import type { Usuario } from '../../types/Usuario'

import './AgendamentosBarbeiro.css'

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
    ).padStart(2, '0')
    const dia = String(
        data.getDate(),
    ).padStart(2, '0')

    return `${ano}-${mes}-${dia}`
}

function formatarHora(dataHora: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dataHora))
}

function formatarData(dataHora: string) {
    return new Intl.DateTimeFormat(
        'pt-BR',
    ).format(new Date(dataHora))
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

function AgendamentosBarbeiro() {
    const [filtro, setFiltro] =
        useState<FiltroAgendamento>('hoje')

    const [agendamentos, setAgendamentos] =
        useState<Agendamento[]>([])

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    dadosAgendamentos,
                    dadosUsuarios,
                ] = await Promise.all([
                    listarAgendamentos(),
                    listarUsuarios(),
                ])

                setAgendamentos(
                    dadosAgendamentos.filter(
                        (agendamento) =>
                            agendamento.idBarbearia ===
                            DEMO_IDS.barbearia &&
                            agendamento.idBarbeiro ===
                            DEMO_IDS.barbeiro,
                    ),
                )

                setUsuarios(dadosUsuarios)
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar seus agendamentos.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

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
                                return agendamento.dataHoraInicio.startsWith(
                                    hoje,
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
                        filtro ===
                        'concluidos' ||
                        filtro ===
                        'cancelados' ||
                        filtro ===
                        'nao-compareceu'
                    ) {
                        return dataB - dataA
                    }

                    return dataA - dataB
                },
            )
        }, [agendamentos, filtro])

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

    function formatarDuracao(
        agendamento: Agendamento,
    ) {
        const duracao =
            agendamento.itens.reduce(
                (total, item) =>
                    total +
                    item.duracaoMinutos,
                0,
            )

        if (duracao === 0) {
            return ''
        }

        return `${duracao} min`
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
        <section className="barber-appointments">
            <div className="barber-appointments__top">
                <h1>Meus Agendamentos</h1>

                <p>
                    Acompanhe seus atendimentos e
                    histórico.
                </p>
            </div>

            <div className="barber-appointments__filters">
                {filtros.map((item) => (
                    <button
                        className={[
                            'barber-appointments__filter',
                            filtro === item.id
                                ? 'barber-appointments__filter--active'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        key={item.id}
                        type="button"
                        onClick={() =>
                            setFiltro(item.id)
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {erro && (
                <p className="barber-appointments__message barber-appointments__message--error">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="barber-appointments__message">
                    Carregando agendamentos...
                </p>
            ) : (
                <>
                    <section className="barber-appointments__desktop">
                        <div className="barber-appointments__table">
                            <div className="barber-appointments__table-header">
                                <div>
                                    <h2>
                                        {tituloLista()}
                                    </h2>

                                    <p>
                                        {
                                            agendamentosFiltrados.length
                                        }{' '}
                                        {agendamentosFiltrados.length ===
                                            1
                                            ? 'registro'
                                            : 'registros'}
                                    </p>
                                </div>
                            </div>

                            {agendamentosFiltrados.length ===
                                0 ? (
                                <div className="barber-appointments__empty">
                                    <strong>
                                        Nenhum
                                        agendamento
                                        encontrado
                                    </strong>

                                    <span>
                                        Não existem
                                        registros para
                                        este filtro.
                                    </span>
                                </div>
                            ) : (
                                <div className="barber-appointments__rows">
                                    {agendamentosFiltrados.map(
                                        (
                                            agendamento,
                                        ) => (
                                            <article
                                                className="barber-appointments__row"
                                                key={
                                                    agendamento.idAgendamento
                                                }
                                            >
                                                <div className="barber-appointments__primary">
                                                    <strong>
                                                        {formatarHora(
                                                            agendamento.dataHoraInicio,
                                                        )}{' '}
                                                        •{' '}
                                                        {nomeCliente(
                                                            agendamento.idCliente,
                                                        )}
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

                                                <div className="barber-appointments__service">
                                                    <strong>
                                                        {nomeServicos(
                                                            agendamento,
                                                        )}
                                                    </strong>

                                                    {formatarDuracao(
                                                        agendamento,
                                                    ) && (
                                                            <span>
                                                                {formatarDuracao(
                                                                    agendamento,
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
                                            </article>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="barber-appointments__mobile">
                        <h2>
                            {tituloLista()}
                        </h2>

                        <p className="barber-appointments__count">
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
                            <div className="barber-appointments__empty">
                                <strong>
                                    Nenhum
                                    agendamento
                                    encontrado
                                </strong>

                                <span>
                                    Não existem
                                    registros para este
                                    filtro.
                                </span>
                            </div>
                        ) : (
                            <div className="barber-appointments__cards">
                                {agendamentosFiltrados.map(
                                    (
                                        agendamento,
                                    ) => (
                                        <article
                                            className="barber-appointments__card"
                                            key={
                                                agendamento.idAgendamento
                                            }
                                        >
                                            <div className="barber-appointments__card-top">
                                                <div>
                                                    <strong>
                                                        {formatarHora(
                                                            agendamento.dataHoraInicio,
                                                        )}{' '}
                                                        •{' '}
                                                        {nomeCliente(
                                                            agendamento.idCliente,
                                                        )}
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

                                                <StatusBadge
                                                    variant={obterStatusVariant(
                                                        agendamento.status,
                                                    )}
                                                >
                                                    {obterStatusLabel(
                                                        agendamento.status,
                                                    )}
                                                </StatusBadge>
                                            </div>

                                            <div className="barber-appointments__card-service">
                                                <strong>
                                                    {nomeServicos(
                                                        agendamento,
                                                    )}
                                                </strong>

                                                {formatarDuracao(
                                                    agendamento,
                                                ) && (
                                                        <span>
                                                            {formatarDuracao(
                                                                agendamento,
                                                            )}
                                                        </span>
                                                    )}
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        )}
                    </section>
                </>
            )}
        </section>
    )
}

export default AgendamentosBarbeiro