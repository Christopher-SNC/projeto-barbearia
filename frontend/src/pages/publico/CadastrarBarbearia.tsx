import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { salvarBarbeariaSelecionada } from '../../utils/barbeariaSelecionada'
import { cadastrarBarbearia } from '../../services/barbeariaService'
import { cadastrarEndereco } from '../../services/enderecoService'
import { cadastrarBarbeiro } from '../../services/barbeiroService'

import type { BarbeariaRequest } from '../../types/Barbearia'
import './CadastrarBarbearia.css'

interface ErroApi {
  erro?: string
}

function somenteDigitos(valor: string) {
  return valor.replace(/\D/g, '')
}

function CadastrarBarbearia() {
  const { usuario, atualizarSessao } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [descricao, setDescricao] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [cep, setCep] = useState('')
  const [tambemBarbeiro, setTambemBarbeiro] = useState(false)
  const [idCriado, setIdCriado] = useState<number | null>(null)
  const [enderecoSalvo, setEnderecoSalvo] = useState(false)
  const [barbeiroVinculado, setBarbeiroVinculado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (salvando || !usuario) return

    const cnpjDigitos = somenteDigitos(cnpj)
    const cepDigitos = somenteDigitos(cep)

    if (cnpjDigitos && cnpjDigitos.length !== 14) {
      setErro('O CNPJ, quando informado, deve possuir 14 dígitos.')
      return
    }
    if (cepDigitos.length !== 8) {
      setErro('Informe um CEP com 8 dígitos.')
      return
    }
    if (estado.trim().length !== 2) {
      setErro('Informe a sigla do estado com 2 letras.')
      return
    }

    setSalvando(true)
    setErro('')

    try {
      let idBarbearia = idCriado
      if (idBarbearia === null) {
        const dados: BarbeariaRequest = {
          nome: nome.trim(),
          cnpj: cnpjDigitos || null,
          telefone: telefone.trim() || null,
          descricao: descricao.trim() || null,
        }
        const criada = await cadastrarBarbearia(dados)
        idBarbearia = criada.idBarbearia
        setIdCriado(idBarbearia)
      }

      if (!enderecoSalvo) {
        await cadastrarEndereco({
          idBarbearia,
          logradouro: logradouro.trim(),
          numero: numero.trim(),
          complemento: null,
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase(),
          cep: cepDigitos,
          latitude: null,
          longitude: null,
        })
        setEnderecoSalvo(true)
      }

      if (tambemBarbeiro && !barbeiroVinculado && usuario.idBarbeiro === null) {
        await cadastrarBarbeiro({
          idUsuario: usuario.idUsuario,
          idBarbearia,
          descricao: 'Proprietário e barbeiro',
        })
        setBarbeiroVinculado(true)
      }

      const sessao = await atualizarSessao()
      if (!sessao.idsBarbeariasProprietario.includes(idBarbearia)) {
        throw new Error('A nova barbearia não apareceu na sessão atualizada.')
      }
      salvarBarbeariaSelecionada(sessao.idUsuario, idBarbearia)
      navigate('/proprietario/dados', { replace: true })
    } catch (falha) {
      console.error(falha)
      const mensagem = axios.isAxiosError<ErroApi>(falha)
        ? falha.response?.data?.erro
        : undefined
      setErro(mensagem ?? 'Não foi possível concluir o cadastro. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <main className="onboarding-page">
      <section className="onboarding-card">
        <span className="onboarding-eyebrow">Para proprietários</span>
        <h1>Cadastre sua barbearia</h1>
        <p className="onboarding-intro">
          A barbearia começará inativa. Depois você poderá cadastrar
          serviços, horários e disponibilidade antes de ativá-la.
        </p>

        <form className="onboarding-form" onSubmit={salvar}>
          <h2>Informações do estabelecimento</h2>
          <div className="onboarding-grid">
            <label>Nome da barbearia
              <input required maxLength={120} value={nome}
                onChange={(e) => setNome(e.target.value)} disabled={salvando || idCriado !== null} />
            </label>
            <label>CNPJ (opcional)
              <input inputMode="numeric" value={cnpj}
                onChange={(e) => setCnpj(e.target.value)} disabled={salvando || idCriado !== null} />
            </label>
            <label>Telefone (opcional)
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)}
                disabled={salvando || idCriado !== null} />
            </label>
            <label>Descrição (opcional)
              <input maxLength={500} value={descricao}
                onChange={(e) => setDescricao(e.target.value)} disabled={salvando || idCriado !== null} />
            </label>
          </div>

          <h2>Endereço</h2>
          <div className="onboarding-grid">
            <label>Rua / avenida
              <input required value={logradouro} onChange={(e) => setLogradouro(e.target.value)}
                disabled={salvando || enderecoSalvo} />
            </label>
            <label>Número
              <input required value={numero} onChange={(e) => setNumero(e.target.value)}
                disabled={salvando || enderecoSalvo} />
            </label>
            <label>Bairro
              <input required value={bairro} onChange={(e) => setBairro(e.target.value)}
                disabled={salvando || enderecoSalvo} />
            </label>
            <label>Cidade
              <input required value={cidade} onChange={(e) => setCidade(e.target.value)}
                disabled={salvando || enderecoSalvo} />
            </label>
            <label>UF
              <input required maxLength={2} value={estado}
                onChange={(e) => setEstado(e.target.value)} disabled={salvando || enderecoSalvo} />
            </label>
            <label>CEP
              <input required inputMode="numeric" maxLength={9} value={cep}
                onChange={(e) => setCep(e.target.value)} disabled={salvando || enderecoSalvo} />
            </label>
          </div>

          <h2>Profissionais</h2>
          <label className="onboarding-checkbox">
            <input type="checkbox" checked={tambemBarbeiro}
              disabled={salvando || usuario?.idBarbeiro !== null || barbeiroVinculado}
              onChange={(e) => setTambemBarbeiro(e.target.checked)} />
            Também trabalho como barbeiro nesta barbearia
          </label>
          {usuario?.idBarbeiro !== null && (
            <p className="onboarding-note">
              Você já possui vínculo como barbeiro. Cada conta pode estar
              vinculada como barbeiro a uma única barbearia.
            </p>
          )}
          <p className="onboarding-note">
            Para ativar a barbearia, você ainda precisará configurar
            ao menos um serviço, um horário de funcionamento e a
            disponibilidade de um profissional.
          </p>

          {erro && <p className="onboarding-error" role="alert">{erro}</p>}
          {idCriado !== null && (
            <p className="onboarding-note" role="status">
              Barbearia #{idCriado} criada. Se uma etapa falhar,
              clique novamente para continuar sem duplicar o cadastro.
            </p>
          )}

          <div className="onboarding-actions">
            <Link to="/">Voltar</Link>
            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar e continuar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default CadastrarBarbearia
