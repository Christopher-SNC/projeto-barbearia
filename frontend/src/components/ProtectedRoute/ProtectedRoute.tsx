import type { ReactNode } from 'react'
import {
    Navigate,
    useLocation,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import type { PerfilUsuario } from '../../types/Auth'

interface ProtectedRouteProps {
    children: ReactNode
    perfilObrigatorio?: PerfilUsuario
}

function ProtectedRoute({
    children,
    perfilObrigatorio,
}: ProtectedRouteProps) {
    const { usuario, carregando } = useAuth()
    const location = useLocation()

    if (carregando) {
        return null
    }

    if (!usuario) {
        const destino =
            location.pathname + location.search

        return (
            <Navigate
                to="/login"
                replace
                state={{ from: destino }}
            />
        )
    }

    if (
        perfilObrigatorio &&
        !usuario.perfis.includes(perfilObrigatorio)
    ) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute