import { Route, Routes } from 'react-router-dom'

import NovoAgendamento from '../pages/cliente/NovoAgendamento'

import Home from '../pages/publico/Home'
import Barbearias from '../pages/publico/Barbearias'
import DetalhesBarbearia from '../pages/publico/DetalhesBarbearia'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/barbearias" element={<Barbearias />} />
      <Route
        path="/barbearias/:id"
        element={<DetalhesBarbearia />}
      />
      <Route
        path="/barbearias/:id/agendar"
        element={<NovoAgendamento />}
      />

    </Routes>
  )
}

export default AppRoutes