import {
    useEffect,
    useMemo,
    useState,
} from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'

import {
    atualizarHorarioFuncionamento,
    cadastrarHorarioFuncionamento,
    listarHorariosFuncionamento,
} from '../../services/horarioFuncionamentoService'

import type {
    DiaSemana,
    HorarioFuncionamento,
    HorarioFuncionamentoRequest,
} from '../../types/HorarioFuncionamento'

import './HorariosProprietario.css'

import useBarbeariaProprietario from '../../hooks/useBarbeariaProprietario'

const DIAS: {
    valor: DiaSemana
    label: string
}[] = [
        {
            valor: 'SEGUNDA',
            label: 'Segunda-feira',
        },
        {
            valor: 'TERCA',
            label: 'Terça-feira',
        },
        {
            valor: 'QUARTA',
            label: 'Quarta-feira',
        },
        {
            valor: 'QUINTA',
            label: 'Quinta-feira',
        },
        {
            valor: 'SEXTA',
            label: 'Sexta-feira',
        },
        {
            valor: 'SABADO',
            label: 'Sábado',
        },
        {
            valor: 'DOMINGO',
            label: 'Domingo',
        },
    ]

interface HorarioFormulario {
    idHorario?: number
    diaSemana: DiaSemana
    horaAbertura: string
    horaFechamento: string
    fechado: boolean
}

type HorariosFormulario = Record<
    DiaSemana,
    HorarioFormulario
>

function criarFormularioInicial(): HorariosFormulario {
    return {
        SEGUNDA: {
            diaSemana: 'SEGUNDA',
            horaAbertura: '09:00',
            horaFechamento: '18:00',
            fechado: true,
        },

        TERCA: {
            diaSemana: 'TERCA',
            horaAbertura: '09:00',
            horaFechamento: '18:00',
            fechado: true,
        },

        QUARTA: {
            diaSemana: 'QUARTA',
            horaAbertura: '09:00',
            horaFechamento: '18:00',
            fechado: true,
        },

        QUINTA: {
            diaSemana: 'QUINTA',
            horaAbertura: '09:00',
            horaFechamento: '18:00',
            fechado: true,
        },

        SEXTA: {
            diaSemana: 'SEXTA',
            horaAbertura: '09:00',
            horaFechamento: '18:00',
            fechado: true,
        },

        SABADO: {
            diaSemana: 'SABADO',
            horaAbertura: '09:00',
            horaFechamento: '14:00',
            fechado: true,
        },

        DOMINGO: {
            diaSemana: 'DOMINGO',
            horaAbertura: '09:00',
            horaFechamento: '14:00',
            fechado: true,
        },
    }
}

function montarFormulario(
    horarios: HorarioFuncionamento[],
    idBarbearia: number,
): HorariosFormulario {
    const formulario =
        criarFormularioInicial()

    for (const horario of horarios) {
        if (
            horario.idBarbearia !==
            idBarbearia
        ) {
            continue
        }

        formulario[horario.diaSemana] = {
            idHorario: horario.idHorario,

            diaSemana:
                horario.diaSemana,

            horaAbertura:
                horario.horaAbertura?.slice(
                    0,
                    5,
                ) ?? '09:00',

            horaFechamento:
                horario.horaFechamento?.slice(
                    0,
                    5,
                ) ?? '18:00',

            fechado: horario.fechado,
        }
    }

    return formulario
}

function HorariosProprietario() {
    const idBarbearia =
        useBarbeariaProprietario()
    const [
        horarios,
        setHorarios,
    ] = useState<HorariosFormulario>(
        criarFormularioInicial,
    )

    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState('')

    const [sucesso, setSucesso] =
        useState('')

    useEffect(() => {
        let componenteAtivo = true

        listarHorariosFuncionamento()
            .then((dados) => {
                if (!componenteAtivo) {
                    return
                }

                setHorarios(
                    montarFormulario(
                        dados,
                        idBarbearia,
                    ),
                )
            })
            .catch((error) => {
                if (!componenteAtivo) {
                    return
                }

                console.error(error)

                setErro(
                    'Não foi possível carregar os horários de funcionamento.',
                )
            })
            .finally(() => {
                if (componenteAtivo) {
                    setCarregando(false)
                }
            })

        return () => {
            componenteAtivo = false
        }
    }, [idBarbearia])

    const diasAbertos = useMemo(() => {
        return DIAS.filter(
            (dia) =>
                !horarios[dia.valor].fechado,
        ).length
    }, [horarios])

    function atualizarDia(
        dia: DiaSemana,
        alteracao: Partial<HorarioFormulario>,
    ) {
        setHorarios((atual) => ({
            ...atual,

            [dia]: {
                ...atual[dia],
                ...alteracao,
            },
        }))

        setErro('')
        setSucesso('')
    }

    function validarFormulario() {
        const abertos = DIAS.filter(
            (dia) =>
                !horarios[dia.valor].fechado,
        )

        if (abertos.length === 0) {
            return (
                'A barbearia precisa ter pelo ' +
                'menos um dia de funcionamento.'
            )
        }

        for (const dia of abertos) {
            const horario =
                horarios[dia.valor]

            if (
                !horario.horaAbertura ||
                !horario.horaFechamento
            ) {
                return (
                    `Informe os horários de ${dia.label}.`
                )
            }

            if (
                horario.horaAbertura >=
                horario.horaFechamento
            ) {
                return (
                    `Em ${dia.label}, o horário de ` +
                    'abertura deve ser anterior ao ' +
                    'horário de fechamento.'
                )
            }
        }

        return null
    }

    async function salvarHorarios(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErro('')
        setSucesso('')

        const erroValidacao =
            validarFormulario()

        if (erroValidacao) {
            setErro(erroValidacao)

            return
        }

        try {
            setSalvando(true)

            const resultados: HorarioFuncionamento[] =
                []

            for (const dia of DIAS) {
                const horario =
                    horarios[dia.valor]

                const dados: HorarioFuncionamentoRequest =
                {
                    idBarbearia:
                        idBarbearia,

                    diaSemana:
                        horario.diaSemana,

                    horaAbertura:
                        horario.fechado
                            ? null
                            : horario.horaAbertura,

                    horaFechamento:
                        horario.fechado
                            ? null
                            : horario.horaFechamento,

                    fechado:
                        horario.fechado,
                }

                if (horario.idHorario) {
                    const atualizado =
                        await atualizarHorarioFuncionamento(
                            horario.idHorario,
                            dados,
                        )

                    resultados.push(
                        atualizado,
                    )
                } else {
                    const cadastrado =
                        await cadastrarHorarioFuncionamento(
                            dados,
                        )

                    resultados.push(
                        cadastrado,
                    )
                }
            }

            setHorarios(
                montarFormulario(
                    resultados,
                    idBarbearia,
                ),
            )

            setSucesso(
                'Horários atualizados com sucesso.',
            )
        } catch (error) {
            console.error(error)

            setErro(
                'Não foi possível salvar os horários de funcionamento.',
            )
        } finally {
            setSalvando(false)
        }
    }

    return (
        <section className="admin-hours">
            <form onSubmit={salvarHorarios}>
                <div className="admin-hours__top">
                    <div>
                        <h1>
                            Horários de funcionamento
                        </h1>

                        <p>
                            Defina os horários públicos
                            da barbearia.
                        </p>
                    </div>

                    <div className="admin-hours__desktop-save">
                        <Button
                            variant="accent"
                            type="submit"
                            disabled={
                                carregando ||
                                salvando
                            }
                        >
                            {salvando
                                ? 'Salvando...'
                                : 'Salvar alterações'}
                        </Button>
                    </div>
                </div>

                {erro && (
                    <p className="admin-hours__feedback admin-hours__feedback--error">
                        {erro}
                    </p>
                )}

                {sucesso && (
                    <p className="admin-hours__feedback admin-hours__feedback--success">
                        {sucesso}
                    </p>
                )}

                {carregando ? (
                    <p className="admin-hours__loading">
                        Carregando horários...
                    </p>
                ) : (
                    <>
                        <div className="admin-hours__card">
                            <div className="admin-hours__card-heading">
                                <div>
                                    <h2>
                                        Semana padrão
                                    </h2>

                                    <p>
                                        {diasAbertos}{' '}
                                        {diasAbertos === 1
                                            ? 'dia aberto'
                                            : 'dias abertos'}
                                    </p>
                                </div>
                            </div>

                            <div className="admin-hours__list">
                                {DIAS.map((dia) => {
                                    const horario =
                                        horarios[
                                        dia.valor
                                        ]

                                    return (
                                        <div
                                            className={[
                                                'admin-hours__day',
                                                horario.fechado
                                                    ? 'admin-hours__day--closed'
                                                    : '',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                            key={dia.valor}
                                        >
                                            <strong className="admin-hours__day-name">
                                                {dia.label}
                                            </strong>

                                            <div className="admin-hours__times">
                                                <input
                                                    aria-label={`Abertura - ${dia.label}`}
                                                    type="time"
                                                    disabled={
                                                        horario.fechado
                                                    }
                                                    value={
                                                        horario.horaAbertura
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        atualizarDia(
                                                            dia.valor,
                                                            {
                                                                horaAbertura:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />

                                                <span>
                                                    até
                                                </span>

                                                <input
                                                    aria-label={`Fechamento - ${dia.label}`}
                                                    type="time"
                                                    disabled={
                                                        horario.fechado
                                                    }
                                                    value={
                                                        horario.horaFechamento
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        atualizarDia(
                                                            dia.valor,
                                                            {
                                                                horaFechamento:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>

                                            <button
                                                className={[
                                                    'admin-hours__status',
                                                    horario.fechado
                                                        ? 'admin-hours__status--closed'
                                                        : 'admin-hours__status--open',
                                                ].join(' ')}
                                                type="button"
                                                onClick={() =>
                                                    atualizarDia(
                                                        dia.valor,
                                                        {
                                                            fechado:
                                                                !horario.fechado,
                                                        },
                                                    )
                                                }
                                            >
                                                {horario.fechado
                                                    ? 'Fechado'
                                                    : 'Aberto'}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="admin-hours__buffer">
                            <div>
                                <h2>
                                    Intervalo entre
                                    agendamentos
                                </h2>

                                <p>
                                    Buffer atual: 15 minutos
                                    entre o fim de um serviço
                                    e o próximo horário
                                    disponível.
                                </p>
                            </div>

                            <strong>
                                15 min
                            </strong>
                        </div>

                        <div className="admin-hours__mobile-save">
                            <Button
                                variant="accent"
                                fullWidth
                                type="submit"
                                disabled={salvando}
                            >
                                {salvando
                                    ? 'Salvando...'
                                    : 'Salvar alterações'}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </section>
    )
}

export default HorariosProprietario