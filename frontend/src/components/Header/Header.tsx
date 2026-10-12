import { useRef, useState } from 'react'
import {
    Link,
    NavLink,
    useNavigate,
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import './Header.css'

function Header() {
    const [menuAberto, setMenuAberto] = useState(false)
    const menuContaRef = useRef<HTMLDetailsElement>(null)

    const navigate = useNavigate()
    const { usuario, sair } = useAuth()
    const acessoCliente = usuario?.perfis.includes('CLIENTE') ?? false
    const funcionarioExclusivo = Boolean(
        usuario?.perfis.includes('BARBEIRO') && !acessoCliente,
    )

    function fecharMenu() {
        setMenuAberto(false)
        menuContaRef.current?.removeAttribute('open')
    }

    async function sairDaConta() {
        await sair()

        fecharMenu()
        navigate('/')
    }

    return (
        <header className="site-header">
            <div className="site-header__container">
                <Link
                    className="site-header__brand"
                    to="/"
                    onClick={fecharMenu}
                >
                    <span
                        className="site-header__brand-mark"
                        aria-hidden="true"
                    />

                    <span>Barber</span>
                </Link>

                <button
                    className="site-header__menu-button"
                    type="button"
                    aria-label={
                        menuAberto ? 'Fechar menu' : 'Abrir menu'
                    }
                    aria-expanded={menuAberto}
                    aria-controls="main-navigation"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav
                    id="main-navigation"
                    className={[
                        'site-header__navigation',
                        menuAberto
                            ? 'site-header__navigation--open'
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {!funcionarioExclusivo && (
                        <>
                            <NavLink
                                className="site-header__link"
                                to="/barbearias"
                                onClick={fecharMenu}
                            >
                                Barbearias
                            </NavLink>

                            <a
                                className="site-header__link"
                                href="/#como-funciona"
                                onClick={fecharMenu}
                            >
                                Como funciona
                            </a>
                        </>
                    )}

                    {usuario ? (
                        <details ref={menuContaRef} className="site-header__account-menu">
                            <summary className="site-header__link">Minha conta</summary>
                            <div className="site-header__account-dropdown">
                                {acessoCliente && (
                                    <>
                                        <NavLink className="site-header__link" to="/cliente" onClick={fecharMenu}>Painel do cliente</NavLink>
                                        <NavLink className="site-header__link" to="/meus-agendamentos" onClick={fecharMenu}>Meus agendamentos</NavLink>
                                        <NavLink className="site-header__link" to="/meus-favoritos" onClick={fecharMenu}>Favoritos</NavLink>
                                        {!usuario.perfis.includes('PROPRIETARIO') && !usuario.perfis.includes('BARBEIRO') && (
                                            <NavLink className="site-header__link" to="/cadastrar-barbearia" onClick={fecharMenu}>Cadastrar barbearia</NavLink>
                                        )}
                                    </>
                                )}
                                {usuario.perfis.includes('PROPRIETARIO') && (
                                    <>
                                        <NavLink className="site-header__link" to="/proprietario" onClick={fecharMenu}>Painel do proprietário</NavLink>
                                        <NavLink className="site-header__link" to="/cadastrar-barbearia" onClick={fecharMenu}>Cadastrar outra barbearia</NavLink>
                                    </>
                                )}
                                {usuario.perfis.includes('BARBEIRO') && (
                                    <NavLink className="site-header__link" to="/barbeiro" onClick={fecharMenu}>Área do barbeiro</NavLink>
                                )}
                                <button className="site-header__link site-header__link--action"
                                    type="button" onClick={sairDaConta}>Sair</button>
                            </div>
                        </details>
                    ) : (
                        <>
<NavLink
                            className="site-header__link"
                            to="/login"
                            onClick={fecharMenu}
                        >
                            Entrar
                        </NavLink>
                            <NavLink
                                className="site-header__link"
                                to="/cadastro"
                                onClick={fecharMenu}
                            >
                                Criar conta
                            </NavLink>
                        </>
                    )}

                    {!funcionarioExclusivo && (
                        <Link
                            className="site-header__cta"
                            to="/barbearias"
                            onClick={fecharMenu}
                        >
                            Agendar agora
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
