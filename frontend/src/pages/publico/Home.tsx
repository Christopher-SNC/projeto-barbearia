import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <p className="subtitle">Projeto Barbearia</p>

        <h1>Encontre sua barbearia e agende seu horário.</h1>

        <p className="description">
          Encontre barbearias, consulte serviços, escolha seu barbeiro
          e marque seu atendimento.
        </p>

        <Link className="primary-link" to="/barbearias">
          Ver barbearias
        </Link>
      </section>
    </main>
  )
}

export default Home