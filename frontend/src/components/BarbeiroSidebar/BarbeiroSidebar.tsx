import { useEffect, useState } from 'react'
import {
    NavLink,
    useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import { DEMO_IDS } from '../../config/demo'
import { buscarBarbeariaPorId } from '../../services/barbeariaService'

import '../AdminSidebar/AdminSidebar.css'
import './BarbeiroSidebar.css'

const links = [
    {
        label: 'Dashboard',
        to: '/barbeiro',
        end: true,
    },
    {
        label: 'Minha Agenda',
        to: '/barbeiro/agenda',
    },
    {
        label: 'Meus Agendamentos',
        to: '/barbeiro/agendamentos',
    },
    {
        label: 'Meus Serviços',
        to: '/barbeiro/servicos',
    },
    {
        label: 'Disponibilidade',
        to: '/barbeiro/disponibilidade',
    },
    {
        label: 'Minhas Avaliações',
        to: '/barbeiro/avaliacoes',
    },
    {
        label: 'Configurações',
        to: '/barbeiro/configuracoes',
    },
]

function BarbeiroSidebar() {
    const [menuAberto, setMenuAberto] = useState(false)

    const [nomeBarbearia, setNomeBarbearia] =
        useState('Barbearia')

    const navigate = useNavigate()
    const { sair } = useAuth()

    useEffect(() => {
        async function carregarBarbearia() {
            try {
                const barbearia = await buscarBarbeariaPorId(
                    DEMO_IDS.barbearia,
                )

                setNomeBarbearia(barbearia.nome)
            } catch (error) {
                console.error(error)
            }
        }

        carregarBarbearia()
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
                    <span className="admin-brand__mark" />

                    <span>Projeto Barbearia</span>
                </div>

                <div className="admin-store">
                    <strong>{nomeBarbearia}</strong>
                    <span>Barbeiro</span>
                </div>

                {navigation}
            </aside>

            <header className="admin-mobile-header">
                <div className="admin-mobile-header__brand">
                    <span className="admin-mobile-header__mark" />

                    <strong>Projeto Barbearia</strong>
                </div>

                <button
                    className="admin-mobile-header__menu"
                    type="button"
                    aria-label={
                        menuAberto
                            ? 'Fechar menu do barbeiro'
                            : 'Abrir menu do barbeiro'
                    }
                    aria-expanded={menuAberto}
                    onClick={() =>
                        setMenuAberto(
                            (aberto) => !aberto,
                        )
                    }
                >
                    ☰
                </button>
            </header>

            {menuAberto && (
                <div className="admin-mobile-menu">
                    <div className="admin-store admin-store--mobile">
                        <strong>{nomeBarbearia}</strong>
                        <span>Barbeiro</span>
                    </div>

                    {navigation}
                </div>
            )}
        </>
    )
}

export default BarbeiroSidebar