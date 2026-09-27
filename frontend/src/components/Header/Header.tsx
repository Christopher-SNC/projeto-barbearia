import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import './Header.css'

function Header() {
    const [menuAberto, setMenuAberto] = useState(false)

    function fecharMenu() {
        setMenuAberto(false)
    }

    return (
        <header className="site-header">
            <div className="site-header__container">
                <NavLink
                    className="site-header__brand"
                    to="/"
                    onClick={fecharMenu}
                >
                    <span
                        className="site-header__brand-mark"
                        aria-hidden="true"
                    />

                    <span>Projeto Barbearia</span>
                </NavLink>

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
                        className={({ isActive }) =>
                            [
                                'site-header__link',
                                isActive
                                    ? 'site-header__link--active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')
                        }
                        end
                        to="/"
                        onClick={fecharMenu}
                    >
                        Início
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            [
                                'site-header__link',
                                isActive
                                    ? 'site-header__link--active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')
                        }
                        to="/barbearias"
                        onClick={fecharMenu}
                    >
                        Barbearias
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header