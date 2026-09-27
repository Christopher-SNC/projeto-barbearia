import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import './Header.css'

function Header() {
    const [menuAberto, setMenuAberto] = useState(false)

    function fecharMenu() {
        setMenuAberto(false)
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

                    <span
                        className="site-header__link site-header__link--disabled"
                        aria-disabled="true"
                    >
                        Entrar
                    </span>

                    <Link
                        className="site-header__cta"
                        to="/barbearias"
                        onClick={fecharMenu}
                    >
                        Agendar agora
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header