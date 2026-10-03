import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import AdminStatCard from '../../components/AdminStatCard/AdminStatCard'

import { DEMO_IDS } from '../../config/demo'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarAvaliacoes } from '../../services/avaliacaoService'
import { listarUsuarios } from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Avaliacao } from '../../types/Avaliacao'
import type { Usuario } from '../../types/Usuario'

import './AvaliacoesBarbeiro.css'

function calcularMedia(
    valores: number[],
) {
    if (valores.length === 0) {
        return null
    }

    return (
        valores.reduce(
            (total, valor) =>
                total + valor,
            0,
        ) / valores.length
    )
}

function formatarMedia(
    valor: number | null,
) {
    if (valor === null) {
        return '—'
    }

    return valor.toLocaleString(
        'pt-BR',
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        },
    )
}

function formatarData(
    data: string,
) {
    return new Intl.DateTimeFormat(
        'pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        },
    ).format(new Date(data))
}

function estrelas(nota: number) {
    const notaLimitada = Math.max(
        0,
        Math.min(5, nota),
    )

    return (
        '★'.repeat(notaLimitada) +
        '☆'.repeat(5 - notaLimitada)
    )
}

function AvaliacoesBarbeiro() {
    const [avaliacoes, setAvaliacoes] =
        useState<Avaliacao[]>([])

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
                    dadosAvaliacoes,
                    dadosAgendamentos,
                    dadosUsuarios,
                ] = await Promise.all([
                    listarAvaliacoes(),
                    listarAgendamentos(),
                    listarUsuarios(),
                ])

                setAvaliacoes(
                    dadosAvaliacoes,
                )

                setAgendamentos(
                    dadosAgendamentos,
                )

                setUsuarios(
                    dadosUsuarios,
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar suas avaliações.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const agendamentosBarbeiro =
        useMemo(() => {
            return agendamentos.filter(
                (agendamento) =>
                    agendamento.idBarbearia ===
                    DEMO_IDS.barbearia &&
                    agendamento.idBarbeiro ===
                    DEMO_IDS.barbeiro,
            )
        }, [agendamentos])

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

    const mediaBarbeiro =
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

            return calcularMedia(notas)
        }, [avaliacoesBarbeiro])

    const avaliacoesUltimos30Dias =
        useMemo(() => {
            const hoje = new Date()

            const limite =
                new Date(hoje)

            limite.setDate(
                limite.getDate() - 30,
            )

            return avaliacoesBarbeiro.filter(
                (avaliacao) =>
                    new Date(
                        avaliacao.dataAvaliacao,
                    ) >= limite,
            ).length
        }, [avaliacoesBarbeiro])

    const avaliacoesRecentes =
        useMemo(() => {
            return [
                ...avaliacoesBarbeiro,
            ].sort(
                (a, b) =>
                    new Date(
                        b.dataAvaliacao,
                    ).getTime() -
                    new Date(
                        a.dataAvaliacao,
                    ).getTime(),
            )
        }, [avaliacoesBarbeiro])

    function buscarAgendamento(
        idAgendamento: number,
    ) {
        return agendamentosBarbeiro.find(
            (agendamento) =>
                agendamento.idAgendamento ===
                idAgendamento,
        )
    }

    function nomeCliente(
        avaliacao: Avaliacao,
    ) {
        const agendamento =
            buscarAgendamento(
                avaliacao.idAgendamento,
            )

        if (!agendamento) {
            return 'Cliente'
        }

        return (
            usuarios.find(
                (usuario) =>
                    usuario.idUsuario ===
                    agendamento.idCliente,
            )?.nome ?? 'Cliente'
        )
    }

    function nomeServicos(
        avaliacao: Avaliacao,
    ) {
        const agendamento =
            buscarAgendamento(
                avaliacao.idAgendamento,
            )

        if (
            !agendamento ||
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

    return (
        <section className="barber-reviews">
            <div className="barber-reviews__top">
                <h1>Minhas Avaliações</h1>

                <p>
                    Veja como os clientes avaliaram
                    seus atendimentos.
                </p>
            </div>

            {erro && (
                <p className="barber-reviews__message barber-reviews__message--error">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="barber-reviews__message">
                    Carregando avaliações...
                </p>
            ) : (
                <>
                    <div className="barber-reviews__stats">
                        <AdminStatCard
                            label="Minha nota"
                            value={
                                mediaBarbeiro ===
                                    null
                                    ? '—'
                                    : `${formatarMedia(
                                        mediaBarbeiro,
                                    )} / 5`
                            }
                            hint="média das avaliações"
                        />

                        <AdminStatCard
                            label="Avaliações"
                            value={
                                avaliacoesBarbeiro.length
                            }
                            hint={
                                avaliacoesBarbeiro.length ===
                                    1
                                    ? 'avaliação recebida'
                                    : 'avaliações recebidas'
                            }
                        />

                        <AdminStatCard
                            label="Últimos 30 dias"
                            value={
                                avaliacoesUltimos30Dias
                            }
                            hint={
                                avaliacoesUltimos30Dias ===
                                    1
                                    ? 'nova avaliação'
                                    : 'novas avaliações'
                            }
                        />
                    </div>

                    <section className="barber-reviews__recent">
                        <div className="barber-reviews__heading">
                            <h2>
                                Avaliações recentes
                            </h2>

                            <p>
                                Feedback dos clientes
                                sobre seus atendimentos
                            </p>
                        </div>

                        {avaliacoesRecentes.length ===
                            0 ? (
                            <div className="barber-reviews__empty">
                                <strong>
                                    Nenhuma avaliação
                                    encontrada
                                </strong>

                                <span>
                                    Você ainda não
                                    recebeu avaliações.
                                </span>
                            </div>
                        ) : (
                            <div className="barber-reviews__list">
                                {avaliacoesRecentes.map(
                                    (
                                        avaliacao,
                                    ) => (
                                        <article
                                            className="barber-reviews__review"
                                            key={
                                                avaliacao.idAvaliacao
                                            }
                                        >
                                            <div className="barber-reviews__review-top">
                                                <div>
                                                    <strong>
                                                        {nomeCliente(
                                                            avaliacao,
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {formatarData(
                                                            avaliacao.dataAvaliacao,
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="barber-reviews__rating">
                                                    <strong>
                                                        {formatarMedia(
                                                            avaliacao.notaBarbeiro,
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {estrelas(
                                                            avaliacao.notaBarbeiro ??
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="barber-reviews__service">
                                                {nomeServicos(
                                                    avaliacao,
                                                )}
                                            </p>

                                            {avaliacao.comentario && (
                                                <p className="barber-reviews__comment">
                                                    “
                                                    {
                                                        avaliacao.comentario
                                                    }
                                                    ”
                                                </p>
                                            )}
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

export default AvaliacoesBarbeiro