import { Route, Routes } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout/PublicLayout'

import NovoAgendamento from '../pages/cliente/NovoAgendamento'

import MeusAgendamentos from '../pages/cliente/MeusAgendamentos'

import AgendaBarbearia from '../pages/proprietario/AgendaBarbearia'

import AgendamentosProprietario from '../pages/proprietario/AgendamentosProprietario'

import ServicosProprietario from '../pages/proprietario/ServicosProprietario'

import BarbeirosProprietario from '../pages/proprietario/BarbeirosProprietario'

import HorariosProprietario from '../pages/proprietario/HorariosProprietario'

import PromocoesProprietario from '../pages/proprietario/PromocoesProprietario'

import AvaliacoesProprietario from '../pages/proprietario/AvaliacoesProprietario'

import DadosBarbeariaProprietario from '../pages/proprietario/DadosBarbeariaProprietario'

import FotosProprietario from '../pages/proprietario/FotosProprietario'

import ConfiguracoesProprietario from '../pages/proprietario/ConfiguracoesProprietario'

import AdminLayout from '../layouts/AdminLayout/AdminLayout'
import DashboardProprietario from '../pages/proprietario/DashboardProprietario'

import BarbeiroLayout from '../layouts/BarbeiroLayout/BarbeiroLayout'
import DashboardBarbeiro from '../pages/barbeiro/DashboardBarbeiro'

import AgendaBarbeiro from '../pages/barbeiro/AgendaBarbeiro'

import AgendamentosBarbeiro from '../pages/barbeiro/AgendamentosBarbeiro'

import ServicosBarbeiro from '../pages/barbeiro/ServicosBarbeiro'

import DisponibilidadeBarbeiro from '../pages/barbeiro/DisponibilidadeBarbeiro'

import AvaliacoesBarbeiro from '../pages/barbeiro/AvaliacoesBarbeiro'

import ConfiguracoesBarbeiro from '../pages/barbeiro/ConfiguracoesBarbeiro'

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

      <Route
        path="/proprietario"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<DashboardProprietario />}
        />

        <Route
          path="agenda"
          element={<AgendaBarbearia />}
        />

        <Route
          path="agendamentos"
          element={<AgendamentosProprietario />}
        />

        <Route
          path="servicos"
          element={<ServicosProprietario />}
        />

        <Route
          path="barbeiros"
          element={<BarbeirosProprietario />}
        />
        <Route
          path="horarios"
          element={<HorariosProprietario />}
        />

        <Route
          path="promocoes"
          element={<PromocoesProprietario />}
        />

        <Route
          path="avaliacoes"
          element={<AvaliacoesProprietario />}
        />

        <Route
          path="dados"
          element={<DadosBarbeariaProprietario />}
        />

        <Route
          path="fotos"
          element={<FotosProprietario />}
        />

        <Route
          path="configuracoes"
          element={<ConfiguracoesProprietario />}
        />
      </Route>

      <Route
        path="/barbeiro"
        element={<BarbeiroLayout />}
      >
        <Route
          index
          element={<DashboardBarbeiro />}
        />
        <Route
          path="agenda"
          element={<AgendaBarbeiro />}
        />
        <Route
          path="agendamentos"
          element={<AgendamentosBarbeiro />}
        />
        <Route
          path="servicos"
          element={<ServicosBarbeiro />}
        />
        <Route
          path="disponibilidade"
          element={<DisponibilidadeBarbeiro />}
        />
        <Route
          path="avaliacoes"
          element={<AvaliacoesBarbeiro />}
        />
        <Route
          path="configuracoes"
          element={<ConfiguracoesBarbeiro />}
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes