import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from 'react'

import Button from '../../components/Button/Button'

import {
    ativarFoto,
    atualizarFoto,
    cadastrarFoto,
    desativarFoto,
    excluirFoto,
    listarFotos,
} from '../../services/fotoService'

import type {
    Foto,
    FotoRequest,
} from '../../types/Foto'

import './FotosProprietario.css'

import useBarbeariaProprietario from '../../hooks/useBarbeariaProprietario'

function FotosProprietario() {
    const idBarbearia =
        useBarbeariaProprietario()
    const [fotos, setFotos] = useState<Foto[]>([])

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)
    const [processandoId, setProcessandoId] =
        useState<number | null>(null)

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const [formAberto, setFormAberto] = useState(false)
    const [fotoEdicao, setFotoEdicao] =
        useState<Foto | null>(null)

    const [url, setUrl] = useState('')
    const [legenda, setLegenda] = useState('')

    const carregarFotos = useCallback(async () => {
        setCarregando(true)
        setErro('')

        try {
            const dados = await listarFotos()

            const fotosDaBarbearia = dados
                .filter(
                    (foto) =>
                        foto.idBarbearia ===
                        idBarbearia,
                )
                .sort(
                    (fotoA, fotoB) =>
                        fotoA.ordem - fotoB.ordem,
                )

            setFotos(fotosDaBarbearia)
        } catch {
            setErro(
                'Não foi possível carregar as fotos da barbearia.',
            )
        } finally {
            setCarregando(false)
        }
    }, [idBarbearia])

    useEffect(() => {
        let componenteAtivo = true

        listarFotos()
            .then((dados) => {
                if (!componenteAtivo) {
                    return
                }

                const fotosDaBarbearia = dados
                    .filter(
                        (foto) =>
                            foto.idBarbearia ===
                            idBarbearia,
                    )
                    .sort(
                        (fotoA, fotoB) =>
                            fotoA.ordem - fotoB.ordem,
                    )

                setFotos(fotosDaBarbearia)
            })
            .catch(() => {
                if (componenteAtivo) {
                    setErro(
                        'Não foi possível carregar as fotos da barbearia.',
                    )
                }
            })
            .finally(() => {
                if (componenteAtivo) {
                    setCarregando(false)
                }
            })

        return () => {
            componenteAtivo = false
        }
    }, [idBarbearia])

    function abrirCadastro() {
        setFotoEdicao(null)
        setUrl('')
        setLegenda('')
        setErro('')
        setSucesso('')
        setFormAberto(true)
    }

    function abrirEdicao(foto: Foto) {
        setFotoEdicao(foto)
        setUrl(foto.url)
        setLegenda(foto.legenda ?? '')
        setErro('')
        setSucesso('')
        setFormAberto(true)
    }

    function fecharFormulario() {
        if (salvando) {
            return
        }

        setFormAberto(false)
        setFotoEdicao(null)
        setUrl('')
        setLegenda('')
    }

    async function salvarFoto(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        const urlLimpa = url.trim()
        const legendaLimpa = legenda.trim()

        if (!urlLimpa) {
            setErro('Informe a URL da foto.')
            return
        }

        setSalvando(true)
        setErro('')
        setSucesso('')

        try {
            const maiorOrdem = fotos.reduce(
                (maior, foto) =>
                    Math.max(maior, foto.ordem),
                0,
            )

            const dados: FotoRequest = {
                idBarbearia:
                    idBarbearia,
                url: urlLimpa,
                legenda: legendaLimpa || null,
                ordem:
                    fotoEdicao?.ordem ??
                    maiorOrdem + 1,
            }

            if (fotoEdicao) {
                await atualizarFoto(
                    fotoEdicao.idFoto,
                    dados,
                )

                setSucesso(
                    'Foto atualizada com sucesso.',
                )
            } else {
                await cadastrarFoto(dados)

                setSucesso(
                    'Foto adicionada com sucesso.',
                )
            }

            setFormAberto(false)
            setFotoEdicao(null)
            setUrl('')
            setLegenda('')

            await carregarFotos()
        } catch {
            setErro(
                'Não foi possível salvar a foto.',
            )
        } finally {
            setSalvando(false)
        }
    }

    async function alternarStatus(foto: Foto) {
        setProcessandoId(foto.idFoto)
        setErro('')
        setSucesso('')

        try {
            if (foto.ativa) {
                await desativarFoto(foto.idFoto)

                setSucesso(
                    'Foto desativada com sucesso.',
                )
            } else {
                await ativarFoto(foto.idFoto)

                setSucesso(
                    'Foto ativada com sucesso.',
                )
            }

            await carregarFotos()
        } catch {
            setErro(
                'Não foi possível alterar o status da foto.',
            )
        } finally {
            setProcessandoId(null)
        }
    }

    async function reordenarFoto(
        foto: Foto,
        direcao: 'subir' | 'descer',
    ) {
        const indiceAtual = fotos.findIndex(
            (item) =>
                item.idFoto === foto.idFoto,
        )

        const indiceDestino =
            direcao === 'subir'
                ? indiceAtual - 1
                : indiceAtual + 1

        if (
            indiceAtual < 0 ||
            indiceDestino < 0 ||
            indiceDestino >= fotos.length
        ) {
            return
        }

        const fotoDestino =
            fotos[indiceDestino]

        setProcessandoId(foto.idFoto)
        setErro('')
        setSucesso('')

        try {
            await Promise.all([
                atualizarFoto(foto.idFoto, {
                    idBarbearia:
                        idBarbearia,
                    url: foto.url,
                    legenda: foto.legenda,
                    ordem: fotoDestino.ordem,
                }),

                atualizarFoto(fotoDestino.idFoto, {
                    idBarbearia:
                        idBarbearia,
                    url: fotoDestino.url,
                    legenda: fotoDestino.legenda,
                    ordem: foto.ordem,
                }),
            ])

            setSucesso(
                'Ordem das fotos atualizada.',
            )

            await carregarFotos()
        } catch {
            setErro(
                'Não foi possível reordenar as fotos.',
            )
        } finally {
            setProcessandoId(null)
        }
    }

    async function removerFoto(foto: Foto) {
        const confirmou = window.confirm(
            `Excluir a foto "${foto.legenda ?? 'Sem legenda'}"?`,
        )

        if (!confirmou) {
            return
        }

        setProcessandoId(foto.idFoto)
        setErro('')
        setSucesso('')

        try {
            await excluirFoto(foto.idFoto)

            setSucesso(
                'Foto excluída com sucesso.',
            )

            await carregarFotos()
        } catch {
            setErro(
                'Não foi possível excluir a foto.',
            )
        } finally {
            setProcessandoId(null)
        }
    }

    return (
        <main className="admin-photos">
            <div className="admin-photos__topbar">
                <div>
                    <h1>Fotos da Barbearia</h1>

                    <p className="admin-photos__subtitle-desktop">
                        Gerencie as imagens exibidas para os clientes
                    </p>

                    <p className="admin-photos__subtitle-mobile">
                        Imagens exibidas para os clientes
                    </p>
                </div>

                <div className="admin-photos__desktop-add">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={abrirCadastro}
                    >
                        Adicionar foto
                    </Button>
                </div>
            </div>

            {erro && (
                <div className="admin-photos__message admin-photos__message--error">
                    {erro}
                </div>
            )}

            {sucesso && (
                <div className="admin-photos__message admin-photos__message--success">
                    {sucesso}
                </div>
            )}

            <section className="admin-photos__guidance">
                <h2>Galeria pública</h2>

                <p className="admin-photos__guidance-desktop">
                    Use fotos do ambiente, fachada e
                    cortes. A primeira imagem ativa
                    aparece como destaque no perfil da
                    barbearia.
                </p>

                <p className="admin-photos__guidance-mobile">
                    A primeira foto ativa aparece como
                    destaque no perfil público.
                </p>
            </section>

            {carregando ? (
                <p className="admin-photos__state">
                    Carregando fotos...
                </p>
            ) : fotos.length === 0 ? (
                <div className="admin-photos__empty">
                    <strong>
                        Nenhuma foto cadastrada.
                    </strong>

                    <p>
                        Adicione imagens para montar a
                        galeria pública da barbearia.
                    </p>
                </div>
            ) : (
                <section className="admin-photos__grid">
                    {fotos.map((foto, indice) => {
                        const processando =
                            processandoId === foto.idFoto

                        return (
                            <article
                                className="admin-photo-card"
                                key={foto.idFoto}
                            >
                                <img
                                    className="admin-photo-card__image"
                                    src={foto.url}
                                    alt={
                                        foto.legenda ??
                                        'Foto da barbearia'
                                    }
                                />

                                <div className="admin-photo-card__content">
                                    <strong>
                                        {foto.legenda ||
                                            'Foto sem legenda'}
                                    </strong>

                                    <span
                                        className={[
                                            'admin-photo-card__status',
                                            foto.ativa
                                                ? 'admin-photo-card__status--active'
                                                : 'admin-photo-card__status--inactive',
                                        ].join(' ')}
                                    >
                                        <span
                                            className="admin-photo-card__status-dot"
                                            aria-hidden="true"
                                        />

                                        {foto.ativa ? 'Ativa' : 'Inativa'}
                                    </span>

                                    <div className="admin-photo-card__actions">
                                        <button
                                            className="admin-photo-card__action admin-photo-card__action--edit"
                                            type="button"
                                            disabled={processando}
                                            onClick={() =>
                                                abrirEdicao(foto)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="admin-photo-card__action admin-photo-card__action--move"
                                            type="button"
                                            title="Mover para cima"
                                            aria-label="Mover foto para cima"
                                            disabled={
                                                processando ||
                                                indice === 0
                                            }
                                            onClick={() =>
                                                void reordenarFoto(
                                                    foto,
                                                    'subir',
                                                )
                                            }
                                        >
                                            ↑
                                        </button>

                                        <button
                                            className="admin-photo-card__action admin-photo-card__action--move"
                                            type="button"
                                            title="Mover para baixo"
                                            aria-label="Mover foto para baixo"
                                            disabled={
                                                processando ||
                                                indice ===
                                                fotos.length - 1
                                            }
                                            onClick={() =>
                                                void reordenarFoto(
                                                    foto,
                                                    'descer',
                                                )
                                            }
                                        >
                                            ↓
                                        </button>

                                        <button
                                            className={[
                                                'admin-photo-card__action',
                                                foto.ativa
                                                    ? 'admin-photo-card__action--deactivate'
                                                    : 'admin-photo-card__action--activate',
                                            ].join(' ')}
                                            type="button"
                                            disabled={processando}
                                            onClick={() =>
                                                void alternarStatus(foto)
                                            }
                                        >
                                            {foto.ativa
                                                ? 'Desativar'
                                                : 'Ativar'}
                                        </button>

                                        <button
                                            className="admin-photo-card__action admin-photo-card__action--delete"
                                            type="button"
                                            disabled={processando}
                                            onClick={() =>
                                                void removerFoto(foto)
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </section>
            )}

            <div className="admin-photos__mobile-add">
                <Button
                    type="button"
                    variant="accent"
                    fullWidth
                    onClick={abrirCadastro}
                >
                    Adicionar foto
                </Button>
            </div>

            {formAberto && (
                <div
                    className="admin-photo-modal"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            fecharFormulario()
                        }
                    }}
                >
                    <div
                        className="admin-photo-modal__panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="foto-form-title"
                    >
                        <div className="admin-photo-modal__header">
                            <div>
                                <h2 id="foto-form-title">
                                    {fotoEdicao
                                        ? 'Editar foto'
                                        : 'Adicionar foto'}
                                </h2>

                                <p>
                                    Informe a imagem que será
                                    exibida na galeria pública.
                                </p>
                            </div>

                            <button
                                className="admin-photo-modal__close"
                                type="button"
                                aria-label="Fechar"
                                onClick={fecharFormulario}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="admin-photo-form"
                            onSubmit={salvarFoto}
                        >
                            <label>
                                URL da imagem

                                <input
                                    type="text"
                                    value={url}
                                    placeholder="/imagens/barbearias/barbearia-teste/foto.png"
                                    onChange={(event) =>
                                        setUrl(
                                            event.target.value,
                                        )
                                    }
                                />
                            </label>

                            <label>
                                Legenda

                                <input
                                    type="text"
                                    value={legenda}
                                    placeholder="Ex.: Fachada principal"
                                    maxLength={255}
                                    onChange={(event) =>
                                        setLegenda(
                                            event.target.value,
                                        )
                                    }
                                />
                            </label>

                            <div className="admin-photo-form__actions">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={salvando}
                                    onClick={
                                        fecharFormulario
                                    }
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={salvando}
                                >
                                    {salvando
                                        ? 'Salvando...'
                                        : fotoEdicao
                                            ? 'Salvar alterações'
                                            : 'Adicionar foto'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default FotosProprietario