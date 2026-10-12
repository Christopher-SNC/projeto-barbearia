import { Outlet } from 'react-router-dom'

import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import BarbeariaAtualProvider from '../../contexts/BarbeariaAtualProvider'
import useBarbeariaProprietario from '../../hooks/useBarbeariaProprietario'

import './AdminLayout.css'

function ConteudoAdmin() {
    const idBarbearia = useBarbeariaProprietario()

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-layout__content">
                <Outlet key={idBarbearia} />
            </main>
        </div>
    )
}

function AdminLayout() {
    return (
        <BarbeariaAtualProvider>
            <ConteudoAdmin />
        </BarbeariaAtualProvider>
    )
}

export default AdminLayout
