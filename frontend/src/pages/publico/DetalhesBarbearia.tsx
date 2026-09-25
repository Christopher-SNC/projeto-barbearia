import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { buscarBarbeariaPorId } from '../../services/barbeariaService'
import type { Barbearia } from '../../types/Barbearia'

function DetalhesBarbearia() {
  const { id } = useParams()

  const [barbearia, setBarbearia] = useState<Barbearia | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarBarbearia() {
      if (!id) {
        setErro('Barbearia inválida.')
        setCarregando(false)
        return
      }

      try {
        const dados = await buscarBarbeariaPorId(Number(id))
        setBarbearia(dados)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os dados da barbearia.')
      } finally {
        setCarregando(false)
      }
    }

    carregarBarbearia()
  }, [id])

  if (carregando) {
    return (
      <main className="page">
        <p>Carregando barbearia...</p>
      </main>
    )
  }

  if (erro || !barbearia) {
    return (
      <main className="page">
        <p>{erro || 'Barbearia não encontrada.'}</p>

        <Link to="/barbearias">
          Voltar para barbearias
        </Link>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>{barbearia.nome}</h1>

      {barbearia.descricao && (
        <p>{barbearia.descricao}</p>
      )}

      {barbearia.telefone && (
        <p>
          <strong>Telefone:</strong> {barbearia.telefone}
        </p>
      )}

      {barbearia.cnpj && (
        <p>
          <strong>CNPJ:</strong> {barbearia.cnpj}
        </p>
      )}

      <p>
        <strong>Status:</strong>{' '}
        {barbearia.ativa ? 'Ativa' : 'Inativa'}
      </p>

      <Link to="/barbearias">
        Voltar para barbearias
      </Link>
    </main>
  )
}

export default DetalhesBarbearia
