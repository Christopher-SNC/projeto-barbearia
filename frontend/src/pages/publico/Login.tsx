import axios from 'axios'
import {
    useState,
    type FormEvent,
} from 'react'
import {
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import './Login.css'

interface LoginLocationState {
    from?: string
}

function Login() {
    const { usuario, entrar } = useAuth()

    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    const estado =
        location.state as LoginLocationState | null

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
        setEnviando(true)

        try {
            await entrar(email, senha)

            navigate(destino, {
                replace: true,
            })
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                setErro('E-mail ou senha inválidos.')
            } else {
                setErro(
                    'Não foi possível entrar. Tente novamente.',
                )
            }
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-card__heading">
                    <span className="login-card__eyebrow">
                        Projeto Barbearia
                    </span>

                    <h1>Entrar</h1>

                    <p>
                        Acesse sua conta para gerenciar seus
                        agendamentos e perfis.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={enviar}
                >
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
                        Senha
                        <input
                            type="password"
                            value={senha}
                            onChange={(event) =>
                                setSenha(event.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {erro && (
                        <p
                            className="login-form__error"
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
                            ? 'Entrando...'
                            : 'Entrar'}
                    </button>
                </form>
            </section>
        </main>
    )
}

export default Login