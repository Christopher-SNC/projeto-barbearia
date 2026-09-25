import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { listarBarbearias } from '../../services/barbeariaService'
import type { Barbearia } from '../../types/Barbearia'

function Barbearias() {
  const [barbearias, setBarbearias] = useState<Barbearia[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarBarbearias() {
      try {
        const dados = await listarBarbearias()
        setBarbearias(dados)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar as barbearias.')
      } finally {
        setCarregando(false)
      }
    }

    carregarBarbearias()
  }, [])

  if (carregando) {
    return (
      <main className="page">
        <p>Carregando barbearias...</p>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="page">
        <p>{erro}</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>Barbearias</h1>

      {barbearias.length === 0 ? (
        <p>Nenhuma barbearia encontrada.</p>
      ) : (
        <div className="barbearias-lista">
          {barbearias.map((barbearia) => (
            <article
              className="barbearia-card"
              key={barbearia.idBarbearia}
            >
              <h2>{barbearia.nome}</h2>

              {barbearia.descricao && (
                <p>{barbearia.descricao}</p>
              )}

              {barbearia.telefone && (
                <p>Telefone: {barbearia.telefone}</p>
              )}

              <Link to={`/barbearias/${barbearia.idBarbearia}`}>
                Ver detalhes
              </Link>
            </article>
          ))}
        </div>
      )}

      <p>
        <Link to="/">Voltar para a página inicial</Link>
      </p>
    </main>
  )
}

export default Barbearias
