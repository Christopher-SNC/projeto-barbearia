import { useEffect, useState } from 'react'

import type { Agendamento } from '../../types/Agendamento'

import {
    cancelarAgendamento,
    concluirAgendamento,
    registrarNaoComparecimento,
} from '../../services/agendamentoService'

import './AgendamentoAcoes.css'

type PerfilAcoes = 'cliente' | 'proprietario' | 'barbeiro'
type Operacao = 'cancelar' | 'concluir' | 'nao-compareceu'

interface Props {
    agendamento: Agendamento
    perfil: PerfilAcoes
    onAtualizado: (agendamento: Agendamento) => void
}

function AgendamentoAcoes({
    agendamento,
    perfil,
    onAtualizado,
}: Props) {
    const [executando, setExecutando] = useState(false)
    const [erro, setErro] = useState('')
    const [mensagem, setMensagem] = useState('')

    const confirmado = agendamento.status === 'CONFIRMADO'


    const podeGerenciar =
        confirmado &&
        (perfil === 'proprietario' || perfil === 'barbeiro')

    const inicio = new Date(agendamento.dataHoraInicio).getTime()
    const duracaoMinutos = agendamento.itens.reduce(
        (total, item) => total + item.duracaoMinutos,
        0,
    )

    const [agora, setAgora] = useState<number | null>(null)

    useEffect(() => {
        const atualizar = () => setAgora(Date.now())

        const inicioTimer = window.setTimeout(atualizar, 0)
        const intervalo = window.setInterval(atualizar, 30_000)

        return () => {
            window.clearTimeout(inicioTimer)
            window.clearInterval(intervalo)
        }
    }, [])

    const podeCancelar =
        confirmado &&
        (perfil === 'proprietario' || perfil === 'cliente') &&
        agora !== null &&
        agora < inicio

    const podeConcluir =
        podeGerenciar &&
        agora !== null &&
        duracaoMinutos > 0 &&
        agora >= inicio + duracaoMinutos * 60_000

    const podeMarcarAusencia =
        podeGerenciar &&
        agora !== null &&
        agora >= inicio + 15 * 60_000

    if (!podeCancelar && !podeConcluir && !podeMarcarAusencia && !erro && !mensagem) {
        return null
    }

    async function executar(operacao: Operacao) {
        if (executando || !confirmado) return

        if (operacao === 'cancelar' && !podeCancelar) return
        if (operacao === 'concluir' && !podeConcluir) return
        if (operacao === 'nao-compareceu' && !podeMarcarAusencia) return

        const perguntas: Record<Operacao, string> = {
            cancelar: 'Deseja realmente cancelar este agendamento?',
            concluir: 'Confirmar a conclusão deste atendimento?',
            'nao-compareceu': 'Confirmar que o cliente não compareceu?',
        }

        if (!window.confirm(perguntas[operacao])) return

        setExecutando(true)
        setErro('')
        setMensagem('')

        try {
            let atualizado: Agendamento

            switch (operacao) {
                case 'cancelar':
                    atualizado = await cancelarAgendamento(
                        agendamento.idAgendamento,
                    )
                    break
                case 'concluir':
                    atualizado = await concluirAgendamento(
                        agendamento.idAgendamento,
                    )
                    break
                case 'nao-compareceu':
                    atualizado = await registrarNaoComparecimento(
                        agendamento.idAgendamento,
                    )
                    break
            }

            onAtualizado(atualizado)
            setMensagem('Status atualizado com sucesso.')
        } catch (error) {
            console.error(error)
            setErro(
                'Não foi possível atualizar o agendamento. Verifique sua permissão e tente novamente.',
            )
        } finally {
            setExecutando(false)
        }
    }

    return (
        <div className="agendamento-acoes">
            {(podeCancelar || podeConcluir || podeMarcarAusencia) && (
                <div className="agendamento-acoes__botoes">
                    {podeCancelar && (
                        <button
                            type="button"
                            className="agendamento-acoes__botao agendamento-acoes__botao--cancelar"
                            disabled={executando}
                            onClick={() => executar('cancelar')}
                        >
                            Cancelar
                        </button>
                    )}

                    {podeConcluir && (
                        <button
                            type="button"
                            className="agendamento-acoes__botao agendamento-acoes__botao--concluir"
                            disabled={executando}
                            onClick={() => executar('concluir')}
                        >
                            Concluir
                        </button>
                    )}

                    {podeMarcarAusencia && (
                        <button
                            type="button"
                            className="agendamento-acoes__botao"
                            disabled={executando}
                            onClick={() => executar('nao-compareceu')}
                        >
                            Não compareceu
                        </button>
                    )}
                </div>
            )}

            {executando && (
                <p role="status">Atualizando agendamento...</p>
            )}

            {erro && (
                <p className="agendamento-acoes__erro" role="alert">
                    {erro}
                </p>
            )}

            {mensagem && (
                <p className="agendamento-acoes__sucesso" role="status">
                    {mensagem}
                </p>
            )}
        </div>
    )
}

export default AgendamentoAcoes