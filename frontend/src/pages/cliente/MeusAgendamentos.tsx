import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import AgendamentoAcoes from '../../components/AgendamentoAcoes/AgendamentoAcoes'
import StatusBadge from '../../components/StatusBadge/StatusBadge'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarBarbearias } from '../../services/barbeariaService'

import type {
    Agendamento,
    StatusAgendamento,
} from '../../types/Agendamento'
import type { Barbearia } from '../../types/Barbearia'

import './MeusAgendamentos.css'

import useAuth from '../../hooks/useAuth'


type AbaAgendamentos = 'proximos' | 'historico'

type StatusBadgeVariant =
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'no-show'

function formatarPreco(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor)
}

function formatarDataHora(dataHora: string) {
    const data = new Date(dataHora)

    const dataFormatada = new Intl.DateTimeFormat(
        'pt-BR',
    ).format(data)

    const horaFormatada = new Intl.DateTimeFormat(
        'pt-BR',
        {
            hour: '2-digit',
            minute: '2-digit',
        },
    ).format(data)

    return `${dataFormatada} às ${horaFormatada}`
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

function MeusAgendamentos() {
    const { usuario } = useAuth()

    const [aba, setAba] =
        useState<AbaAgendamentos>('proximos')

    const [agendamentos, setAgendamentos] = useState<
        Agendamento[]
    >([])

    const [barbearias, setBarbearias] = useState<
        Barbearia[]
    >([])

    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    dadosAgendamentos,
                    dadosBarbearias,
                ] = await Promise.all([
                    listarAgendamentos(),
                    listarBarbearias(),
                ])

                setAgendamentos(
                    dadosAgendamentos.filter(
                        (agendamento) =>
                            agendamento.idCliente === usuario?.idUsuario,
                    ),
                )

                setBarbearias(dadosBarbearias)
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
    }, [usuario])

    const proximos = useMemo(() => {
        const agora = new Date()

        return agendamentos
            .filter(
                (agendamento) =>
                    agendamento.status === 'CONFIRMADO' &&
                    new Date(
                        agendamento.dataHoraInicio,
                    ) >= agora,
            )
            .sort(
                (a, b) =>
                    new Date(a.dataHoraInicio).getTime() -
                    new Date(b.dataHoraInicio).getTime(),
            )
    }, [agendamentos])

    const historico = useMemo(() => {
        const agora = new Date()

        return agendamentos
            .filter(
                (agendamento) =>
                    agendamento.status !== 'CONFIRMADO' ||
                    new Date(
                        agendamento.dataHoraInicio,
                    ) < agora,
            )
            .sort(
                (a, b) =>
                    new Date(b.dataHoraInicio).getTime() -
                    new Date(a.dataHoraInicio).getTime(),
            )
    }, [agendamentos])

    const agendamentosExibidos =
        aba === 'proximos' ? proximos : historico

    function nomeBarbearia(idBarbearia: number) {
        return (
            barbearias.find(
                (barbearia) =>
                    barbearia.idBarbearia === idBarbearia,
            )?.nome ?? 'Barbearia'
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

    if (carregando) {
        return (
            <main className="appointments-page">
                <div className="appointments-container">
                    <p>Carregando seus agendamentos...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="appointments-page">
            <section className="appointments-header">
                <div className="appointments-container">
                    <h1>Meus agendamentos</h1>

                    <p>
                        <span className="appointments-description__desktop">
                            Acompanhe seus próximos horários e o histórico de atendimentos.
                        </span>

                        <span className="appointments-description__mobile">
                            Acompanhe seus próximos horários.
                        </span>
                    </p>

                    <div className="appointments-tabs">
                        <button
                            className={[
                                'appointments-tab',
                                aba === 'proximos'
                                    ? 'appointments-tab--active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            type="button"
                            onClick={() => setAba('proximos')}
                        >
                            Próximos
                        </button>

                        <button
                            className={[
                                'appointments-tab',
                                aba === 'historico'
                                    ? 'appointments-tab--active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            type="button"
                            onClick={() => setAba('historico')}
                        >
                            Histórico
                        </button>
                    </div>
                </div>
            </section>

            <section className="appointments-content">
                <div className="appointments-container">
                    <h2>
                        {aba === 'proximos' ? (
                            <>
                                <span className="appointments-title__desktop">
                                    Próximos agendamentos
                                </span>

                                <span className="appointments-title__mobile">
                                    Próximos
                                </span>
                            </>
                        ) : (
                            'Histórico'
                        )}
                    </h2>

                    {erro && (
                        <p className="appointments-message">
                            {erro}
                        </p>
                    )}

                    {!erro &&
                        agendamentosExibidos.length === 0 && (
                            <p className="appointments-empty">
                                {aba === 'proximos'
                                    ? 'Você não possui próximos agendamentos.'
                                    : 'Nenhum atendimento encontrado no histórico.'}
                            </p>
                        )}

                    {!erro &&
                        agendamentosExibidos.length > 0 && (
                            <div className="appointments-list">
                                {agendamentosExibidos.map(
                                    (agendamento) => (
                                        <article
                                            className="appointment-card"
                                            key={
                                                agendamento.idAgendamento
                                            }
                                        >
                                            <div className="appointment-card__content">
                                                <h3>
                                                    {nomeBarbearia(
                                                        agendamento.idBarbearia,
                                                    )}{' '}
                                                    —{' '}
                                                    {nomeServicos(
                                                        agendamento,
                                                    )}
                                                </h3>

                                                <p>
                                                    {formatarDataHora(
                                                        agendamento.dataHoraInicio,
                                                    )}{' '}
                                                    •{' '}
                                                    {agendamento.nomeBarbeiro || 'Barbeiro'}{' '}
                                                    •{' '}
                                                    {formatarPreco(
                                                        agendamento.valorTotal,
                                                    )}
                                                </p>
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
    perfil="cliente"
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
            </section>
        </main>
    )
}

export default MeusAgendamentos