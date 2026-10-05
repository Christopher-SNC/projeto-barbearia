import {
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import AdminStatCard from '../../components/AdminStatCard/AdminStatCard'
import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'

import { listarAgendamentos } from '../../services/agendamentoService'
import { buscarBarbeariaPorId } from '../../services/barbeariaService'
import { listarBarbeiros } from '../../services/barbeiroService'
import { listarUsuarios } from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Barbearia } from '../../types/Barbearia'
import type { Barbeiro } from '../../types/Barbeiro'
import type { Usuario } from '../../types/Usuario'

import './DashboardProprietario.css'

import useBarbeariaProprietario from '../../hooks/useBarbeariaProprietario'

import { listarAvaliacoes } from '../../services/avaliacaoService'
import type { Avaliacao } from '../../types/Avaliacao'

function obterDataLocalISO(data: Date) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(
        2,
        '0',
    )
    const dia = String(data.getDate()).padStart(
        2,
        '0',
    )

    return `${ano}-${mes}-${dia}`
}

function obterChaveMes(data: Date) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(
        2,
        '0',
    )

    return `${ano}-${mes}`
}

function formatarHora(dataHora: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dataHora))
}

function formatarDataAvaliacao(data: string) {
    return new Intl.DateTimeFormat('pt-BR').format(
        new Date(data),
    )
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(valor)
}

function formatarDiferenca(
    valorAtual: number,
    valorAnterior: number,
    sufixo = '',
) {
    const diferenca = valorAtual - valorAnterior

    if (diferenca === 0) {
        return `Mesmo que ${sufixo || 'antes'}`
    }

    return `${diferenca > 0 ? '+' : ''
        }${diferenca} ${sufixo}`.trim()
}

function DashboardProprietario() {
    const navigate = useNavigate()

    const idBarbearia =
        useBarbeariaProprietario()

    const [agendamentos, setAgendamentos] = useState<
        Agendamento[]
    >([])

    const [avaliacoes, setAvaliacoes] = useState<
        Avaliacao[]
    >([])

    const [barbeariaAtual, setBarbeariaAtual] =
        useState<Barbearia | null>(null)

    const [barbeiros, setBarbeiros] = useState<
        Barbeiro[]
    >([])

    const [usuarios, setUsuarios] = useState<Usuario[]>(
        [],
    )

    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDashboard() {
            try {
                const [
                    dadosAgendamentos,
                    dadosAvaliacoes,
                    dadosBarbearia,
                    dadosBarbeiros,
                    dadosUsuarios,
                ] = await Promise.all([
                    listarAgendamentos(),
                    listarAvaliacoes(),
                    buscarBarbeariaPorId(idBarbearia),
                    listarBarbeiros(),
                    listarUsuarios(),
                ])

                setAgendamentos(dadosAgendamentos)
                setAvaliacoes(dadosAvaliacoes)
                setBarbeariaAtual(dadosBarbearia)
                setBarbeiros(dadosBarbeiros)
                setUsuarios(dadosUsuarios)
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
    }, [idBarbearia])

    const agendamentosBarbearia = useMemo(() => {
        if (!barbeariaAtual) {
            return []
        }

        return agendamentos.filter(
            (agendamento) =>
                agendamento.idBarbearia ===
                barbeariaAtual.idBarbearia,
        )
    }, [agendamentos, barbeariaAtual])

    const avaliacoesBarbearia = useMemo(() => {
        const idsAgendamentos = new Set(
            agendamentosBarbearia.map(
                (agendamento) =>
                    agendamento.idAgendamento,
            ),
        )

        return avaliacoes.filter((avaliacao) =>
            idsAgendamentos.has(
                avaliacao.idAgendamento,
            ),
        )
    }, [avaliacoes, agendamentosBarbearia])


    const avaliacaoMedia = useMemo(() => {
        if (avaliacoesBarbearia.length === 0) {
            return null
        }

        const soma = avaliacoesBarbearia.reduce(
            (total, avaliacao) =>
                total + avaliacao.notaBarbearia,
            0,
        )

        return soma / avaliacoesBarbearia.length
    }, [avaliacoesBarbearia])

    const avaliacoesRecentes = useMemo(() => {
        return [...avaliacoesBarbearia]
            .sort(
                (a, b) =>
                    new Date(
                        b.dataAvaliacao,
                    ).getTime() -
                    new Date(
                        a.dataAvaliacao,
                    ).getTime(),
            )
            .slice(0, 3)
    }, [avaliacoesBarbearia])

    const metricas = useMemo(() => {
        const agora = new Date()

        const hoje = obterDataLocalISO(agora)

        const dataOntem = new Date(agora)
        dataOntem.setDate(dataOntem.getDate() - 1)

        const ontem = obterDataLocalISO(dataOntem)

        const mesAtual = obterChaveMes(agora)

        const mesAnteriorData = new Date(
            agora.getFullYear(),
            agora.getMonth() - 1,
            1,
        )

        const mesAnterior =
            obterChaveMes(mesAnteriorData)

        const validos = agendamentosBarbearia.filter(
            (agendamento) =>
                agendamento.status !== 'CANCELADO',
        )

        const hojeAgendamentos = validos.filter(
            (agendamento) =>
                agendamento.dataHoraInicio.startsWith(hoje),
        )

        const ontemAgendamentos = validos.filter(
            (agendamento) =>
                agendamento.dataHoraInicio.startsWith(ontem),
        )

        const faturamentoHoje =
            agendamentosBarbearia
                .filter(
                    (agendamento) =>
                        agendamento.status === 'CONCLUIDO' &&
                        agendamento.dataHoraInicio.startsWith(
                            hoje,
                        ),
                )
                .reduce(
                    (total, agendamento) =>
                        total + agendamento.valorTotal,
                    0,
                )

        const faturamentoOntem =
            agendamentosBarbearia
                .filter(
                    (agendamento) =>
                        agendamento.status === 'CONCLUIDO' &&
                        agendamento.dataHoraInicio.startsWith(
                            ontem,
                        ),
                )
                .reduce(
                    (total, agendamento) =>
                        total + agendamento.valorTotal,
                    0,
                )

        const clientesMesAtual = new Set(
            validos
                .filter((agendamento) =>
                    agendamento.dataHoraInicio.startsWith(
                        mesAtual,
                    ),
                )
                .map(
                    (agendamento) =>
                        agendamento.idCliente,
                ),
        ).size

        const clientesMesAnterior = new Set(
            validos
                .filter((agendamento) =>
                    agendamento.dataHoraInicio.startsWith(
                        mesAnterior,
                    ),
                )
                .map(
                    (agendamento) =>
                        agendamento.idCliente,
                ),
        ).size

        let variacaoFaturamento =
            'Sem faturamento ontem'

        if (faturamentoOntem > 0) {
            const percentual = Math.round(
                ((faturamentoHoje -
                    faturamentoOntem) /
                    faturamentoOntem) *
                100,
            )

            variacaoFaturamento = `${percentual > 0 ? '+' : ''
                }${percentual}% vs. ontem`
        }

        return {
            agendamentosHoje:
                hojeAgendamentos.length,

            diferencaAgendamentos:
                formatarDiferenca(
                    hojeAgendamentos.length,
                    ontemAgendamentos.length,
                    'vs. ontem',
                ),

            faturamentoHoje,

            variacaoFaturamento,

            clientesMesAtual,

            diferencaClientes:
                formatarDiferenca(
                    clientesMesAtual,
                    clientesMesAnterior,
                    'vs. mês anterior',
                ),
        }
    }, [agendamentosBarbearia])

    const proximosAgendamentos = useMemo(() => {
        const agora = new Date()
        const hoje = obterDataLocalISO(agora)

        return agendamentosBarbearia
            .filter(
                (agendamento) =>
                    agendamento.status === 'CONFIRMADO' &&
                    agendamento.dataHoraInicio.startsWith(
                        hoje,
                    ) &&
                    new Date(
                        agendamento.dataHoraInicio,
                    ) >= agora,
            )
            .sort(
                (a, b) =>
                    new Date(a.dataHoraInicio).getTime() -
                    new Date(b.dataHoraInicio).getTime(),
            )
            .slice(0, 4)
    }, [agendamentosBarbearia])

    const servicosMaisAgendados = useMemo(() => {
        const agora = new Date()
        const mesAtual = obterChaveMes(agora)

        const contagem = new Map<string, number>()

        agendamentosBarbearia
            .filter(
                (agendamento) =>
                    agendamento.status !== 'CANCELADO' &&
                    agendamento.dataHoraInicio.startsWith(
                        mesAtual,
                    ),
            )
            .forEach((agendamento) => {
                agendamento.itens.forEach((item) => {
                    contagem.set(
                        item.nomeServico,
                        (contagem.get(item.nomeServico) ??
                            0) + 1,
                    )
                })
            })

        const total = Array.from(
            contagem.values(),
        ).reduce(
            (soma, quantidade) =>
                soma + quantidade,
            0,
        )

        return Array.from(contagem.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([nome, quantidade]) => ({
                nome,
                percentual:
                    total > 0
                        ? Math.round(
                            (quantidade / total) * 100,
                        )
                        : 0,
            }))
    }, [agendamentosBarbearia])

    function nomeCliente(idCliente: number) {
        return (
            usuarios.find(
                (usuario) =>
                    usuario.idUsuario === idCliente,
            )?.nome ?? 'Cliente'
        )
    }

    function nomeBarbeiro(idBarbeiro: number) {
        const barbeiro = barbeiros.find(
            (item) =>
                item.idBarbeiro === idBarbeiro,
        )

        if (!barbeiro) {
            return 'Barbeiro'
        }

        return (
            usuarios.find(
                (usuario) =>
                    usuario.idUsuario ===
                    barbeiro.idUsuario,
            )?.nome ?? 'Barbeiro'
        )
    }

    function nomeServicos(
        agendamento: Agendamento,
    ) {
        if (agendamento.itens.length === 0) {
            return 'Serviço'
        }

        return agendamento.itens
            .map((item) => item.nomeServico)
            .join(' + ')
    }

    function novoAgendamento() {
        if (!barbeariaAtual) {
            return
        }

        navigate(
            `/barbearias/${barbeariaAtual.idBarbearia}/agendar`,
        )
    }

    return (
        <section className="admin-dashboard">
            <div className="admin-dashboard__topbar">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Visão geral da{' '}
                        {barbeariaAtual?.nome ??
                            'barbearia'}
                    </p>
                </div>

                <Button
                    type="button"
                    disabled={!barbeariaAtual}
                    onClick={novoAgendamento}
                >
                    Novo agendamento
                </Button>
            </div>

            {erro && (
                <p className="admin-dashboard__message">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="admin-dashboard__message">
                    Carregando dashboard...
                </p>
            ) : (
                <>
                    <div className="admin-dashboard__stats">

                        <AdminStatCard
                            label="Agendamentos hoje"
                            value={metricas.agendamentosHoje}
                        />

                        <AdminStatCard
                            label="Faturamento hoje"
                            value={formatarMoeda(
                                metricas.faturamentoHoje,
                            )}
                        />

                        <AdminStatCard
                            label="Clientes no mês"
                            value={metricas.clientesMesAtual}
                        />

                        <AdminStatCard
                            label="Avaliação média"
                            value={
                                avaliacaoMedia === null
                                    ? '—'
                                    : `${avaliacaoMedia.toFixed(1)} / 5`
                            }
                        />
                    </div>

                    <div className="admin-dashboard__columns">
                        <section className="admin-dashboard__appointments">
                            <h2>Próximos agendamentos</h2>

                            <p className="admin-dashboard__section-subtitle">
                                Hoje
                            </p>

                            {proximosAgendamentos.length ===
                                0 ? (
                                <p className="admin-dashboard__empty">
                                    Nenhum próximo agendamento para
                                    hoje.
                                </p>
                            ) : (
                                <div className="admin-dashboard__appointment-list">
                                    {proximosAgendamentos.map(
                                        (agendamento) => (
                                            <article
                                                className="admin-dashboard__appointment-row"
                                                key={
                                                    agendamento.idAgendamento
                                                }
                                            >
                                                <div className="admin-dashboard__appointment-main">
                                                    <strong>
                                                        {formatarHora(
                                                            agendamento.dataHoraInicio,
                                                        )}{' '}
                                                        •{' '}
                                                        {nomeCliente(
                                                            agendamento.idCliente,
                                                        )}
                                                    </strong>

                                                    <div className="admin-dashboard__appointment-status">
                                                        <StatusBadge variant="confirmed">
                                                            CONFIRMADO
                                                        </StatusBadge>
                                                    </div>
                                                </div>

                                                <span className="admin-dashboard__appointment-service">
                                                    {nomeServicos(
                                                        agendamento,
                                                    )}{' '}
                                                    •{' '}
                                                    {nomeBarbeiro(
                                                        agendamento.idBarbeiro,
                                                    )}
                                                </span>

                                                <span className="admin-dashboard__appointment-view">
                                                    Ver
                                                </span>
                                            </article>
                                        ),
                                    )}
                                </div>
                            )}
                        </section>

                        <aside className="admin-dashboard__side">
                            <section className="admin-dashboard__side-card">
                                <h2>
                                    Serviços mais agendados
                                </h2>

                                {servicosMaisAgendados.length ===
                                    0 ? (
                                    <p className="admin-dashboard__empty">
                                        Ainda não há dados suficientes.
                                    </p>
                                ) : (
                                    <ol className="admin-dashboard__services-ranking">
                                        {servicosMaisAgendados.map(
                                            (servico) => (
                                                <li key={servico.nome}>
                                                    <span>
                                                        {servico.nome}
                                                    </span>

                                                    <strong>
                                                        {servico.percentual}%
                                                    </strong>
                                                </li>
                                            ),
                                        )}
                                    </ol>
                                )}
                            </section>

                            <section className="admin-dashboard__side-card">
                                <h2>Avaliações recentes</h2>

                                {avaliacoesRecentes.length === 0 ? (
                                    <p className="admin-dashboard__empty">
                                        Nenhuma avaliação recebida ainda.
                                    </p>
                                ) : (
                                    <div className="admin-dashboard__reviews">
                                        {avaliacoesRecentes.map((avaliacao) => (
                                            <article
                                                className="admin-dashboard__review"
                                                key={avaliacao.idAvaliacao}
                                            >
                                                <div className="admin-dashboard__review-top">
                                                    <strong>
                                                        {avaliacao.notaBarbearia.toFixed(1)} / 5
                                                    </strong>

                                                    <span>
                                                        {formatarDataAvaliacao(
                                                            avaliacao.dataAvaliacao,
                                                        )}
                                                    </span>
                                                </div>

                                                <p>
                                                    {avaliacao.comentario ||
                                                        'Sem comentário.'}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </aside>
                    </div>
                </>
            )}
        </section>
    )
}

export default DashboardProprietario