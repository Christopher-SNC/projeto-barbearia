import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'

import {
    alterarSenhaUsuario,
    atualizarUsuario,
    buscarUsuarioPorId,
} from '../../services/usuarioService'

import './ConfiguracoesProprietario.css'

const ID_USUARIO_PROPRIETARIO_TESTE = 2

function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11)

    if (numeros.length <= 2) {
        return numeros
    }

    if (numeros.length <= 7) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}

function ConfiguracoesProprietario() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')

    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarNovaSenha, setConfirmarNovaSenha] =
        useState('')

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    useEffect(() => {
        let componenteAtivo = true

        buscarUsuarioPorId(ID_USUARIO_PROPRIETARIO_TESTE)
            .then((usuario) => {
                if (!componenteAtivo) {
                    return
                }

                setNome(usuario.nome)
                setEmail(usuario.email)
                setTelefone(
                    usuario.telefone
                        ? formatarTelefone(usuario.telefone)
                        : '',
                )
            })
            .catch(() => {
                if (componenteAtivo) {
                    setErro(
                        'Não foi possível carregar os dados do proprietário.',
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
            setErro('Informe o nome do proprietário.')
            return
        }

        if (!email.trim()) {
            setErro('Informe o e-mail do proprietário.')
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

            if (novaSenha !== confirmarNovaSenha) {
                setErro(
                    'A confirmação da nova senha não confere.',
                )
                return
            }
        }

        try {
            setSalvando(true)

            const usuarioAtualizado = await atualizarUsuario(
                ID_USUARIO_PROPRIETARIO_TESTE,
                {
                    nome: nome.trim(),
                    email: email.trim(),
                    telefone:
                        telefone.replace(/\D/g, '') || null,
                },
            )

            if (desejaAlterarSenha) {
                await alterarSenhaUsuario(
                    ID_USUARIO_PROPRIETARIO_TESTE,
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

            setNome(usuarioAtualizado.nome)
            setEmail(usuarioAtualizado.email)
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
                <p>Carregando configurações...</p>
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
                    <h1>Configurações e Perfil</h1>

                    <p className="admin-settings__subtitle-desktop">
                        Gerencie sua conta e preferências administrativas
                    </p>

                    <p className="admin-settings__subtitle-mobile">
                        Conta e preferências administrativas
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
                    <h2>Perfil do proprietário</h2>

                    <label className="admin-settings__field">
                        <span>Nome</span>

                        <input
                            type="text"
                            value={nome}
                            maxLength={100}
                            onChange={(event) =>
                                setNome(event.target.value)
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
                                setEmail(event.target.value)
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
                                        event.target.value,
                                    ),
                                )
                            }
                        />
                    </label>
                </section>

                <section className="admin-settings__card">
                    <h2>Acesso e segurança</h2>

                    <label className="admin-settings__field">
                        <span>Senha atual</span>

                        <input
                            type="password"
                            value={senhaAtual}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(event) =>
                                setSenhaAtual(event.target.value)
                            }
                        />
                    </label>

                    <label className="admin-settings__field">
                        <span>Nova senha</span>

                        <input
                            type="password"
                            value={novaSenha}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(event) =>
                                setNovaSenha(event.target.value)
                            }
                        />
                    </label>

                    <label className="admin-settings__field">
                        <span>Confirmar nova senha</span>

                        <input
                            type="password"
                            value={confirmarNovaSenha}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(event) =>
                                setConfirmarNovaSenha(
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <p className="admin-settings__hint">
                        Use uma senha forte e diferente da utilizada
                        em outros serviços.
                    </p>
                </section>
            </div>

            <section className="admin-settings__card admin-settings__preferences">
                <h2>Preferências</h2>

                <div className="admin-settings__preference">
                    <span>
                        Receber avisos de novos agendamentos
                    </span>

                    <strong>Ativado</strong>
                </div>

                <div className="admin-settings__preference">
                    <span>
                        Receber alertas de cancelamento
                    </span>

                    <strong>Ativado</strong>
                </div>

                <div className="admin-settings__preference">
                    <span>
                        Exibir avaliações no perfil público
                    </span>

                    <strong>Ativado</strong>
                </div>
            </section>

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

export default ConfiguracoesProprietario