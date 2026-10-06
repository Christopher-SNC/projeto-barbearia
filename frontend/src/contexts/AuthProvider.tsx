import axios from 'axios'
import {
    useEffect,
    useState,
    type ReactNode,
} from 'react'

import AuthContext from './AuthContext'

import {
    buscarSessao,
    fazerLogin,
    fazerLogout,
    prepararCsrf,
} from '../services/authService'

import type {
    PerfilUsuario,
    UsuarioAutenticado,
} from '../types/Auth'

interface AuthProviderProps {
    children: ReactNode
}

function AuthProvider({
    children,
}: AuthProviderProps) {
    const [usuario, setUsuario] =
        useState<UsuarioAutenticado | null>(null)

    const [carregando, setCarregando] =
        useState(true)

    useEffect(() => {
        let componenteAtivo = true

        async function carregarSessao() {
            try {
                await prepararCsrf()

                const dados =
                    await buscarSessao()

                if (componenteAtivo) {
                    setUsuario(dados)
                }
            } catch (error) {
                if (componenteAtivo) {
                    setUsuario(null)
                }

                if (
                    !axios.isAxiosError(error) ||
                    error.response?.status !== 401
                ) {
                    console.error(
                        'Não foi possível restaurar a sessão.',
                        error,
                    )
                }
            } finally {
                if (componenteAtivo) {
                    setCarregando(false)
                }
            }
        }

        carregarSessao()

        return () => {
            componenteAtivo = false
        }
    }, [])

    async function entrar(
        email: string,
        senha: string,
    ): Promise<UsuarioAutenticado> {
        const dados = await fazerLogin({
            email,
            senha,
        })

        setUsuario(dados)

        return dados
    }

    async function sair(): Promise<void> {
        try {
            await fazerLogout()
        } finally {
            setUsuario(null)
        }
    }

    function possuiPerfil(
        perfil: PerfilUsuario,
    ): boolean {
        return (
            usuario?.perfis.includes(perfil) ??
            false
        )
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                carregando,
                entrar,
                sair,
                possuiPerfil,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider