import axios from 'axios'
import {
    useState,
    type FormEvent,
} from 'react'
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { cadastrarUsuario } from '../../services/usuarioService'

import './Cadastro.css'

interface CadastroLocationState {
    from?: string
}

interface ErroApi {
    erro?: string
}

function Cadastro() {
    const { usuario, entrar } = useAuth()

    const navigate = useNavigate()
    const location = useLocation()

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] =
        useState('')

    const [erro, setErro] = useState('')
    const [enviando, setEnviando] =
        useState(false)

    const estado =
        location.state as CadastroLocationState | null

    const destino = estado?.from ?? '/'

    if (usuario) {
        return (
            <Navigate
                to={destino}
                replace
            />
        )
    }

    async function enviar(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErro('')

        const nomeLimpo = nome.trim()
        const emailLimpo =
            email.trim().toLowerCase()
        const telefoneLimpo =
            telefone.trim() || null

        if (!nomeLimpo) {
            setErro('Informe seu nome.')
            return
        }

        if (!emailLimpo) {
            setErro('Informe seu e-mail.')
            return
        }

        if (!senha) {
            setErro('Informe uma senha.')
            return
        }

        if (senha !== confirmarSenha) {
            setErro(
                'A confirmação da senha não confere.',
            )
            return
        }

        setEnviando(true)

        try {
            await cadastrarUsuario({
                nome: nomeLimpo,
                email: emailLimpo,
                senha,
                telefone: telefoneLimpo,
            })

            try {
                await entrar(
                    emailLimpo,
                    senha,
                )

                navigate(destino, {
                    replace: true,
                })
            } catch (error) {
                console.error(error)

                setErro(
                    'Sua conta foi criada, mas não foi possível entrar automaticamente. Acesse a tela de login.',
                )
            }
        } catch (error) {
            if (axios.isAxiosError<ErroApi>(error)) {
                const mensagem =
                    error.response?.data?.erro

                if (mensagem) {
                    setErro(mensagem)
                    return
                }
            }

            console.error(error)

            setErro(
                'Não foi possível criar sua conta. Tente novamente.',
            )
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="cadastro-page">
            <section className="cadastro-card">
                <div className="cadastro-card__heading">
                    <span className="cadastro-card__eyebrow">
                        Projeto Barbearia
                    </span>

                    <h1>Criar conta</h1>

                    <p>
                        Cadastre-se para agendar serviços e
                        acompanhar seus agendamentos.
                    </p>
                </div>

                <form
                    className="cadastro-form"
                    onSubmit={enviar}
                >
                    <label>
                        Nome
                        <input
                            type="text"
                            value={nome}
                            onChange={(event) =>
                                setNome(event.target.value)
                            }
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label>
                        E-mail
                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label>
                        Telefone
                        <input
                            type="tel"
                            value={telefone}
                            onChange={(event) =>
                                setTelefone(
                                    event.target.value,
                                )
                            }
                            autoComplete="tel"
                        />
                    </label>

                    <label>
                        Senha
                        <input
                            type="password"
                            value={senha}
                            onChange={(event) =>
                                setSenha(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    <label>
                        Confirmar senha
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(event) =>
                                setConfirmarSenha(
                                    event.target.value,
                                )
                            }
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    {erro && (
                        <p
                            className="cadastro-form__error"
                            role="alert"
                        >
                            {erro}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={enviando}
                    >
                        {enviando
                            ? 'Criando conta...'
                            : 'Criar conta'}
                    </button>
                </form>

                <p className="cadastro-card__login">
                    Já possui uma conta?{' '}
                    <Link
                        to="/login"
                        state={{
                            from: destino,
                        }}
                    >
                        Entrar
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default Cadastro