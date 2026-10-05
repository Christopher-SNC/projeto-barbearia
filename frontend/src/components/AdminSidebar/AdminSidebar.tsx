import { useEffect, useState } from 'react'
import {
    NavLink,
    useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import { DEMO_IDS } from '../../config/demo'
import { buscarBarbeariaPorId } from '../../services/barbeariaService'

import './AdminSidebar.css'

const links = [
    {
        label: 'Dashboard',
        to: '/proprietario',
        end: true,
    },
    {
        label: 'Agenda',
        to: '/proprietario/agenda',
    },
    {
        label: 'Agendamentos',
        to: '/proprietario/agendamentos',
    },
    {
        label: 'Serviços',
        to: '/proprietario/servicos',
    },
    {
        label: 'Barbeiros',
        to: '/proprietario/barbeiros',
    },
    {
        label: 'Horários',
        to: '/proprietario/horarios',
    },
    {
        label: 'Promoções',
        to: '/proprietario/promocoes',
    },
    {
        label: 'Avaliações',
        to: '/proprietario/avaliacoes',
    },
    {
        label: 'Dados da Barbearia',
        to: '/proprietario/dados',
    },
    {
        label: 'Fotos',
        to: '/proprietario/fotos',
    },
    {
        label: 'Configurações',
        to: '/proprietario/configuracoes',
    },
]

function AdminSidebar() {
    const [menuAberto, setMenuAberto] = useState(false)

    const [nomeBarbearia, setNomeBarbearia] =
        useState('Barbearia')

    const navigate = useNavigate()
    const { sair } = useAuth()

    useEffect(() => {
        let componenteAtivo = true

        buscarBarbeariaPorId(DEMO_IDS.barbearia)
            .then((barbearia) => {
                if (componenteAtivo) {
                    setNomeBarbearia(barbearia.nome)
                }
            })
            .catch((error) => {
                console.error(
                    'Não foi possível carregar o nome da barbearia.',
                    error,
                )
            })

        return () => {
            componenteAtivo = false
        }
    }, [])

    function fecharMenu() {
        setMenuAberto(false)
    }

    async function sairDaConta() {
        await sair()

        fecharMenu()

        navigate('/login', {
            replace: true,
        })
    }

    const navigation = (
        <>
            <div className="admin-navigation">
                {links.map((link) => (
                    <NavLink
                        className={({ isActive }) =>
                            [
                                'admin-navigation__item',
                                isActive
                                    ? 'admin-navigation__item--active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')
                        }
                        end={link.end}
                        key={link.to}
                        to={link.to}
                        onClick={fecharMenu}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <button
                className="admin-sidebar__logout"
                type="button"
                onClick={sairDaConta}
            >
                Sair da conta
            </button>
        </>
    )

    return (
        <>
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span
                        className="admin-brand__mark"
                        aria-hidden="true"
                    />

                    <span>BARBER ADMIN</span>
                </div>

                <div className="admin-store">
                    <strong>{nomeBarbearia}</strong>
                    <span>Proprietário</span>
                </div>

                {navigation}
            </aside>

            <header className="admin-mobile-header">
                <div className="admin-mobile-header__brand">
                    <span
                        className="admin-mobile-header__mark"
                        aria-hidden="true"
                    />

                    <strong>BARBER ADMIN</strong>
                </div>

                <button
                    className="admin-mobile-header__menu"
                    type="button"
                    aria-label={
                        menuAberto
                            ? 'Fechar menu administrativo'
                            : 'Abrir menu administrativo'
                    }
                    aria-expanded={menuAberto}
                    onClick={() =>
                        setMenuAberto((aberto) => !aberto)
                    }
                >
                    ☰
                </button>
            </header>

            {menuAberto && (
                <div className="admin-mobile-menu">
                    <div className="admin-store admin-store--mobile">
                        <strong>{nomeBarbearia}</strong>
                        <span>Proprietário</span>
                    </div>

                    {navigation}
                </div>
            )}
        </>
    )
}

export default AdminSidebar