import { Route, Routes } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout/PublicLayout'

import NovoAgendamento from '../pages/cliente/NovoAgendamento'

import MeusAgendamentos from '../pages/cliente/MeusAgendamentos'

import Barbearias from '../pages/publico/Barbearias'
import DetalhesBarbearia from '../pages/publico/DetalhesBarbearia'
import Home from '../pages/publico/Home'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/barbearias"
          element={<Barbearias />}
        />

        <Route
          path="/barbearias/:id"
          element={<DetalhesBarbearia />}
        />

        <Route
          path="/barbearias/:id/agendar"
          element={<NovoAgendamento />}
        />
        <Route
          path="/meus-agendamentos"
          element={<MeusAgendamentos />}
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes