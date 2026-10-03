import {
    useEffect,
    useState,
} from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'

import { DEMO_IDS } from '../../config/demo'

import {
    alterarSenhaUsuario,
    atualizarUsuario,
    buscarUsuarioPorId,
} from '../../services/usuarioService'

import '../proprietario/ConfiguracoesProprietario.css'
import './ConfiguracoesBarbeiro.css'

function formatarTelefone(valor: string) {
    const numeros = valor
        .replace(/\D/g, '')
        .slice(0, 11)

    if (numeros.length <= 2) {
        return numeros
    }

    if (numeros.length <= 7) {
        return `(${numeros.slice(
            0,
            2,
        )}) ${numeros.slice(2)}`
    }

    return `(${numeros.slice(
        0,
        2,
    )}) ${numeros.slice(
        2,
        7,
    )}-${numeros.slice(7)}`
}

function ConfiguracoesBarbeiro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] =
        useState('')

    const [senhaAtual, setSenhaAtual] =
        useState('')
    const [novaSenha, setNovaSenha] =
        useState('')
    const [
        confirmarNovaSenha,
        setConfirmarNovaSenha,
    ] = useState('')

    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] =
        useState('')

    useEffect(() => {
        let componenteAtivo = true

        buscarUsuarioPorId(
            DEMO_IDS.usuarioBarbeiro,
        )
            .then((usuario) => {
                if (!componenteAtivo) {
                    return
                }

                setNome(usuario.nome)
                setEmail(usuario.email)

                setTelefone(
                    usuario.telefone
                        ? formatarTelefone(
                            usuario.telefone,
                        )
                        : '',
                )
            })
            .catch(() => {
                if (componenteAtivo) {
                    setErro(
                        'Não foi possível carregar os dados do barbeiro.',
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
    }, [])

    async function salvarAlteracoes(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErro('')
        setSucesso('')

        if (!nome.trim()) {
            setErro(
                'Informe o nome do barbeiro.',
            )

            return
        }

        if (!email.trim()) {
            setErro(
                'Informe o e-mail do barbeiro.',
            )

            return
        }

        const desejaAlterarSenha =
            senhaAtual.length > 0 ||
            novaSenha.length > 0 ||
            confirmarNovaSenha.length > 0

        if (desejaAlterarSenha) {
            if (
                !senhaAtual ||
                !novaSenha ||
                !confirmarNovaSenha
            ) {
                setErro(
                    'Preencha todos os campos para alterar a senha.',
                )

                return
            }

            if (
                novaSenha !==
                confirmarNovaSenha
            ) {
                setErro(
                    'A confirmação da nova senha não confere.',
                )

                return
            }
        }

        try {
            setSalvando(true)

            const usuarioAtualizado =
                await atualizarUsuario(
                    DEMO_IDS.usuarioBarbeiro,
                    {
                        nome: nome.trim(),
                        email: email.trim(),
                        telefone:
                            telefone.replace(
                                /\D/g,
                                '',
                            ) || null,
                    },
                )

            if (desejaAlterarSenha) {
                await alterarSenhaUsuario(
                    DEMO_IDS.usuarioBarbeiro,
                    {
                        senhaAtual,
                        novaSenha,
                        confirmarNovaSenha,
                    },
                )

                setSenhaAtual('')
                setNovaSenha('')
                setConfirmarNovaSenha('')
            }

            setNome(
                usuarioAtualizado.nome,
            )

            setEmail(
                usuarioAtualizado.email,
            )

            setTelefone(
                usuarioAtualizado.telefone
                    ? formatarTelefone(
                        usuarioAtualizado.telefone,
                    )
                    : '',
            )

            setSucesso(
                desejaAlterarSenha
                    ? 'Perfil e senha atualizados com sucesso.'
                    : 'Perfil atualizado com sucesso.',
            )
        } catch {
            setErro(
                desejaAlterarSenha
                    ? 'Não foi possível salvar as alterações. Verifique a senha atual e tente novamente.'
                    : 'Não foi possível atualizar o perfil.',
            )
        } finally {
            setSalvando(false)
        }
    }

    if (carregando) {
        return (
            <main className="admin-settings">
                <p>
                    Carregando configurações...
                </p>
            </main>
        )
    }

    return (
        <form
            className="admin-settings"
            onSubmit={salvarAlteracoes}
        >
            <header className="admin-settings__topbar">
                <div>
                    <h1>
                        Configurações e Perfil
                    </h1>

                    <p className="admin-settings__subtitle-desktop">
                        Gerencie seus dados pessoais
                        e sua segurança
                    </p>

                    <p className="admin-settings__subtitle-mobile">
                        Perfil e segurança
                    </p>
                </div>

                <Button
                    className="admin-settings__save-desktop"
                    type="submit"
                    disabled={salvando}
                >
                    {salvando
                        ? 'Salvando...'
                        : 'Salvar alterações'}
                </Button>
            </header>

            {erro && (
                <div className="admin-settings__message admin-settings__message--error">
                    {erro}
                </div>
            )}

            {sucesso && (
                <div className="admin-settings__message admin-settings__message--success">
                    {sucesso}
                </div>
            )}

            <div className="admin-settings__columns">
                <section className="admin-settings__card">
                    <h2>
                        Perfil do barbeiro
                    </h2>

                    <label className="admin-settings__field">
                        <span>Nome</span>

                        <input
                            type="text"
                            value={nome}
                            maxLength={100}
                            onChange={(event) =>
                                setNome(
                                    event.target
                                        .value,
                                )
                            }
                        />
                    </label>

                    <label className="admin-settings__field">
                        <span>E-mail</span>

                        <input
                            type="email"
                            value={email}
                            maxLength={150}
                            onChange={(event) =>
                                setEmail(
                                    event.target
                                        .value,
                                )
                            }
                        />
                    </label>

                    <label className="admin-settings__field">
                        <span>Telefone</span>

                        <input
                            type="tel"
                            value={telefone}
                            maxLength={15}
                            onChange={(event) =>
                                setTelefone(
                                    formatarTelefone(
                                        event
                                            .target
                                            .value,
                                    ),
                                )
                            }
                        />
                    </label>
                </section>

                <section className="admin-settings__card">
                    <h2>
                        Acesso e segurança
                    </h2>

                    <label className="admin-settings__field">
                        <span>
                            Senha atual
                        </span>

                        <input
                            type="password"
                            value={senhaAtual}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(event) =>
                                setSenhaAtual(
                                    event.target
                                        .value,
                                )
                            }
                        />
                    </label>

                    <label className="admin-settings__field">
                        <span>
                            Nova senha
                        </span>

                        <input
                            type="password"
                            value={novaSenha}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(event) =>
                                setNovaSenha(
                                    event.target
                                        .value,
                                )
                            }
                        />
                    </label>

                    <label className="admin-settings__field">
                        <span>
                            Confirmar nova senha
                        </span>

                        <input
                            type="password"
                            value={
                                confirmarNovaSenha
                            }
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(event) =>
                                setConfirmarNovaSenha(
                                    event.target
                                        .value,
                                )
                            }
                        />
                    </label>

                    <p className="admin-settings__hint">
                        Preencha os campos de senha
                        somente quando desejar
                        alterá-la.
                    </p>
                </section>
            </div>

            <Button
                className="admin-settings__save-mobile"
                variant="accent"
                fullWidth
                type="submit"
                disabled={salvando}
            >
                {salvando
                    ? 'Salvando...'
                    : 'Salvar alterações'}
            </Button>
        </form>
    )
}

export default ConfiguracoesBarbeiro