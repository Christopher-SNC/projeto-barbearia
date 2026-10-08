import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import AdminStatCard from '../../components/AdminStatCard/AdminStatCard'

import useAuth from '../../hooks/useAuth'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarAvaliacoes } from '../../services/avaliacaoService'
import { buscarUsuarioPorId } from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Avaliacao } from '../../types/Avaliacao'
import type { Usuario } from '../../types/Usuario'

import './DashboardBarbeiro.css'

function obterDataLocalISO(data: Date) {
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
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(dataHora))
}

function formatarMedia(valor: number | null) {
    if (valor === null) {
        return '—'
    }

    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
}

function DashboardBarbeiro() {
    const { usuario } = useAuth()

    const idUsuario = usuario?.idUsuario
    const idBarbeiro = usuario?.idBarbeiro
    const idBarbearia = usuario?.idBarbeariaBarbeiro
    const [agendamentos, setAgendamentos] =
        useState<Agendamento[]>([])

    const [avaliacoes, setAvaliacoes] =
        useState<Avaliacao[]>([])

    const [usuarioBarbeiro, setUsuarioBarbeiro] =
        useState<Usuario | null>(null)

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDashboard() {
            try {
                const [
                    dadosAgendamentos,
                    dadosAvaliacoes,
                    dadosUsuario,
                ] = await Promise.all([
                    listarAgendamentos(),
                    listarAvaliacoes(),
                    idUsuario !== undefined
                        ? buscarUsuarioPorId(idUsuario)
                        : Promise.resolve(null),
                ])

                setAgendamentos(
                    dadosAgendamentos,
                )

                setAvaliacoes(
                    dadosAvaliacoes,
                )

                setUsuarioBarbeiro(
                    dadosUsuario,
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar o dashboard.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDashboard()
    }, [idUsuario])

    const agendamentosBarbeiro =
        useMemo(() => {
            return agendamentos.filter(
                (agendamento) =>
                    agendamento.idBarbeiro ===
                    idBarbeiro &&
                    agendamento.idBarbearia ===
                    idBarbearia,
            )
        }, [agendamentos,
            idBarbeiro,
            idBarbearia,])

    const atendimentosHoje =
        useMemo(() => {
            const hoje =
                obterDataLocalISO(new Date())

            return agendamentosBarbeiro.filter(
                (agendamento) =>
                    agendamento.dataHoraInicio.startsWith(
                        hoje,
                    ) &&
                    agendamento.status !==
                    'CANCELADO',
            )
        }, [agendamentosBarbeiro])

    const atendimentosConcluidos =
        useMemo(() => {
            return agendamentosBarbeiro.filter(
                (agendamento) =>
                    agendamento.status ===
                    'CONCLUIDO',
            ).length
        }, [agendamentosBarbeiro])

    const proximosAtendimentos =
        useMemo(() => {
            const agora = new Date()

            return agendamentosBarbeiro
                .filter(
                    (agendamento) =>
                        agendamento.status ===
                        'CONFIRMADO' &&
                        new Date(
                            agendamento.dataHoraInicio,
                        ) >= agora,
                )
                .sort(
                    (a, b) =>
                        new Date(
                            a.dataHoraInicio,
                        ).getTime() -
                        new Date(
                            b.dataHoraInicio,
                        ).getTime(),
                )
        }, [agendamentosBarbeiro])

    const proximosAtendimentosExibidos =
        useMemo(() => {
            return proximosAtendimentos.slice(
                0,
                4,
            )
        }, [proximosAtendimentos])

    const avaliacoesBarbeiro =
        useMemo(() => {
            const idsAgendamentos =
                new Set(
                    agendamentosBarbeiro.map(
                        (agendamento) =>
                            agendamento.idAgendamento,
                    ),
                )

            return avaliacoes.filter(
                (avaliacao) =>
                    idsAgendamentos.has(
                        avaliacao.idAgendamento,
                    ) &&
                    avaliacao.notaBarbeiro !==
                    null,
            )
        }, [
            avaliacoes,
            agendamentosBarbeiro,
        ])

    const mediaAvaliacao =
        useMemo(() => {
            const notas =
                avaliacoesBarbeiro
                    .map(
                        (avaliacao) =>
                            avaliacao.notaBarbeiro,
                    )
                    .filter(
                        (
                            nota,
                        ): nota is number =>
                            nota !== null,
                    )

            if (notas.length === 0) {
                return null
            }

            return (
                notas.reduce(
                    (total, nota) =>
                        total + nota,
                    0,
                ) / notas.length
            )
        }, [avaliacoesBarbeiro])

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

    if (carregando) {
        return (
            <section className="barber-dashboard">
                <p className="barber-dashboard__message">
                    Carregando dashboard...
                </p>
            </section>
        )
    }

    return (
        <section className="barber-dashboard">
            <div className="barber-dashboard__header">
                <div>
                    <h1>
                        Olá,{' '}
                        {usuarioBarbeiro?.nome ??
                            'Barbeiro'}
                    </h1>

                    <p>
                        Acompanhe seus atendimentos
                        e sua agenda.
                    </p>
                </div>
            </div>

            {erro && (
                <p className="barber-dashboard__message barber-dashboard__message--error">
                    {erro}
                </p>
            )}

            <div className="barber-dashboard__stats">
                <AdminStatCard
                    label="Atendimentos hoje"
                    value={
                        atendimentosHoje.length
                    }
                    hint="agenda do dia"
                />

                <AdminStatCard
                    label="Próximos"
                    value={
                        proximosAtendimentos.length
                    }
                    hint="confirmados"
                />

                <AdminStatCard
                    label="Concluídos"
                    value={
                        atendimentosConcluidos
                    }
                    hint="total de atendimentos"
                />

                <AdminStatCard
                    label="Minha avaliação"
                    value={
                        mediaAvaliacao === null
                            ? '—'
                            : `${formatarMedia(
                                mediaAvaliacao,
                            )} / 5`
                    }
                    hint={`${avaliacoesBarbeiro.length} ${avaliacoesBarbeiro.length ===
                        1
                        ? 'avaliação'
                        : 'avaliações'
                        }`}
                />
            </div>

            <section className="barber-dashboard__appointments">
                <div className="barber-dashboard__section-header">
                    <div>
                        <h2>
                            Próximos atendimentos
                        </h2>

                        <p>
                            Seus próximos horários
                            confirmados
                        </p>
                    </div>
                </div>

                {proximosAtendimentos.length ===
                    0 ? (
                    <div className="barber-dashboard__empty">
                        <strong>
                            Nenhum atendimento
                            próximo
                        </strong>

                        <span>
                            Você não possui
                            agendamentos confirmados
                            para os próximos horários.
                        </span>
                    </div>
                ) : (
                    <div className="barber-dashboard__appointment-list">
                        {proximosAtendimentosExibidos.map(
                            (agendamento) => (
                                <article
                                    className="barber-dashboard__appointment"
                                    key={
                                        agendamento.idAgendamento
                                    }
                                >
                                    <div className="barber-dashboard__appointment-time">
                                        <strong>
                                            {formatarHora(
                                                agendamento.dataHoraInicio,
                                            )}
                                        </strong>

                                        <span>
                                            {formatarData(
                                                agendamento.dataHoraInicio,
                                            )}
                                        </span>
                                    </div>

                                    <div className="barber-dashboard__appointment-info">
                                        <strong>
                                            {agendamento.nomeCliente || 'Cliente'}
                                        </strong>

                                        <span>
                                            {nomeServicos(
                                                agendamento,
                                            )}
                                        </span>
                                    </div>

                                    <span className="barber-dashboard__status">
                                        Confirmado
                                    </span>
                                </article>
                            ),
                        )}
                    </div>
                )}
            </section>
        </section>
    )
}

export default DashboardBarbeiro