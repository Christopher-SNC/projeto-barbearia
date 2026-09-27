import { Link } from 'react-router-dom'

import type { Barbearia } from '../../types/Barbearia'
import type { Endereco } from '../../types/Endereco'

import './BarbeariaCard.css'

interface BarbeariaCardProps {
  barbearia: Barbearia
  endereco?: Endereco
  distanciaKm?: number | null
}

function BarbeariaCard({
  barbearia,
  endereco,
  distanciaKm,
}: BarbeariaCardProps) {
  const localizacao = endereco
    ? `${endereco.bairro} • ${endereco.cidade}`
    : 'Localização não informada'

  return (
    <Link
      className="barbershop-card"
      to={`/barbearias/${barbearia.idBarbearia}`}
    >
      <div className="barbershop-card__image">
        <span />
      </div>

      <div className="barbershop-card__content">
        <h2>{barbearia.nome}</h2>

        <p>
          {localizacao}
          {distanciaKm !== null &&
            distanciaKm !== undefined &&
            ` • ${distanciaKm.toFixed(1)} km`}
        </p>

        {barbearia.descricao && (
          <p className="barbershop-card__description">
            {barbearia.descricao}
          </p>
        )}

        <span className="barbershop-card__details">
          Ver detalhes →
        </span>
      </div>
    </Link>
  )
}

export default BarbeariaCard