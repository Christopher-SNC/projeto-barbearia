import {
    useEffect,
    useState,
} from 'react'

import Button from '../../components/Button/Button'

import { DEMO_IDS } from '../../config/demo'

import {
    ativarDisponibilidade,
    atualizarDisponibilidade,
    cadastrarDisponibilidade,
    desativarDisponibilidade,
    listarDisponibilidades,
} from '../../services/disponibilidadeService'

import type {
    DiaSemana,
    Disponibilidade,
} from '../../types/Disponibilidade'

import './DisponibilidadeBarbeiro.css'

interface DiaDisponibilidade {
    diaSemana: DiaSemana
    nome: string
    idDisponibilidade: number | null
    horaInicio: string
    horaFim: string
    ativo: boolean
}

const dias: {
    diaSemana: DiaSemana
    nome: string
}[] = [
        {
            diaSemana: 'SEGUNDA',
            nome: 'Segunda-feira',
        },
        {
            diaSemana: 'TERCA',
            nome: 'Terça-feira',
        },
        {
            diaSemana: 'QUARTA',
            nome: 'Quarta-feira',
        },
        {
            diaSemana: 'QUINTA',
            nome: 'Quinta-feira',
        },
        {
            diaSemana: 'SEXTA',
            nome: 'Sexta-feira',
        },
        {
            diaSemana: 'SABADO',
            nome: 'Sábado',
        },
        {
            diaSemana: 'DOMINGO',
            nome: 'Domingo',
        },
    ]

function normalizarHora(hora: string) {
    return hora.substring(0, 5)
}

function montarDias(
    disponibilidades: Disponibilidade[],
): DiaDisponibilidade[] {
    return dias.map((dia) => {
        const disponibilidade =
            disponibilidades.find(
                (item) =>
                    item.diaSemana ===
                    dia.diaSemana,
            )

        if (!disponibilidade) {
            return {
                ...dia,
                idDisponibilidade: null,
                horaInicio: '09:00',
                horaFim: '17:00',
                ativo: false,
            }
        }

        return {
            ...dia,
            idDisponibilidade:
                disponibilidade.idDisponibilidade,
            horaInicio: normalizarHora(
                disponibilidade.horaInicio,
            ),
            horaFim: normalizarHora(
                disponibilidade.horaFim,
            ),
            ativo: disponibilidade.ativo,
        }
    })
}

function DisponibilidadeBarbeiro() {
    const [
        disponibilidades,
        setDisponibilidades,
    ] = useState<DiaDisponibilidade[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] =
        useState('')

    async function buscarDisponibilidadesBarbeiro() {
        const dados =
            await listarDisponibilidades()

        const dadosBarbeiro =
            dados.filter(
                (disponibilidade) =>
                    disponibilidade.idBarbeiro ===
                    DEMO_IDS.barbeiro,
            )

        return montarDias(dadosBarbeiro)
    }

    useEffect(() => {
        async function carregarDisponibilidades() {
            try {
                const dados =
                    await buscarDisponibilidadesBarbeiro()

                setDisponibilidades(dados)
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar sua disponibilidade.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDisponibilidades()
    }, [])

    function alterarAtivo(
        diaSemana: DiaSemana,
        ativo: boolean,
    ) {
        setSucesso('')

        setDisponibilidades(
            (estadoAtual) =>
                estadoAtual.map((dia) =>
                    dia.diaSemana ===
                        diaSemana
                        ? {
                            ...dia,
                            ativo,
                        }
                        : dia,
                ),
        )
    }

    function alterarHorario(
        diaSemana: DiaSemana,
        campo:
            | 'horaInicio'
            | 'horaFim',
        valor: string,
    ) {
        setSucesso('')

        setDisponibilidades(
            (estadoAtual) =>
                estadoAtual.map((dia) =>
                    dia.diaSemana ===
                        diaSemana
                        ? {
                            ...dia,
                            [campo]: valor,
                        }
                        : dia,
                ),
        )
    }

    function validar() {
        for (const dia of disponibilidades) {
            if (!dia.ativo) {
                continue
            }

            if (
                !dia.horaInicio ||
                !dia.horaFim
            ) {
                return `Informe os horários de ${dia.nome}.`
            }

            if (
                dia.horaInicio >=
                dia.horaFim
            ) {
                return `Em ${dia.nome}, o horário inicial deve ser anterior ao horário final.`
            }
        }

        return ''
    }

    async function salvar() {
        const mensagemValidacao =
            validar()

        if (mensagemValidacao) {
            setErro(mensagemValidacao)
            setSucesso('')

            return
        }

        setSalvando(true)
        setErro('')
        setSucesso('')

        try {
            for (const dia of disponibilidades) {
                if (
                    dia.idDisponibilidade ===
                    null
                ) {
                    if (!dia.ativo) {
                        continue
                    }

                    await cadastrarDisponibilidade({
                        idBarbeiro:
                            DEMO_IDS.barbeiro,
                        diaSemana:
                            dia.diaSemana,
                        horaInicio:
                            dia.horaInicio,
                        horaFim: dia.horaFim,
                    })

                    continue
                }

                await atualizarDisponibilidade(
                    dia.idDisponibilidade,
                    {
                        idBarbeiro:
                            DEMO_IDS.barbeiro,
                        diaSemana:
                            dia.diaSemana,
                        horaInicio:
                            dia.horaInicio,
                        horaFim: dia.horaFim,
                    },
                )

                if (dia.ativo) {
                    await ativarDisponibilidade(
                        dia.idDisponibilidade,
                    )
                } else {
                    await desativarDisponibilidade(
                        dia.idDisponibilidade,
                    )
                }
            }

            const dadosAtualizados =
                await buscarDisponibilidadesBarbeiro()

            setDisponibilidades(
                dadosAtualizados,
            )

            setSucesso(
                'Disponibilidade atualizada com sucesso.',
            )
        } catch (error) {
            console.error(error)

            setErro(
                'Não foi possível salvar sua disponibilidade.',
            )
        } finally {
            setSalvando(false)
        }
    }

    return (
        <section className="barber-availability">
            <div className="barber-availability__top">
                <div>
                    <h1>
                        Minha Disponibilidade
                    </h1>

                    <p>
                        Defina os dias e horários em
                        que você atende.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={salvar}
                    disabled={salvando}
                >
                    {salvando
                        ? 'Salvando...'
                        : 'Salvar alterações'}
                </Button>
            </div>

            {erro && (
                <p className="barber-availability__message barber-availability__message--error">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="barber-availability__message barber-availability__message--success">
                    {sucesso}
                </p>
            )}

            {carregando ? (
                <p className="barber-availability__message">
                    Carregando disponibilidade...
                </p>
            ) : (
                <section className="barber-availability__content">
                    <div className="barber-availability__heading">
                        <h2>
                            Horários de atendimento
                        </h2>

                        <p>
                            Ative apenas os dias em
                            que deseja receber
                            agendamentos.
                        </p>
                    </div>

                    <div className="barber-availability__list">
                        {disponibilidades.map(
                            (dia) => (
                                <article
                                    className={[
                                        'barber-availability__day',
                                        !dia.ativo
                                            ? 'barber-availability__day--inactive'
                                            : '',
                                    ]
                                        .filter(
                                            Boolean,
                                        )
                                        .join(' ')}
                                    key={
                                        dia.diaSemana
                                    }
                                >
                                    <div className="barber-availability__day-main">
                                        <div className="barber-availability__day-title">
                                            <strong>
                                                {
                                                    dia.nome
                                                }
                                            </strong>

                                            <span>
                                                {dia.ativo
                                                    ? 'Atendimento ativo'
                                                    : 'Sem atendimento'}
                                            </span>
                                        </div>

                                        <label className="barber-availability__toggle">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    dia.ativo
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    alterarAtivo(
                                                        dia.diaSemana,
                                                        event
                                                            .target
                                                            .checked,
                                                    )
                                                }
                                            />

                                            <span>
                                                {dia.ativo
                                                    ? 'Ativo'
                                                    : 'Inativo'}
                                            </span>
                                        </label>
                                    </div>

                                    <div className="barber-availability__hours">
                                        <label>
                                            <span>
                                                Início
                                            </span>

                                            <input
                                                type="time"
                                                value={
                                                    dia.horaInicio
                                                }
                                                disabled={
                                                    !dia.ativo
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    alterarHorario(
                                                        dia.diaSemana,
                                                        'horaInicio',
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
                                            />
                                        </label>

                                        <span className="barber-availability__separator">
                                            até
                                        </span>

                                        <label>
                                            <span>
                                                Fim
                                            </span>

                                            <input
                                                type="time"
                                                value={
                                                    dia.horaFim
                                                }
                                                disabled={
                                                    !dia.ativo
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    alterarHorario(
                                                        dia.diaSemana,
                                                        'horaFim',
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
                                            />
                                        </label>
                                    </div>
                                </article>
                            ),
                        )}
                    </div>

                    <div className="barber-availability__mobile-save">
                        <Button
                            fullWidth
                            type="button"
                            onClick={salvar}
                            disabled={salvando}
                        >
                            {salvando
                                ? 'Salvando...'
                                : 'Salvar alterações'}
                        </Button>
                    </div>
                </section>
            )}
        </section>
    )
}

export default DisponibilidadeBarbeiro