import {
    useEffect,
    useMemo,
    useState,
} from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'

import {
    ativarServico,
    atualizarServico,
    cadastrarServico,
    desativarServico,
    listarServicos,
} from '../../services/servicoService'

import type {
    Servico,
    ServicoRequest,
} from '../../types/Servico'

import './ServicosProprietario.css'

const ID_BARBEARIA_ADMIN_TESTE = 1

function formatarPreco(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor)
}

function ServicosProprietario() {
    const [servicos, setServicos] = useState<
        Servico[]
    >([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const [formularioAberto, setFormularioAberto] =
        useState(false)

    const [servicoEditando, setServicoEditando] =
        useState<Servico | null>(null)

    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [preco, setPreco] = useState('')
    const [duracao, setDuracao] = useState('')

    const [erroFormulario, setErroFormulario] =
        useState('')

    const [salvando, setSalvando] =
        useState(false)

    const [idProcessando, setIdProcessando] =
        useState<number | null>(null)

    useEffect(() => {
        async function carregarServicos() {
            try {
                const dados = await listarServicos()

                setServicos(
                    dados.filter(
                        (servico) =>
                            servico.idBarbearia ===
                            ID_BARBEARIA_ADMIN_TESTE,
                    ),
                )
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar os serviços.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarServicos()
    }, [])

    const servicosAtivos = useMemo(() => {
        return servicos
            .filter((servico) => servico.ativo)
            .sort((a, b) =>
                a.nome.localeCompare(b.nome),
            )
    }, [servicos])

    const servicosInativos = useMemo(() => {
        return servicos
            .filter((servico) => !servico.ativo)
            .sort((a, b) =>
                a.nome.localeCompare(b.nome),
            )
    }, [servicos])

    function limparFormulario() {
        setNome('')
        setDescricao('')
        setPreco('')
        setDuracao('')
        setServicoEditando(null)
        setErroFormulario('')
    }

    function abrirNovoServico() {
        limparFormulario()
        setSucesso('')
        setFormularioAberto(true)
    }

    function abrirEdicao(servico: Servico) {
        setServicoEditando(servico)
        setNome(servico.nome)
        setDescricao(servico.descricao ?? '')
        setPreco(String(servico.preco))
        setDuracao(String(servico.duracaoMinutos))
        setErroFormulario('')
        setSucesso('')
        setFormularioAberto(true)
    }

    function fecharFormulario() {
        setFormularioAberto(false)
        limparFormulario()
    }

    async function salvarServico(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErroFormulario('')
        setErro('')
        setSucesso('')

        const nomeLimpo = nome.trim()
        const precoNumero = Number(preco)
        const duracaoNumero = Number(duracao)

        if (!nomeLimpo) {
            setErroFormulario(
                'Informe o nome do serviço.',
            )

            return
        }

        if (
            Number.isNaN(precoNumero) ||
            precoNumero < 0
        ) {
            setErroFormulario(
                'Informe um preço válido.',
            )

            return
        }

        if (
            Number.isNaN(duracaoNumero) ||
            duracaoNumero <= 0
        ) {
            setErroFormulario(
                'Informe uma duração válida.',
            )

            return
        }

        const dados: ServicoRequest = {
            idBarbearia:
                ID_BARBEARIA_ADMIN_TESTE,
            nome: nomeLimpo,
            descricao:
                descricao.trim() || null,
            preco: precoNumero,
            duracaoMinutos: duracaoNumero,
        }

        try {
            setSalvando(true)

            if (servicoEditando) {
                const atualizado =
                    await atualizarServico(
                        servicoEditando.idServico,
                        dados,
                    )

                setServicos((atuais) =>
                    atuais.map((servico) =>
                        servico.idServico ===
                            atualizado.idServico
                            ? atualizado
                            : servico,
                    ),
                )

                setSucesso(
                    'Serviço atualizado com sucesso.',
                )
            } else {
                const cadastrado =
                    await cadastrarServico(dados)

                setServicos((atuais) => [
                    ...atuais,
                    cadastrado,
                ])

                setSucesso(
                    'Serviço cadastrado com sucesso.',
                )
            }

            fecharFormulario()
        } catch (error) {
            console.error(error)

            setErroFormulario(
                'Não foi possível salvar o serviço.',
            )
        } finally {
            setSalvando(false)
        }
    }

    async function alterarStatus(
        servico: Servico,
    ) {
        try {
            setIdProcessando(servico.idServico)
            setErro('')
            setSucesso('')

            const atualizado = servico.ativo
                ? await desativarServico(
                    servico.idServico,
                )
                : await ativarServico(
                    servico.idServico,
                )

            setServicos((atuais) =>
                atuais.map((item) =>
                    item.idServico ===
                        atualizado.idServico
                        ? atualizado
                        : item,
                ),
            )

            setSucesso(
                servico.ativo
                    ? 'Serviço desativado com sucesso.'
                    : 'Serviço reativado com sucesso.',
            )
        } catch (error) {
            console.error(error)

            setErro(
                'Não foi possível alterar o status do serviço.',
            )
        } finally {
            setIdProcessando(null)
        }
    }

    return (
        <section className="admin-services">
            <div className="admin-services__top">
                <div>
                    <h1>Serviços</h1>

                    <p className="admin-services__description admin-services__description--desktop">
                        Cadastre preços, duração e
                        disponibilidade
                    </p>

                    <p className="admin-services__description admin-services__description--mobile">
                        Preços, duração e disponibilidade
                    </p>
                </div>

                <Button
                    variant="accent"
                    type="button"
                    onClick={abrirNovoServico}
                >
                    Novo serviço
                </Button>
            </div>

            {erro && (
                <p className="admin-services__feedback admin-services__feedback--error">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="admin-services__feedback admin-services__feedback--success">
                    {sucesso}
                </p>
            )}

            {carregando ? (
                <p className="admin-services__loading">
                    Carregando serviços...
                </p>
            ) : (
                <>
                    <section className="admin-services__section">
                        <h2>Serviços ativos</h2>

                        <p className="admin-services__count">
                            {servicosAtivos.length}{' '}
                            {servicosAtivos.length === 1
                                ? 'serviço ativo'
                                : 'serviços ativos'}
                        </p>

                        {servicosAtivos.length === 0 ? (
                            <p className="admin-services__empty">
                                Nenhum serviço ativo.
                            </p>
                        ) : (
                            <>
                                <div className="admin-services__desktop-list">
                                    {servicosAtivos.map(
                                        (servico) => (
                                            <article
                                                className="admin-services__row"
                                                key={servico.idServico}
                                            >
                                                <div className="admin-services__service-info">
                                                    <strong>
                                                        {servico.nome}
                                                    </strong>

                                                    {servico.descricao && (
                                                        <span>
                                                            {servico.descricao}
                                                        </span>
                                                    )}
                                                </div>

                                                <span>
                                                    {servico.duracaoMinutos}{' '}
                                                    min
                                                </span>

                                                <span>
                                                    {formatarPreco(
                                                        servico.preco,
                                                    )}
                                                </span>

                                                <span className="admin-services__status admin-services__status--active">
                                                    Ativo
                                                </span>

                                                <div className="admin-services__actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            abrirEdicao(
                                                                servico,
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            idProcessando ===
                                                            servico.idServico
                                                        }
                                                        onClick={() =>
                                                            alterarStatus(
                                                                servico,
                                                            )
                                                        }
                                                    >
                                                        {idProcessando ===
                                                            servico.idServico
                                                            ? 'Aguarde...'
                                                            : 'Desativar'}
                                                    </button>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>

                                <div className="admin-services__mobile-list">
                                    {servicosAtivos.map(
                                        (servico) => (
                                            <article
                                                className="admin-services__card"
                                                key={servico.idServico}
                                            >
                                                <div className="admin-services__card-top">
                                                    <strong>
                                                        {servico.nome}
                                                    </strong>

                                                    <span className="admin-services__status admin-services__status--active">
                                                        Ativo
                                                    </span>
                                                </div>

                                                <p>
                                                    {servico.duracaoMinutos}{' '}
                                                    min •{' '}
                                                    {formatarPreco(
                                                        servico.preco,
                                                    )}
                                                </p>

                                                {servico.descricao && (
                                                    <p>
                                                        {servico.descricao}
                                                    </p>
                                                )}

                                                <div className="admin-services__card-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            abrirEdicao(
                                                                servico,
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            idProcessando ===
                                                            servico.idServico
                                                        }
                                                        onClick={() =>
                                                            alterarStatus(
                                                                servico,
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
                    </section>

                    <section className="admin-services__section">
                        <h2>Serviços inativos</h2>

                        {servicosInativos.length === 0 ? (
                            <p className="admin-services__empty">
                                Nenhum serviço inativo.
                            </p>
                        ) : (
                            <>
                                <div className="admin-services__desktop-list">
                                    {servicosInativos.map(
                                        (servico) => (
                                            <article
                                                className="admin-services__row admin-services__row--inactive"
                                                key={servico.idServico}
                                            >
                                                <div className="admin-services__service-info">
                                                    <strong>
                                                        {servico.nome}
                                                    </strong>

                                                    {servico.descricao && (
                                                        <span>
                                                            {servico.descricao}
                                                        </span>
                                                    )}
                                                </div>

                                                <span>
                                                    {servico.duracaoMinutos}{' '}
                                                    min
                                                </span>

                                                <span>
                                                    {formatarPreco(
                                                        servico.preco,
                                                    )}
                                                </span>

                                                <span className="admin-services__status admin-services__status--inactive">
                                                    Inativo
                                                </span>

                                                <div className="admin-services__actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            abrirEdicao(
                                                                servico,
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            idProcessando ===
                                                            servico.idServico
                                                        }
                                                        onClick={() =>
                                                            alterarStatus(
                                                                servico,
                                                            )
                                                        }
                                                    >
                                                        {idProcessando ===
                                                            servico.idServico
                                                            ? 'Aguarde...'
                                                            : 'Reativar'}
                                                    </button>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>

                                <div className="admin-services__mobile-list">
                                    {servicosInativos.map(
                                        (servico) => (
                                            <article
                                                className="admin-services__card admin-services__card--inactive"
                                                key={servico.idServico}
                                            >
                                                <div className="admin-services__card-top">
                                                    <strong>
                                                        {servico.nome}
                                                    </strong>

                                                    <span className="admin-services__status admin-services__status--inactive">
                                                        Inativo
                                                    </span>
                                                </div>

                                                <p>
                                                    {servico.duracaoMinutos}{' '}
                                                    min •{' '}
                                                    {formatarPreco(
                                                        servico.preco,
                                                    )}
                                                </p>

                                                <div className="admin-services__card-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            abrirEdicao(
                                                                servico,
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            idProcessando ===
                                                            servico.idServico
                                                        }
                                                        onClick={() =>
                                                            alterarStatus(
                                                                servico,
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
                            </>
                        )}
                    </section>

                    <div className="admin-services__mobile-new">
                        <Button
                            variant="accent"
                            fullWidth
                            type="button"
                            onClick={abrirNovoServico}
                        >
                            Novo serviço
                        </Button>
                    </div>
                </>
            )}

            {formularioAberto && (
                <div
                    className="admin-services__modal"
                    role="presentation"
                    onMouseDown={fecharFormulario}
                >
                    <div
                        className="admin-services__modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="service-form-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-services__modal-header">
                            <div>
                                <h2 id="service-form-title">
                                    {servicoEditando
                                        ? 'Editar serviço'
                                        : 'Novo serviço'}
                                </h2>

                                <p>
                                    Informe os dados do serviço.
                                </p>
                            </div>

                            <button
                                className="admin-services__close"
                                type="button"
                                aria-label="Fechar"
                                onClick={fecharFormulario}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="admin-services__form"
                            onSubmit={salvarServico}
                        >
                            <label>
                                Nome
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(event) =>
                                        setNome(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Ex.: Corte tradicional"
                                />
                            </label>

                            <label>
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

                            <div className="admin-services__form-grid">
                                <label>
                                    Preço
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={preco}
                                        onChange={(event) =>
                                            setPreco(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="35,00"
                                    />
                                </label>

                                <label>
                                    Duração
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={duracao}
                                        onChange={(event) =>
                                            setDuracao(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="30"
                                    />
                                </label>
                            </div>

                            {erroFormulario && (
                                <p className="admin-services__form-error">
                                    {erroFormulario}
                                </p>
                            )}

                            <div className="admin-services__form-actions">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={fecharFormulario}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="accent"
                                    type="submit"
                                    disabled={salvando}
                                >
                                    {salvando
                                        ? 'Salvando...'
                                        : servicoEditando
                                            ? 'Salvar alterações'
                                            : 'Cadastrar serviço'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ServicosProprietario