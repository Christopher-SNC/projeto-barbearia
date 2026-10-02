import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import { DEMO_IDS } from '../../config/demo'

import { listarBarbeirosServicos } from '../../services/barbeiroServicoService'
import { listarServicos } from '../../services/servicoService'

import type { BarbeiroServico } from '../../types/BarbeiroServico'
import type { Servico } from '../../types/Servico'

import './ServicosBarbeiro.css'

function formatarPreco(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor)
}

function ServicosBarbeiro() {
    const [servicos, setServicos] =
        useState<Servico[]>([])

    const [vinculos, setVinculos] =
        useState<BarbeiroServico[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    dadosServicos,
                    dadosVinculos,
                ] = await Promise.all([
                    listarServicos(),
                    listarBarbeirosServicos(),
                ])

                setServicos(dadosServicos)
                setVinculos(dadosVinculos)
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar seus serviços.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const meusServicos = useMemo(() => {
        const idsServicos =
            new Set(
                vinculos
                    .filter(
                        (vinculo) =>
                            vinculo.idBarbeiro ===
                            DEMO_IDS.barbeiro &&
                            vinculo.ativo,
                    )
                    .map(
                        (vinculo) =>
                            vinculo.idServico,
                    ),
            )

        return servicos
            .filter(
                (servico) =>
                    servico.idBarbearia ===
                    DEMO_IDS.barbearia &&
                    servico.ativo &&
                    idsServicos.has(
                        servico.idServico,
                    ),
            )
            .sort((a, b) =>
                a.nome.localeCompare(
                    b.nome,
                    'pt-BR',
                ),
            )
    }, [servicos, vinculos])

    return (
        <section className="barber-services">
            <div className="barber-services__top">
                <h1>Meus Serviços</h1>

                <p>
                    Consulte os serviços que você
                    realiza na barbearia.
                </p>
            </div>

            {erro && (
                <p className="barber-services__message barber-services__message--error">
                    {erro}
                </p>
            )}

            {carregando ? (
                <p className="barber-services__message">
                    Carregando serviços...
                </p>
            ) : (
                <section className="barber-services__content">
                    <div className="barber-services__heading">
                        <div>
                            <h2>
                                Serviços habilitados
                            </h2>

                            <p>
                                {meusServicos.length}{' '}
                                {meusServicos.length ===
                                    1
                                    ? 'serviço disponível'
                                    : 'serviços disponíveis'}
                            </p>
                        </div>
                    </div>

                    {meusServicos.length === 0 ? (
                        <div className="barber-services__empty">
                            <strong>
                                Nenhum serviço
                                habilitado
                            </strong>

                            <span>
                                Você ainda não possui
                                serviços ativos
                                vinculados ao seu
                                perfil.
                            </span>
                        </div>
                    ) : (
                        <div className="barber-services__grid">
                            {meusServicos.map(
                                (servico) => (
                                    <article
                                        className="barber-services__card"
                                        key={
                                            servico.idServico
                                        }
                                    >
                                        <div className="barber-services__card-top">
                                            <div>
                                                <h3>
                                                    {
                                                        servico.nome
                                                    }
                                                </h3>

                                                <span className="barber-services__status">
                                                    Ativo
                                                </span>
                                            </div>

                                            <strong className="barber-services__price">
                                                {formatarPreco(
                                                    servico.preco,
                                                )}
                                            </strong>
                                        </div>

                                        {servico.descricao && (
                                            <p className="barber-services__description">
                                                {
                                                    servico.descricao
                                                }
                                            </p>
                                        )}

                                        <div className="barber-services__footer">
                                            <span>
                                                Duração
                                            </span>

                                            <strong>
                                                {
                                                    servico.duracaoMinutos
                                                }{' '}
                                                min
                                            </strong>
                                        </div>
                                    </article>
                                ),
                            )}
                        </div>
                    )}
                </section>
            )}
        </section>
    )
}

export default ServicosBarbeiro