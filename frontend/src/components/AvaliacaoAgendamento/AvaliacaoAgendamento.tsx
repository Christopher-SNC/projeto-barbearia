import { useState } from 'react'
import axios from 'axios'

import {
  criarAvaliacao,
} from '../../services/avaliacaoService'

import type { Agendamento } from '../../types/Agendamento'
import type { Avaliacao } from '../../types/Avaliacao'

import './AvaliacaoAgendamento.css'

interface Props {
  agendamento: Agendamento
  jaAvaliado: boolean
  onAvaliado: (avaliacao: Avaliacao) => void
}

function AvaliacaoAgendamento({
  agendamento,
  jaAvaliado,
  onAvaliado,
}: Props) {
  const [aberto, setAberto] = useState(false)
  const [notaBarbearia, setNotaBarbearia] = useState(5)
  const [notaBarbeiro, setNotaBarbeiro] = useState<number | null>(5)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  if (agendamento.status !== 'CONCLUIDO') {
    return null
  }

  if (jaAvaliado) {
    return (
      <p className="appointment-review__done">
        ✓ Atendimento avaliado
      </p>
    )
  }

  async function enviar(evento: React.SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (enviando) return

    setEnviando(true)
    setErro('')

    try {
      const avaliacao = await criarAvaliacao({
        idAgendamento: agendamento.idAgendamento,
        notaBarbearia,
        notaBarbeiro,
        comentario: comentario.trim() || null,
      })

      onAvaliado(avaliacao)
      setAberto(false)
    } catch (error) {
      if (axios.isAxiosError<{ erro?: string }>(error)) {
        setErro(
          error.response?.data?.erro ??
            'Não foi possível enviar sua avaliação.',
        )
      } else {
        setErro('Não foi possível enviar sua avaliação.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="appointment-review">
      {!aberto ? (
        <button
          type="button"
          className="appointment-review__open"
          onClick={() => setAberto(true)}
        >
          ★ Avaliar atendimento
        </button>
      ) : (
        <form
          className="appointment-review__form"
          onSubmit={enviar}
        >
          <h4>Avalie seu atendimento</h4>

          <label>
            Nota da barbearia
            <select
              value={notaBarbearia}
              onChange={(evento) =>
                setNotaBarbearia(Number(evento.target.value))
              }
              disabled={enviando}
            >
              {[5, 4, 3, 2, 1].map((nota) => (
                <option key={nota} value={nota}>
                  {nota} {nota === 1 ? 'estrela' : 'estrelas'}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nota do barbeiro
            <select
              value={notaBarbeiro ?? ''}
              onChange={(evento) =>
                setNotaBarbeiro(
                  evento.target.value === ''
                    ? null
                    : Number(evento.target.value),
                )
              }
              disabled={enviando}
            >
              <option value="">Não avaliar barbeiro</option>
              {[5, 4, 3, 2, 1].map((nota) => (
                <option key={nota} value={nota}>
                  {nota} {nota === 1 ? 'estrela' : 'estrelas'}
                </option>
              ))}
            </select>
          </label>

          <label>
            Comentário (opcional)
            <textarea
              value={comentario}
              onChange={(evento) =>
                setComentario(evento.target.value)
              }
              placeholder="Como foi sua experiência?"
              rows={3}
              disabled={enviando}
            />
          </label>

          {erro && (
            <p className="appointment-review__error" role="alert">
              {erro}
            </p>
          )}

          <div className="appointment-review__actions">
            <button
              type="button"
              className="appointment-review__cancel"
              onClick={() => {
                setAberto(false)
                setErro('')
              }}
              disabled={enviando}
            >
              Voltar
            </button>

            <button
              type="submit"
              className="appointment-review__submit"
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AvaliacaoAgendamento