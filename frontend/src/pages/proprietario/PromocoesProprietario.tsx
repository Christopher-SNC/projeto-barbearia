import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'

import {
    ativarPromocao,
    atualizarPromocao,
    cadastrarPromocao,
    desativarPromocao,
    listarPromocoes,
} from '../../services/promocaoService'

import {
    cadastrarPromocaoServico,
    excluirPromocaoServico,
    listarPromocoesServicos,
} from '../../services/promocaoServicoService'

import { listarServicos } from '../../services/servicoService'

import type {
    Promocao,
    PromocaoRequest,
    TipoPromocao,
} from '../../types/Promocao'

import type { PromocaoServico } from '../../types/PromocaoServico'
import type { Servico } from '../../types/Servico'

import './PromocoesProprietario.css'

import { DEMO_IDS } from '../../config/demo'

function formatarPercentual(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2,
    }).format(valor)
}

function formatarData(data: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
    }).format(
        new Date(`${data}T12:00:00`),
    )
}

function PromocoesProprietario() {
    const [promocoes, setPromocoes] =
        useState<Promocao[]>([])

    const [vinculos, setVinculos] =
        useState<PromocaoServico[]>([])

    const [servicos, setServicos] =
        useState<Servico[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState('')

    const [sucesso, setSucesso] =
        useState('')

    const [salvando, setSalvando] =
        useState(false)

    const [idProcessando, setIdProcessando] =
        useState<number | null>(null)

    const [promocaoEditando, setPromocaoEditando] =
        useState<Promocao | null>(null)

    const [titulo, setTitulo] =
        useState('')

    const [descricao, setDescricao] =
        useState('')

    const [percentualDesconto, setPercentualDesconto] =
        useState('')

    const [dataInicio, setDataInicio] =
        useState('')

    const [dataFim, setDataFim] =
        useState('')

    const [tipo, setTipo] =
        useState<TipoPromocao>('SERVICO')

    const [
        servicosSelecionados,
        setServicosSelecionados,
    ] = useState<number[]>([])

    const [erroFormulario, setErroFormulario] =
        useState('')

    const formularioRef =
        useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    dadosPromocoes,
                    dadosVinculos,
                    dadosServicos,
                ] = await Promise.all([
                    listarPromocoes(),
                    listarPromocoesServicos(),
                    listarServicos(),
                ])

                setPromocoes(
                    dadosPromocoes.filter(
                        (promocao) =>
                            promocao.idBarbearia ===
                            DEMO_IDS.barbearia,
                    ),
                )

                setVinculos(dadosVinculos)

                setServicos(
                    dadosServicos
                        .filter(
                            (servico) =>
                                servico.idBarbearia ===
                                DEMO_IDS.barbearia,
                        )
                        .sort((a, b) =>
                            a.nome.localeCompare(b.nome),
                        ),
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar as promoções.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const promocoesAtivas = useMemo(() => {
        return promocoes
            .filter((promocao) => promocao.ativa)
            .sort((a, b) =>
                a.titulo.localeCompare(b.titulo),
            )
    }, [promocoes])

    const promocoesInativas = useMemo(() => {
        return promocoes
            .filter((promocao) => !promocao.ativa)
            .sort((a, b) =>
                a.titulo.localeCompare(b.titulo),
            )
    }, [promocoes])

    function idsServicosDaPromocao(
        idPromocao: number,
    ) {
        return vinculos
            .filter(
                (vinculo) =>
                    vinculo.idPromocao === idPromocao,
            )
            .map(
                (vinculo) =>
                    vinculo.idServico,
            )
    }

    function nomesServicosDaPromocao(
        idPromocao: number,
    ) {
        const ids =
            idsServicosDaPromocao(idPromocao)

        const nomes = servicos
            .filter((servico) =>
                ids.includes(servico.idServico),
            )
            .map((servico) => servico.nome)

        if (nomes.length === 0) {
            return 'Sem serviço vinculado'
        }

        return nomes.join(' + ')
    }

    function limparFormulario() {
        setPromocaoEditando(null)
        setTitulo('')
        setDescricao('')
        setPercentualDesconto('')
        setDataInicio('')
        setDataFim('')
        setTipo('SERVICO')
        setServicosSelecionados([])
        setErroFormulario('')
    }

    function irParaNovaPromocao() {
        limparFormulario()
        setErro('')
        setSucesso('')

        window.requestAnimationFrame(() => {
            formularioRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        })
    }

    function abrirEdicao(
        promocao: Promocao,
    ) {
        setPromocaoEditando(promocao)
        setTitulo(promocao.titulo)
        setDescricao(promocao.descricao ?? '')

        setPercentualDesconto(
            String(promocao.percentualDesconto),
        )

        setDataInicio(promocao.dataInicio)
        setDataFim(promocao.dataFim)
        setTipo(promocao.tipo)

        setServicosSelecionados(
            idsServicosDaPromocao(
                promocao.idPromocao,
            ),
        )

        setErroFormulario('')
        setErro('')
        setSucesso('')

        window.requestAnimationFrame(() => {
            formularioRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        })
    }

    function alternarServico(
        idServico: number,
    ) {
        setServicosSelecionados(
            (selecionados) =>
                selecionados.includes(idServico)
                    ? selecionados.filter(
                        (id) =>
                            id !== idServico,
                    )
                    : [
                        ...selecionados,
                        idServico,
                    ],
        )
    }

    async function salvarPromocao(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErroFormulario('')
        setErro('')
        setSucesso('')

        const tituloLimpo =
            titulo.trim()

        const descontoNumero =
            Number(percentualDesconto)

        if (!tituloLimpo) {
            setErroFormulario(
                'Informe o título da promoção.',
            )

            return
        }

        if (
            Number.isNaN(descontoNumero) ||
            descontoNumero <= 0
        ) {
            setErroFormulario(
                'Informe um desconto maior que zero.',
            )

            return
        }

        if (!dataInicio || !dataFim) {
            setErroFormulario(
                'Informe o período da promoção.',
            )

            return
        }

        if (dataFim < dataInicio) {
            setErroFormulario(
                'A data final não pode ser anterior à data inicial.',
            )

            return
        }

        if (
            servicosSelecionados.length === 0
        ) {
            setErroFormulario(
                'Selecione pelo menos um serviço.',
            )

            return
        }

        const dados: PromocaoRequest = {
            idBarbearia:
                DEMO_IDS.barbearia,

            titulo:
                tituloLimpo,

            descricao:
                descricao.trim() || null,

            percentualDesconto:
                descontoNumero,

            dataInicio,
            dataFim,
            tipo,
        }

        try {
            setSalvando(true)

            if (promocaoEditando) {
                const atualizada =
                    await atualizarPromocao(
                        promocaoEditando.idPromocao,
                        dados,
                    )

                const vinculosAtuais =
                    vinculos.filter(
                        (vinculo) =>
                            vinculo.idPromocao ===
                            promocaoEditando.idPromocao,
                    )

                const idsAtuais =
                    vinculosAtuais.map(
                        (vinculo) =>
                            vinculo.idServico,
                    )

                const paraAdicionar =
                    servicosSelecionados.filter(
                        (idServico) =>
                            !idsAtuais.includes(
                                idServico,
                            ),
                    )

                const paraRemover =
                    vinculosAtuais.filter(
                        (vinculo) =>
                            !servicosSelecionados.includes(
                                vinculo.idServico,
                            ),
                    )

                await Promise.all(
                    paraRemover.map(
                        (vinculo) =>
                            excluirPromocaoServico(
                                vinculo.idPromocaoServico,
                            ),
                    ),
                )

                const novosVinculos =
                    await Promise.all(
                        paraAdicionar.map(
                            (idServico) =>
                                cadastrarPromocaoServico(
                                    {
                                        idPromocao:
                                            atualizada.idPromocao,

                                        idServico,
                                    },
                                ),
                        ),
                    )

                const idsRemovidos =
                    paraRemover.map(
                        (vinculo) =>
                            vinculo.idPromocaoServico,
                    )

                setVinculos((atuais) => [
                    ...atuais.filter(
                        (vinculo) =>
                            !idsRemovidos.includes(
                                vinculo.idPromocaoServico,
                            ),
                    ),
                    ...novosVinculos,
                ])

                setPromocoes((atuais) =>
                    atuais.map((promocao) =>
                        promocao.idPromocao ===
                            atualizada.idPromocao
                            ? atualizada
                            : promocao,
                    ),
                )

                setSucesso(
                    'Promoção atualizada com sucesso.',
                )
            } else {
                const cadastrada =
                    await cadastrarPromocao(
                        dados,
                    )

                const novosVinculos =
                    await Promise.all(
                        servicosSelecionados.map(
                            (idServico) =>
                                cadastrarPromocaoServico(
                                    {
                                        idPromocao:
                                            cadastrada.idPromocao,

                                        idServico,
                                    },
                                ),
                        ),
                    )

                setPromocoes((atuais) => [
                    ...atuais,
                    cadastrada,
                ])

                setVinculos((atuais) => [
                    ...atuais,
                    ...novosVinculos,
                ])

                setSucesso(
                    'Promoção cadastrada com sucesso.',
                )
            }

            limparFormulario()
        } catch (error) {
            console.error(error)

            setErroFormulario(
                'Não foi possível salvar a promoção.',
            )
        } finally {
            setSalvando(false)
        }
    }

    async function alterarStatus(
        promocao: Promocao,
    ) {
        try {
            setIdProcessando(
                promocao.idPromocao,
            )

            setErro('')
            setSucesso('')

            const atualizada =
                promocao.ativa
                    ? await desativarPromocao(
                        promocao.idPromocao,
                    )
                    : await ativarPromocao(
                        promocao.idPromocao,
                    )

            setPromocoes((atuais) =>
                atuais.map((item) =>
                    item.idPromocao ===
                        atualizada.idPromocao
                        ? atualizada
                        : item,
                ),
            )

            setSucesso(
                promocao.ativa
                    ? 'Promoção desativada com sucesso.'
                    : 'Promoção reativada com sucesso.',
            )
        } catch (error) {
            console.error(error)

            setErro(
                'Não foi possível alterar o status da promoção.',
            )
        } finally {
            setIdProcessando(null)
        }
    }

    function renderizarPromocao(
        promocao: Promocao,
    ) {
        return (
            <>
                <div className="admin-promotions__promo-info">
                    <strong>
                        {promocao.titulo}
                    </strong>

                    {promocao.descricao && (
                        <span>
                            {promocao.descricao}
                        </span>
                    )}
                </div>

                <span>
                    {formatarPercentual(
                        promocao.percentualDesconto,
                    )}
                    % •{' '}
                    {nomesServicosDaPromocao(
                        promocao.idPromocao,
                    )}
                </span>

                <span>
                    {formatarData(
                        promocao.dataInicio,
                    )}{' '}
                    —{' '}
                    {formatarData(
                        promocao.dataFim,
                    )}
                </span>

                <div className="admin-promotions__actions">
                    <button
                        type="button"
                        onClick={() =>
                            abrirEdicao(promocao)
                        }
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        disabled={
                            idProcessando ===
                            promocao.idPromocao
                        }
                        onClick={() =>
                            alterarStatus(promocao)
                        }
                    >
                        {idProcessando ===
                            promocao.idPromocao
                            ? 'Aguarde...'
                            : promocao.ativa
                                ? 'Desativar'
                                : 'Reativar'}
                    </button>
                </div>
            </>
        )
    }

    return (
        <section className="admin-promotions">
            <div className="admin-promotions__top">
                <div>
                    <h1>Promoções</h1>

                    <p className="admin-promotions__description admin-promotions__description--desktop">
                        Crie descontos por serviço ou combo
                    </p>

                    <p className="admin-promotions__description admin-promotions__description--mobile">
                        Descontos por serviço ou combo
                    </p>
                </div>

                <Button
                    variant="accent"
                    type="button"
                    onClick={irParaNovaPromocao}
                >
                    Nova promoção
                </Button>
            </div>

            {erro && (
                <p className="admin-promotions__feedback admin-promotions__feedback--error">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="admin-promotions__feedback admin-promotions__feedback--success">
                    {sucesso}
                </p>
            )}

            {carregando ? (
                <p className="admin-promotions__loading">
                    Carregando promoções...
                </p>
            ) : (
                <>
                    <section className="admin-promotions__section">
                        <div className="admin-promotions__panel">
                            <h2>
                                Promoções ativas
                            </h2>

                            <p className="admin-promotions__count">
                                {promocoesAtivas.length}{' '}
                                {promocoesAtivas.length ===
                                    1
                                    ? 'campanha'
                                    : 'campanhas'}
                            </p>

                            {promocoesAtivas.length ===
                                0 ? (
                                <p className="admin-promotions__empty">
                                    Nenhuma promoção ativa.
                                </p>
                            ) : (
                                <>
                                    <div className="admin-promotions__desktop-list">
                                        {promocoesAtivas.map(
                                            (promocao) => (
                                                <article
                                                    className="admin-promotions__row"
                                                    key={
                                                        promocao.idPromocao
                                                    }
                                                >
                                                    {renderizarPromocao(
                                                        promocao,
                                                    )}
                                                </article>
                                            ),
                                        )}
                                    </div>

                                    <div className="admin-promotions__mobile-list">
                                        {promocoesAtivas.map(
                                            (promocao) => (
                                                <article
                                                    className="admin-promotions__card"
                                                    key={
                                                        promocao.idPromocao
                                                    }
                                                >
                                                    <div className="admin-promotions__card-top">
                                                        <strong>
                                                            {
                                                                promocao.titulo
                                                            }
                                                        </strong>

                                                        <span className="admin-promotions__status admin-promotions__status--active">
                                                            Ativo
                                                        </span>
                                                    </div>

                                                    <p>
                                                        {formatarPercentual(
                                                            promocao.percentualDesconto,
                                                        )}
                                                        % •{' '}
                                                        {nomesServicosDaPromocao(
                                                            promocao.idPromocao,
                                                        )}{' '}
                                                        •{' '}
                                                        {formatarData(
                                                            promocao.dataInicio,
                                                        )}{' '}
                                                        —{' '}
                                                        {formatarData(
                                                            promocao.dataFim,
                                                        )}
                                                    </p>

                                                    <div className="admin-promotions__card-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                abrirEdicao(
                                                                    promocao,
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                alterarStatus(
                                                                    promocao,
                                                                )
                                                            }
                                                        >
                                                            Desativar
                                                        </button>
                                                    </div>
                                                </article>
                                            ),
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {promocoesInativas.length > 0 && (
                        <section className="admin-promotions__section">
                            <div className="admin-promotions__panel">
                                <h2>
                                    Promoções inativas
                                </h2>

                                <p className="admin-promotions__count">
                                    {
                                        promocoesInativas.length
                                    }{' '}
                                    {promocoesInativas.length ===
                                        1
                                        ? 'campanha'
                                        : 'campanhas'}
                                </p>

                                <div className="admin-promotions__desktop-list">
                                    {promocoesInativas.map(
                                        (promocao) => (
                                            <article
                                                className="admin-promotions__row admin-promotions__row--inactive"
                                                key={
                                                    promocao.idPromocao
                                                }
                                            >
                                                {renderizarPromocao(
                                                    promocao,
                                                )}
                                            </article>
                                        ),
                                    )}
                                </div>

                                <div className="admin-promotions__mobile-list">
                                    {promocoesInativas.map(
                                        (promocao) => (
                                            <article
                                                className="admin-promotions__card admin-promotions__card--inactive"
                                                key={
                                                    promocao.idPromocao
                                                }
                                            >
                                                <div className="admin-promotions__card-top">
                                                    <strong>
                                                        {
                                                            promocao.titulo
                                                        }
                                                    </strong>

                                                    <span className="admin-promotions__status admin-promotions__status--inactive">
                                                        Inativo
                                                    </span>
                                                </div>

                                                <p>
                                                    {formatarPercentual(
                                                        promocao.percentualDesconto,
                                                    )}
                                                    % •{' '}
                                                    {nomesServicosDaPromocao(
                                                        promocao.idPromocao,
                                                    )}
                                                </p>

                                                <div className="admin-promotions__card-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            abrirEdicao(
                                                                promocao,
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            alterarStatus(
                                                                promocao,
                                                            )
                                                        }
                                                    >
                                                        Reativar
                                                    </button>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    <div
                        className="admin-promotions__builder"
                        ref={formularioRef}
                    >
                        <h2>
                            {promocaoEditando
                                ? 'Editar promoção'
                                : 'Criar promoção rapidamente'}
                        </h2>

                        <form
                            className="admin-promotions__form"
                            onSubmit={salvarPromocao}
                        >
                            <div className="admin-promotions__fields">
                                <label className="admin-promotions__field admin-promotions__field--title">
                                    Título

                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={(event) =>
                                            setTitulo(
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Ex.: Semana do cliente"
                                    />
                                </label>

                                <label className="admin-promotions__field admin-promotions__field--discount">
                                    Desconto

                                    <div className="admin-promotions__discount-input">
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={
                                                percentualDesconto
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setPercentualDesconto(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            placeholder="10"
                                        />

                                        <span>%</span>
                                    </div>
                                </label>

                                <label className="admin-promotions__field">
                                    Tipo

                                    <select
                                        value={tipo}
                                        onChange={(event) =>
                                            setTipo(
                                                event.target
                                                    .value as TipoPromocao,
                                            )
                                        }
                                    >
                                        <option value="SERVICO">
                                            Serviço
                                        </option>

                                        <option value="COMBO">
                                            Combo
                                        </option>
                                    </select>
                                </label>
                            </div>

                            <div className="admin-promotions__dates">
                                <label className="admin-promotions__field">
                                    Data inicial

                                    <input
                                        type="date"
                                        value={dataInicio}
                                        onChange={(event) =>
                                            setDataInicio(
                                                event.target
                                                    .value,
                                            )
                                        }
                                    />
                                </label>

                                <label className="admin-promotions__field">
                                    Data final

                                    <input
                                        type="date"
                                        value={dataFim}
                                        min={dataInicio}
                                        onChange={(event) =>
                                            setDataFim(
                                                event.target
                                                    .value,
                                            )
                                        }
                                    />
                                </label>
                            </div>

                            <label className="admin-promotions__field">
                                Descrição

                                <textarea
                                    value={descricao}
                                    onChange={(event) =>
                                        setDescricao(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Descrição opcional"
                                />
                            </label>

                            <fieldset className="admin-promotions__services">
                                <legend>
                                    Serviços participantes
                                </legend>

                                <p>
                                    Selecione os serviços que
                                    receberão o desconto.
                                </p>

                                <div className="admin-promotions__services-grid">
                                    {servicos.map(
                                        (servico) => (
                                            <label
                                                className={[
                                                    'admin-promotions__service-option',
                                                    !servico.ativo
                                                        ? 'admin-promotions__service-option--inactive'
                                                        : '',
                                                ]
                                                    .filter(
                                                        Boolean,
                                                    )
                                                    .join(' ')}
                                                key={
                                                    servico.idServico
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={servicosSelecionados.includes(
                                                        servico.idServico,
                                                    )}
                                                    disabled={
                                                        !servico.ativo &&
                                                        !servicosSelecionados.includes(
                                                            servico.idServico,
                                                        )
                                                    }
                                                    onChange={() =>
                                                        alternarServico(
                                                            servico.idServico,
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        servico.nome
                                                    }

                                                    {!servico.ativo &&
                                                        ' (inativo)'}
                                                </span>
                                            </label>
                                        ),
                                    )}
                                </div>
                            </fieldset>

                            {erroFormulario && (
                                <p className="admin-promotions__form-error">
                                    {erroFormulario}
                                </p>
                            )}

                            <div className="admin-promotions__form-actions">
                                {promocaoEditando && (
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={
                                            limparFormulario
                                        }
                                    >
                                        Cancelar edição
                                    </Button>
                                )}

                                <Button
                                    variant="accent"
                                    type="submit"
                                    disabled={salvando}
                                >
                                    {salvando
                                        ? 'Salvando...'
                                        : promocaoEditando
                                            ? 'Salvar alterações'
                                            : 'Nova promoção'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </section>
    )
}

export default PromocoesProprietario