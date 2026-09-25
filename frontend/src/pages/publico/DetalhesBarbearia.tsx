import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { buscarBarbeariaPorId } from '../../services/barbeariaService'
import { listarBarbeiros } from '../../services/barbeiroService'
import { listarEnderecos } from '../../services/enderecoService'
import { listarHorariosFuncionamento } from '../../services/horarioFuncionamentoService'
import { listarServicos } from '../../services/servicoService'
import { listarUsuarios } from '../../services/usuarioService'

import type { Barbearia } from '../../types/Barbearia'
import type { Barbeiro } from '../../types/Barbeiro'
import type { Endereco } from '../../types/Endereco'
import type { HorarioFuncionamento } from '../../types/HorarioFuncionamento'
import type { Servico } from '../../types/Servico'
import type { Usuario } from '../../types/Usuario'

const nomesDias: Record<string, string> = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

function formatarHora(hora: string) {
  return hora.substring(0, 5)
}

function formatarPreco(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

function DetalhesBarbearia() {
  const { id } = useParams()

  const [barbearia, setBarbearia] = useState<Barbearia | null>(null)
  const [endereco, setEndereco] = useState<Endereco | null>(null)
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDados() {
      const idBarbearia = Number(id)

      if (!id || Number.isNaN(idBarbearia)) {
        setErro('Barbearia inválida.')
        setCarregando(false)
        return
      }

      try {
        const [
          dadosBarbearia,
          dadosEnderecos,
          dadosHorarios,
          dadosServicos,
          dadosBarbeiros,
          dadosUsuarios,
        ] = await Promise.all([
          buscarBarbeariaPorId(idBarbearia),
          listarEnderecos(),
          listarHorariosFuncionamento(),
          listarServicos(),
          listarBarbeiros(),
          listarUsuarios(),
        ])

        setBarbearia(dadosBarbearia)

        setEndereco(
          dadosEnderecos.find(
            (item) => item.idBarbearia === idBarbearia,
          ) ?? null,
        )

        setHorarios(
          dadosHorarios.filter(
            (item) => item.idBarbearia === idBarbearia,
          ),
        )

        setServicos(
          dadosServicos.filter(
            (item) =>
              item.idBarbearia === idBarbearia && item.ativo,
          ),
        )

        setBarbeiros(
          dadosBarbeiros.filter(
            (item) =>
              item.idBarbearia === idBarbearia && item.ativo,
          ),
        )

        setUsuarios(dadosUsuarios)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os dados da barbearia.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [id])

  function buscarNomeBarbeiro(idUsuario: number) {
    const usuario = usuarios.find(
      (item) => item.idUsuario === idUsuario,
    )

    return usuario?.nome ?? 'Barbeiro'
  }

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
    <main className="page detalhes-barbearia">
      <section>
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
      </section>

      <section className="detalhes-secao">
        <h2>Endereço</h2>

        {endereco ? (
          <>
            <p>
              {endereco.logradouro}, {endereco.numero}
              {endereco.complemento
                ? ` - ${endereco.complemento}`
                : ''}
            </p>

            <p>
              {endereco.bairro} - {endereco.cidade}/{endereco.estado}
            </p>

            <p>CEP: {endereco.cep}</p>
          </>
        ) : (
          <p>Endereço não informado.</p>
        )}
      </section>

      <section className="detalhes-secao">
        <h2>Horários de funcionamento</h2>

        {horarios.length === 0 ? (
          <p>Nenhum horário cadastrado.</p>
        ) : (
          <ul className="lista-detalhes">
            {horarios.map((horario) => (
              <li key={horario.idHorario}>
                <strong>
                  {nomesDias[horario.diaSemana] ??
                    horario.diaSemana}
                  :
                </strong>{' '}
                {horario.fechado
                  ? 'Fechado'
                  : `${formatarHora(
                      horario.horaAbertura,
                    )} às ${formatarHora(
                      horario.horaFechamento,
                    )}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="detalhes-secao">
        <h2>Serviços</h2>

        {servicos.length === 0 ? (
          <p>Nenhum serviço disponível.</p>
        ) : (
          <div className="detalhes-grid">
            {servicos.map((servico) => (
              <article
                className="detalhes-card"
                key={servico.idServico}
              >
                <h3>{servico.nome}</h3>

                {servico.descricao && (
                  <p>{servico.descricao}</p>
                )}

                <p>
                  <strong>{formatarPreco(servico.preco)}</strong>
                </p>

                <p>{servico.duracaoMinutos} minutos</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="detalhes-secao">
        <h2>Barbeiros</h2>

        {barbeiros.length === 0 ? (
          <p>Nenhum barbeiro disponível.</p>
        ) : (
          <div className="detalhes-grid">
            {barbeiros.map((barbeiro) => (
              <article
                className="detalhes-card"
                key={barbeiro.idBarbeiro}
              >
                <h3>
                  {buscarNomeBarbeiro(barbeiro.idUsuario)}
                </h3>

                {barbeiro.descricao && (
                  <p>{barbeiro.descricao}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <Link to="/barbearias">
        Voltar para barbearias
      </Link>
    </main>
  )
}

export default DetalhesBarbearia