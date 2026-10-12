import { useEffect, useState } from 'react'
import {
    NavLink,
    useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import useBarbeariaAtual from '../../hooks/useBarbeariaAtual'
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
    const { idBarbearia, selecionarBarbearia } = useBarbeariaAtual()
    const [menuAberto, setMenuAberto] = useState(false)
    const [nomes, setNomes] = useState<Record<number, string>>({})

    const navigate = useNavigate()
    const { usuario, sair } = useAuth()
    const idsBarbearias = usuario?.idsBarbeariasProprietario

    useEffect(() => {
        let ativo = true
        const ids = idsBarbearias ?? []

        void Promise.all(ids.map(async (id) => {
            try {
                const barbearia = await buscarBarbeariaPorId(id)
                return [id, barbearia.nome] as const
            } catch (error) {
                console.error('Não foi possível carregar a barbearia.', error)
                return [id, `Barbearia #${id}`] as const
            }
        })).then((itens) => {
            if (ativo) setNomes(Object.fromEntries(itens))
        })

        return () => { ativo = false }
    }, [idsBarbearias])

    function trocarBarbearia(id: number) {
        selecionarBarbearia(id)
        fecharMenu()
        navigate('/proprietario')
    }

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

    const seletorUnidade = (
    <div className="admin-store">
        {(idsBarbearias?.length ?? 0) > 1 ? (
            <>
                <label className="admin-store__label">
                    Barbearia selecionada
                    <select
                        className="admin-store__select"
                        aria-label="Selecionar barbearia para administrar"
                        value={idBarbearia}
                        onChange={(event) => trocarBarbearia(Number(event.target.value))}
                    >
                        {idsBarbearias?.map((id) => (
                            <option key={id} value={id}>
                                {nomes[id] ?? `Barbearia #${id}`}
                            </option>
                        ))}
                    </select>
                </label>
                <span>Proprietário</span>
            </>
        ) : (
            <>
                <strong>{nomes[idBarbearia] ?? `Barbearia #${idBarbearia}`}</strong>
                <span>Proprietário</span>
            </>
        )}
        <NavLink
            to="/cadastrar-barbearia"
            className="admin-store__add"
            onClick={fecharMenu}
        >
            + Cadastrar outra barbearia
        </NavLink>
    </div>
)

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

            <nav className="admin-navigation__areas" aria-label="Trocar de área">
                <span className="admin-navigation__areas-label">Trocar de área</span>
                {usuario?.perfis.includes('BARBEIRO') && (
                    <NavLink
                        className="admin-navigation__item admin-navigation__item--area"
                        to="/barbeiro"
                        onClick={fecharMenu}
                    >
                        Área do barbeiro
                    </NavLink>
                )}
                <NavLink
                    className="admin-navigation__item admin-navigation__item--area"
                    to="/cliente"
                    onClick={fecharMenu}
                >
                    Área do cliente
                </NavLink>
            </nav>

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

                {seletorUnidade}

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
                    {seletorUnidade}

                    {navigation}
                </div>
            )}
        </>
    )
}

export default AdminSidebar
