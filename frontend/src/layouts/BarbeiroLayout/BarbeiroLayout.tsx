import { Outlet } from 'react-router-dom'

import BarbeiroSidebar from '../../components/BarbeiroSidebar/BarbeiroSidebar'

import './BarbeiroLayout.css'

function BarbeiroLayout() {
    return (
        <div className="barbeiro-layout">
            <BarbeiroSidebar />

            <main className="barbeiro-layout__content">
                <Outlet />
            </main>
        </div>
    )
}

export default BarbeiroLayout