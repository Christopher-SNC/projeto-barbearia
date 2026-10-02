import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import AdminStatCard from '../../components/AdminStatCard/AdminStatCard'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarAvaliacoes } from '../../services/avaliacaoService'
import { listarUsuarios } from '../../services/usuarioService'

import { listarBarbeiros } from '../../services/barbeiroService'

import type { Agendamento } from '../../types/Agendamento'
import type { Avaliacao } from '../../types/Avaliacao'
import type { Usuario } from '../../types/Usuario'

import type { Barbeiro } from '../../types/Barbeiro'

import './AvaliacoesProprietario.css'

import { DEMO_IDS } from '../../config/demo'

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

function AvaliacoesProprietario() {
    const [avaliacoes, setAvaliacoes] =
        useState<Avaliacao[]>([])

    const [
        agendamentos,
        setAgendamentos,
    ] = useState<Agendamento[]>([])

    const [barbeiros, setBarbeiros] =
        useState<Barbeiro[]>([])

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState('')

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    dadosAvaliacoes,
                    dadosAgendamentos,
                    dadosBarbeiros,
                    dadosUsuarios,
                ] = await Promise.all([
                    listarAvaliacoes(),
                    listarAgendamentos(),
                    listarBarbeiros(),
                    listarUsuarios(),
                ])

                setAvaliacoes(
                    dadosAvaliacoes,
                )

                setAgendamentos(
                    dadosAgendamentos,
                )

                setBarbeiros(
                    dadosBarbeiros,
                )

                setUsuarios(
                    dadosUsuarios,
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar as avaliações.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const agendamentosBarbearia =
        useMemo(() => {
            return agendamentos.filter(
                (agendamento) =>
                    agendamento.idBarbearia ===
                    DEMO_IDS.barbearia,
            )
        }, [agendamentos])

    const avaliacoesBarbearia =
        useMemo(() => {
            const idsAgendamentos =
                new Set(
                    agendamentosBarbearia.map(
                        (agendamento) =>
                            agendamento.idAgendamento,
                    ),
                )

            return avaliacoes.filter(
                (avaliacao) =>
                    idsAgendamentos.has(
                        avaliacao.idAgendamento,
                    ),
            )
        }, [
            avaliacoes,
            agendamentosBarbearia,
        ])

    const mediaBarbearia =
        useMemo(() => {
            return calcularMedia(
                avaliacoesBarbearia.map(
                    (avaliacao) =>
                        avaliacao.notaBarbearia,
                ),
            )
        }, [avaliacoesBarbearia])

    const mediaBarbeiros =
        useMemo(() => {
            return calcularMedia(
                avaliacoesBarbearia
                    .map(
                        (avaliacao) =>
                            avaliacao.notaBarbeiro,
                    )
                    .filter(
                        (
                            nota,
                        ): nota is number =>
                            nota !== null,
                    ),
            )
        }, [avaliacoesBarbearia])

    const avaliacoesUltimos30Dias =
        useMemo(() => {
            const hoje = new Date()

            const limite =
                new Date(hoje)

            limite.setDate(
                limite.getDate() - 30,
            )

            return avaliacoesBarbearia.filter(
                (avaliacao) => {
                    const data =
                        new Date(
                            avaliacao.dataAvaliacao,
                        )

                    return data >= limite
                },
            ).length
        }, [avaliacoesBarbearia])

    const avaliacoesRecentes =
        useMemo(() => {
            return [
                ...avaliacoesBarbearia,
            ].sort(
                (a, b) =>
                    new Date(
                        b.dataAvaliacao,
                    ).getTime() -
                    new Date(
                        a.dataAvaliacao,
                    ).getTime(),
            )
        }, [avaliacoesBarbearia])

    function buscarAgendamento(
        idAgendamento: number,
    ) {
        return agendamentosBarbearia.find(
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

        const usuario =
            usuarios.find(
                (item) =>
                    item.idUsuario ===
                    agendamento.idCliente,
            )

        return (
            usuario?.nome ??
            'Cliente'
        )
    }
    function nomeBarbeiro(
        avaliacao: Avaliacao,
    ) {
        const agendamento =
            buscarAgendamento(
                avaliacao.idAgendamento,
            )

        if (!agendamento) {
            return 'Barbeiro'
        }

        const barbeiro = barbeiros.find(
            (item) =>
                item.idBarbeiro ===
                agendamento.idBarbeiro,
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

    function formatarDataAvaliacao(
        data: string,
    ) {
        return new Intl.DateTimeFormat(
            'pt-BR',
        ).format(new Date(data))
    }
    return (
        <section className="admin-reviews">
            <div className="admin-reviews__top">
                <h1>Avaliações</h1>

                <p className="admin-reviews__description admin-reviews__description--desktop">
                    Acompanhe a experiência dos clientes
                </p>

                <p className="admin-reviews__description admin-reviews__description--mobile">
                    Experiência dos clientes
                </p>
            </div>

            {erro && (
                <p className="admin-reviews__feedback admin-reviews__feedback--error">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="admin-reviews__loading">
                    Carregando avaliações...
                </p>
            ) : (
                <>
                    <div className="admin-reviews__stats">
                        <AdminStatCard
                            label="Nota da barbearia"
                            value={formatarMedia(
                                mediaBarbearia,
                            )}
                            hint={`${avaliacoesBarbearia.length} ${avaliacoesBarbearia.length ===
                                1
                                ? 'avaliação'
                                : 'avaliações'
                                }`}
                        />

                        <AdminStatCard
                            label="Nota dos barbeiros"
                            value={formatarMedia(
                                mediaBarbeiros,
                            )}
                            hint="média da equipe"
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

                    <section className="admin-reviews__recent">
                        <h2>
                            Avaliações recentes
                        </h2>

                        {avaliacoesRecentes.length ===
                            0 ? (
                            <p className="admin-reviews__empty">
                                Nenhuma avaliação encontrada.
                            </p>
                        ) : (
                            <div className="admin-reviews__list">
                                {avaliacoesRecentes.map(
                                    (avaliacao) => (
                                        <article
                                            className="admin-reviews__review"
                                            key={avaliacao.idAvaliacao}
                                        >
                                            <div className="admin-reviews__review-top">
                                                <strong>
                                                    {nomeCliente(avaliacao)}
                                                </strong>

                                                <span className="admin-reviews__date">
                                                    {formatarDataAvaliacao(
                                                        avaliacao.dataAvaliacao,
                                                    )}
                                                </span>
                                            </div>

                                            <p className="admin-reviews__barber">
                                                Barbeiro: {nomeBarbeiro(avaliacao)}
                                            </p>

                                            <div className="admin-reviews__ratings">
                                                <div className="admin-reviews__rating-row">
                                                    <strong>Barbearia</strong>

                                                    <span className="admin-reviews__stars">
                                                        {estrelas(
                                                            avaliacao.notaBarbearia,
                                                        )}
                                                    </span>
                                                </div>

                                                {avaliacao.notaBarbeiro !== null && (
                                                    <div className="admin-reviews__rating-row">
                                                        <strong>Barbeiro</strong>

                                                        <span className="admin-reviews__stars">
                                                            {estrelas(
                                                                avaliacao.notaBarbeiro,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="admin-reviews__comment">
                                                {avaliacao.comentario ??
                                                    'Avaliação sem comentário.'}
                                            </p>
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

export default AvaliacoesProprietario