import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { listarAgendamentos } from '../../services/agendamentoService'
import { listarBarbearias } from '../../services/barbeariaService'
import { listarFavoritos, type Favorito } from '../../services/favoritoService'
import type { Agendamento } from '../../types/Agendamento'
import type { Barbearia } from '../../types/Barbearia'

import './DashboardCliente.css'

function formatarDataHora(valor: string) {
    const data = new Date(valor)
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(data)
}

function formatarValor(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor)
}

function nomeServicos(agendamento: Agendamento) {
    return agendamento.itens.map((item) => item.nomeServico).join(' + ') || 'Atendimento'
}

const rotulos: Record<Agendamento['status'], string> = {
    CONFIRMADO: 'Confirmado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
    NAO_COMPARECEU: 'Não compareceu',
}

function DashboardCliente() {
    const { usuario } = useAuth()
    const idUsuario = usuario?.idUsuario

    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
    const [favoritos, setFavoritos] = useState<Favorito[]>([])
    const [barbearias, setBarbearias] = useState<Barbearia[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [agora, setAgora] = useState<number | null>(null)

    useEffect(() => {
        const atualizarRelogio = () => setAgora(Date.now())
        const inicio = window.setTimeout(atualizarRelogio, 0)
        const intervalo = window.setInterval(atualizarRelogio, 60_000)
        return () => {
            window.clearTimeout(inicio)
            window.clearInterval(intervalo)
        }
    }, [])

    useEffect(() => {
        if (idUsuario === undefined) return

        let ativo = true
        async function carregar() {
            try {
                const [dadosAgendamentos, dadosFavoritos, dadosBarbearias] =
                    await Promise.all([
                        listarAgendamentos(),
                        listarFavoritos(),
                        listarBarbearias(),
                    ])

                if (!ativo) return
                setAgendamentos(dadosAgendamentos.filter(
                    (agendamento) => agendamento.idCliente === idUsuario,
                ))
                setFavoritos(dadosFavoritos)
                setBarbearias(dadosBarbearias)
            } catch (error) {
                console.error(error)
                if (ativo) {
                    setErro('Não foi possível carregar seu painel. Atualize a página para tentar novamente.')
                }
            } finally {
                if (ativo) setCarregando(false)
            }
        }
        void carregar()
        return () => { ativo = false }
    }, [idUsuario])

    const horarioAtual = agora ?? 0
    const proximos = agendamentos
        .filter((agendamento) =>
            agendamento.status === 'CONFIRMADO' &&
            new Date(agendamento.dataHoraInicio).getTime() >= horarioAtual,
        )
        .sort((a, b) =>
            new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime(),
        )
    const historico = agendamentos
        .filter((agendamento) =>
            agendamento.status !== 'CONFIRMADO' ||
            new Date(agendamento.dataHoraInicio).getTime() < horarioAtual,
        )
        .sort((a, b) =>
            new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime(),
        )
        .slice(0, 3)
    const concluidos = agendamentos.filter(
        (agendamento) => agendamento.status === 'CONCLUIDO',
    ).length

    function nomeBarbearia(id: number) {
        return barbearias.find((barbearia) => barbearia.idBarbearia === id)?.nome ?? 'Barbearia'
    }

    return (
        <main className="client-dashboard">
            <div className="client-dashboard__container">
                <div className="client-dashboard__heading">
                    <div>
                        <span className="client-dashboard__eyebrow">Área do cliente</span>
                        <h1>Olá, {usuario?.nome ?? 'Cliente'}!</h1>
                        <p>Consulte seus próximos horários e encontre suas barbearias favoritas.</p>
                    </div>
                    <Link to="/barbearias" className="client-dashboard__primary-link">
                        Encontrar barbearias
                    </Link>
                </div>

                {erro && <p className="client-dashboard__alert" role="alert">{erro}</p>}
                {carregando ? (
                    <p role="status">Carregando seu painel...</p>
                ) : (
                    <>
                        <section className="client-dashboard__stats" aria-label="Resumo dos seus atendimentos">
                            <article className="client-dashboard__stat">
                                <span>Próximos agendamentos</span>
                                <strong>{proximos.length}</strong>
                                <small>confirmados</small>
                            </article>
                            <article className="client-dashboard__stat">
                                <span>Atendimentos concluídos</span>
                                <strong>{concluidos}</strong>
                                <small>no histórico</small>
                            </article>
                            <article className="client-dashboard__stat">
                                <span>Barbearias favoritas</span>
                                <strong>{favoritos.length}</strong>
                                <small>salvas por você</small>
                            </article>
                        </section>

                        <div className="client-dashboard__columns">
                            <section className="client-dashboard__card">
                                <div className="client-dashboard__section-title">
                                    <h2>Próximo agendamento</h2>
                                    <Link to="/meus-agendamentos">Ver todos</Link>
                                </div>
                                {proximos.length === 0 ? (
                                    <div className="client-dashboard__empty">
                                        <strong>Você ainda não tem um horário marcado.</strong>
                                        <p>Encontre uma barbearia e agende seu próximo atendimento.</p>
                                        <Link to="/barbearias">Agendar um serviço</Link>
                                    </div>
                                ) : (
                                    <div className="client-dashboard__appointment">
                                        <span className="client-dashboard__status">Confirmado</span>
                                        <h3>{nomeBarbearia(proximos[0].idBarbearia)}</h3>
                                        <p>{nomeServicos(proximos[0])}</p>
                                        <dl>
                                            <div><dt>Data e hora</dt><dd>{formatarDataHora(proximos[0].dataHoraInicio)}</dd></div>
                                            <div><dt>Profissional</dt><dd>{proximos[0].nomeBarbeiro}</dd></div>
                                            <div><dt>Valor</dt><dd>{formatarValor(proximos[0].valorTotal)}</dd></div>
                                        </dl>
                                        <Link to="/meus-agendamentos" className="client-dashboard__secondary-link">
                                            Gerenciar agendamento
                                        </Link>
                                    </div>
                                )}
                            </section>

                            <section className="client-dashboard__card">
                                <div className="client-dashboard__section-title">
                                    <h2>Acesso rápido</h2>
                                </div>
                                <nav className="client-dashboard__quick-links" aria-label="Acesso rápido do cliente">
                                    <Link to="/meus-agendamentos">Meus agendamentos <span aria-hidden="true">→</span></Link>
                                    <Link to="/meus-favoritos">Minhas favoritas <span aria-hidden="true">→</span></Link>
                                    <Link to="/barbearias">Buscar barbearias <span aria-hidden="true">→</span></Link>
                                </nav>
                                <div className="client-dashboard__account">
                                    <h3>Dados da conta</h3>
                                    <p><strong>Nome:</strong> {usuario?.nome}</p>
                                    <p><strong>E-mail:</strong> {usuario?.email}</p>
                                    <small>Você utiliza a mesma conta em todas as áreas às quais tem acesso.</small>
                                </div>
                            </section>
                        </div>

                        <section className="client-dashboard__card client-dashboard__history">
                            <div className="client-dashboard__section-title">
                                <h2>Atendimentos anteriores</h2>
                                <Link to="/meus-agendamentos">Abrir histórico</Link>
                            </div>
                            {historico.length === 0 ? (
                                <p className="client-dashboard__muted">Seu histórico aparecerá aqui após seus primeiros atendimentos.</p>
                            ) : (
                                <div className="client-dashboard__history-list">
                                    {historico.map((agendamento) => (
                                        <article key={agendamento.idAgendamento}>
                                            <div>
                                                <strong>{nomeBarbearia(agendamento.idBarbearia)}</strong>
                                                <p>{nomeServicos(agendamento)} · {formatarDataHora(agendamento.dataHoraInicio)}</p>
                                            </div>
                                            <span>{rotulos[agendamento.status]}</span>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    )
}

export default DashboardCliente
