import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'

import { listarAgendamentos } from '../../services/agendamentoService'
import { listarAvaliacoes } from '../../services/avaliacaoService'

import {
    ativarBarbeiro,
    atualizarBarbeiro,
    cadastrarBarbeiro,
    desativarBarbeiro,
    listarBarbeiros,
} from '../../services/barbeiroService'

import {
    ativarBarbeiroServico,
    cadastrarBarbeiroServico,
    desativarBarbeiroServico,
    listarBarbeirosServicos,
} from '../../services/barbeiroServicoService'

import {
    ativarDisponibilidade,
    atualizarDisponibilidade,
    cadastrarDisponibilidade,
    desativarDisponibilidade,
    listarDisponibilidades,
} from '../../services/disponibilidadeService'

import { listarServicos } from '../../services/servicoService'

import {
    atualizarUsuario,
    cadastrarUsuario,
    listarUsuarios,
} from '../../services/usuarioService'

import type { Agendamento } from '../../types/Agendamento'
import type { Avaliacao } from '../../types/Avaliacao'
import type { Barbeiro } from '../../types/Barbeiro'
import type { BarbeiroServico } from '../../types/BarbeiroServico'
import type {
    DiaSemana,
    Disponibilidade,
} from '../../types/Disponibilidade'
import type { Servico } from '../../types/Servico'
import type { Usuario } from '../../types/Usuario'

import './BarbeirosProprietario.css'

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

interface DisponibilidadeFormulario {
    ativo: boolean
    horaInicio: string
    horaFim: string
}

type DisponibilidadeSemanal = Record<
    DiaSemana,
    DisponibilidadeFormulario
>

function criarDisponibilidadeInicial(): DisponibilidadeSemanal {
    return {
        SEGUNDA: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '18:00',
        },
        TERCA: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '18:00',
        },
        QUARTA: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '18:00',
        },
        QUINTA: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '18:00',
        },
        SEXTA: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '18:00',
        },
        SABADO: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '14:00',
        },
        DOMINGO: {
            ativo: false,
            horaInicio: '09:00',
            horaFim: '14:00',
        },
    }
}

function BarbeirosProprietario() {
    const idBarbearia =
        useBarbeariaProprietario()
    const [barbeiros, setBarbeiros] = useState<
        Barbeiro[]
    >([])

    const [usuarios, setUsuarios] = useState<
        Usuario[]
    >([])

    const [servicos, setServicos] = useState<
        Servico[]
    >([])

    const [
        barbeirosServicos,
        setBarbeirosServicos,
    ] = useState<BarbeiroServico[]>([])

    const [
        disponibilidades,
        setDisponibilidades,
    ] = useState<Disponibilidade[]>([])

    const [agendamentos, setAgendamentos] =
        useState<Agendamento[]>([])

    const [avaliacoes, setAvaliacoes] = useState<
        Avaliacao[]
    >([])

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const [modalAberto, setModalAberto] =
        useState(false)

    const [barbeiroEditando, setBarbeiroEditando] =
        useState<Barbeiro | null>(null)

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [descricao, setDescricao] =
        useState('')

    const [
        servicosSelecionados,
        setServicosSelecionados,
    ] = useState<number[]>([])

    const [
        disponibilidadeFormulario,
        setDisponibilidadeFormulario,
    ] = useState<DisponibilidadeSemanal>(
        criarDisponibilidadeInicial,
    )

    const [erroFormulario, setErroFormulario] =
        useState('')

    const [salvando, setSalvando] =
        useState(false)

    const [idProcessando, setIdProcessando] =
        useState<number | null>(null)

    const carregarDados = useCallback(
        async () => {
            try {

                const [
                    dadosBarbeiros,
                    dadosUsuarios,
                    dadosServicos,
                    dadosVinculos,
                    dadosDisponibilidades,
                    dadosAgendamentos,
                    dadosAvaliacoes,
                ] = await Promise.all([
                    listarBarbeiros(),
                    listarUsuarios(),
                    listarServicos(),
                    listarBarbeirosServicos(),
                    listarDisponibilidades(),
                    listarAgendamentos(),
                    listarAvaliacoes(),
                ])

                setBarbeiros(
                    dadosBarbeiros.filter(
                        (barbeiro) =>
                            barbeiro.idBarbearia ===
                            idBarbearia,
                    ),
                )

                setUsuarios(dadosUsuarios)

                setServicos(
                    dadosServicos.filter(
                        (servico) =>
                            servico.idBarbearia ===
                            idBarbearia &&
                            servico.ativo,
                    ),
                )

                setBarbeirosServicos(dadosVinculos)
                setDisponibilidades(
                    dadosDisponibilidades,
                )

                setAgendamentos(
                    dadosAgendamentos.filter(
                        (agendamento) =>
                            agendamento.idBarbearia ===
                            idBarbearia,
                    ),
                )

                setAvaliacoes(dadosAvaliacoes)
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar os barbeiros.',
                )
            } finally {
                setCarregando(false)
            }
        },
        [idBarbearia],
    )

    useEffect(() => {
        let componenteAtivo = true

        Promise.all([
            listarBarbeiros(),
            listarUsuarios(),
            listarServicos(),
            listarBarbeirosServicos(),
            listarDisponibilidades(),
            listarAgendamentos(),
            listarAvaliacoes(),
        ])
            .then(
                ([
                    dadosBarbeiros,
                    dadosUsuarios,
                    dadosServicos,
                    dadosVinculos,
                    dadosDisponibilidades,
                    dadosAgendamentos,
                    dadosAvaliacoes,
                ]) => {
                    if (!componenteAtivo) {
                        return
                    }

                    setBarbeiros(
                        dadosBarbeiros.filter(
                            (barbeiro) =>
                                barbeiro.idBarbearia ===
                                idBarbearia,
                        ),
                    )

                    setUsuarios(dadosUsuarios)

                    setServicos(
                        dadosServicos.filter(
                            (servico) =>
                                servico.idBarbearia ===
                                idBarbearia &&
                                servico.ativo,
                        ),
                    )

                    setBarbeirosServicos(dadosVinculos)

                    setDisponibilidades(
                        dadosDisponibilidades,
                    )

                    setAgendamentos(
                        dadosAgendamentos.filter(
                            (agendamento) =>
                                agendamento.idBarbearia ===
                                idBarbearia,
                        ),
                    )

                    setAvaliacoes(dadosAvaliacoes)
                },
            )
            .catch((error) => {
                if (!componenteAtivo) {
                    return
                }

                console.error(error)

                setErro(
                    'Não foi possível carregar os barbeiros.',
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

    const barbeirosOrdenados = useMemo(() => {
        function obterNome(barbeiro: Barbeiro) {
            return (
                usuarios.find(
                    (usuario) =>
                        usuario.idUsuario ===
                        barbeiro.idUsuario,
                )?.nome ?? 'Barbeiro'
            )
        }

        return [...barbeiros].sort((a, b) => {
            if (a.ativo !== b.ativo) {
                return a.ativo ? -1 : 1
            }

            return obterNome(a).localeCompare(
                obterNome(b),
            )
        })
    }, [barbeiros, usuarios])

    function usuarioDoBarbeiro(
        barbeiro: Barbeiro,
    ) {
        return usuarios.find(
            (usuario) =>
                usuario.idUsuario ===
                barbeiro.idUsuario,
        )
    }

    function nomeBarbeiro(
        barbeiro: Barbeiro,
    ) {
        return (
            usuarioDoBarbeiro(barbeiro)?.nome ??
            'Barbeiro'
        )
    }

    function iniciaisBarbeiro(
        barbeiro: Barbeiro,
    ) {
        const nome = nomeBarbeiro(barbeiro)

        const palavras = nome
            .trim()
            .split(/\s+/)
            .filter(Boolean)

        if (palavras.length === 0) {
            return 'B'
        }

        if (palavras.length === 1) {
            return palavras[0]
                .slice(0, 2)
                .toUpperCase()
        }

        return `${palavras[0][0]}${palavras[palavras.length - 1][0]
            }`.toUpperCase()
    }

    function servicosDoBarbeiro(
        idBarbeiro: number,
    ) {
        const idsServicos = barbeirosServicos
            .filter(
                (vinculo) =>
                    vinculo.idBarbeiro === idBarbeiro &&
                    vinculo.ativo,
            )
            .map((vinculo) => vinculo.idServico)

        return servicos
            .filter((servico) =>
                idsServicos.includes(
                    servico.idServico,
                ),
            )
            .map((servico) => servico.nome)
    }

    function mediaBarbeiro(
        idBarbeiro: number,
    ) {
        const idsAgendamentos = new Set(
            agendamentos
                .filter(
                    (agendamento) =>
                        agendamento.idBarbeiro ===
                        idBarbeiro,
                )
                .map(
                    (agendamento) =>
                        agendamento.idAgendamento,
                ),
        )

        const notas = avaliacoes
            .filter(
                (avaliacao) =>
                    idsAgendamentos.has(
                        avaliacao.idAgendamento,
                    ) &&
                    avaliacao.notaBarbeiro !== null,
            )
            .map(
                (avaliacao) =>
                    avaliacao.notaBarbeiro as number,
            )

        if (notas.length === 0) {
            return null
        }

        const total = notas.reduce(
            (soma, nota) => soma + nota,
            0,
        )

        return total / notas.length
    }

    function quantidadeAvaliacoes(
        idBarbeiro: number,
    ) {
        const idsAgendamentos = new Set(
            agendamentos
                .filter(
                    (agendamento) =>
                        agendamento.idBarbeiro ===
                        idBarbeiro,
                )
                .map(
                    (agendamento) =>
                        agendamento.idAgendamento,
                ),
        )

        return avaliacoes.filter(
            (avaliacao) =>
                idsAgendamentos.has(
                    avaliacao.idAgendamento,
                ) &&
                avaliacao.notaBarbeiro !== null,
        ).length
    }

    function limparFormulario() {
        setBarbeiroEditando(null)

        setNome('')
        setEmail('')
        setTelefone('')
        setSenha('')
        setDescricao('')

        setServicosSelecionados([])

        setDisponibilidadeFormulario(
            criarDisponibilidadeInicial(),
        )

        setErroFormulario('')
    }

    function abrirNovoBarbeiro() {
        limparFormulario()

        setErro('')
        setSucesso('')
        setModalAberto(true)
    }

    function abrirEdicao(
        barbeiro: Barbeiro,
    ) {
        const usuario =
            usuarioDoBarbeiro(barbeiro)

        setBarbeiroEditando(barbeiro)

        setNome(usuario?.nome ?? '')
        setEmail(usuario?.email ?? '')
        setTelefone(usuario?.telefone ?? '')
        setSenha('')
        setDescricao(barbeiro.descricao ?? '')

        const servicosAtivos =
            barbeirosServicos
                .filter(
                    (vinculo) =>
                        vinculo.idBarbeiro ===
                        barbeiro.idBarbeiro &&
                        vinculo.ativo,
                )
                .map(
                    (vinculo) =>
                        vinculo.idServico,
                )

        setServicosSelecionados(
            servicosAtivos,
        )

        const novaDisponibilidade =
            criarDisponibilidadeInicial()

        for (const dia of DIAS) {
            const registro = disponibilidades.find(
                (disponibilidade) =>
                    disponibilidade.idBarbeiro ===
                    barbeiro.idBarbeiro &&
                    disponibilidade.diaSemana ===
                    dia.valor,
            )

            if (registro) {
                novaDisponibilidade[dia.valor] = {
                    ativo: registro.ativo,
                    horaInicio:
                        registro.horaInicio.slice(0, 5),
                    horaFim:
                        registro.horaFim.slice(0, 5),
                }
            }
        }

        setDisponibilidadeFormulario(
            novaDisponibilidade,
        )

        setErroFormulario('')
        setErro('')
        setSucesso('')
        setModalAberto(true)
    }

    function fecharModal() {
        setModalAberto(false)
        limparFormulario()
    }

    function alternarServico(
        idServico: number,
    ) {
        setServicosSelecionados(
            (selecionados) =>
                selecionados.includes(idServico)
                    ? selecionados.filter(
                        (id) => id !== idServico,
                    )
                    : [
                        ...selecionados,
                        idServico,
                    ],
        )
    }

    function atualizarDisponibilidadeForm(
        dia: DiaSemana,
        alteracao: Partial<DisponibilidadeFormulario>,
    ) {
        setDisponibilidadeFormulario(
            (atual) => ({
                ...atual,
                [dia]: {
                    ...atual[dia],
                    ...alteracao,
                },
            }),
        )
    }

    async function sincronizarServicos(
        idBarbeiro: number,
    ) {
        const vinculosDoBarbeiro =
            barbeirosServicos.filter(
                (vinculo) =>
                    vinculo.idBarbeiro === idBarbeiro,
            )

        for (const servico of servicos) {
            const selecionado =
                servicosSelecionados.includes(
                    servico.idServico,
                )

            const vinculo =
                vinculosDoBarbeiro.find(
                    (item) =>
                        item.idServico ===
                        servico.idServico,
                )

            if (selecionado) {
                if (!vinculo) {
                    await cadastrarBarbeiroServico({
                        idBarbeiro,
                        idServico: servico.idServico,
                    })
                } else if (!vinculo.ativo) {
                    await ativarBarbeiroServico(
                        vinculo.idBarbeiroServico,
                    )
                }
            } else if (vinculo?.ativo) {
                await desativarBarbeiroServico(
                    vinculo.idBarbeiroServico,
                )
            }
        }
    }

    async function sincronizarDisponibilidade(
        idBarbeiro: number,
    ) {
        const registrosDoBarbeiro =
            disponibilidades.filter(
                (disponibilidade) =>
                    disponibilidade.idBarbeiro ===
                    idBarbeiro,
            )

        for (const dia of DIAS) {
            const formulario =
                disponibilidadeFormulario[
                dia.valor
                ]

            const registro =
                registrosDoBarbeiro.find(
                    (disponibilidade) =>
                        disponibilidade.diaSemana ===
                        dia.valor,
                )

            if (formulario.ativo) {
                if (
                    formulario.horaInicio >=
                    formulario.horaFim
                ) {
                    throw new Error(
                        `Horário inválido em ${dia.label}.`,
                    )
                }

                if (registro) {
                    await atualizarDisponibilidade(
                        registro.idDisponibilidade,
                        {
                            idBarbeiro,
                            diaSemana: dia.valor,
                            horaInicio:
                                formulario.horaInicio,
                            horaFim:
                                formulario.horaFim,
                        },
                    )

                    if (!registro.ativo) {
                        await ativarDisponibilidade(
                            registro.idDisponibilidade,
                        )
                    }
                } else {
                    await cadastrarDisponibilidade({
                        idBarbeiro,
                        diaSemana: dia.valor,
                        horaInicio:
                            formulario.horaInicio,
                        horaFim: formulario.horaFim,
                    })
                }
            } else if (registro?.ativo) {
                await desativarDisponibilidade(
                    registro.idDisponibilidade,
                )
            }
        }
    }

    async function salvarBarbeiro(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErroFormulario('')
        setErro('')
        setSucesso('')

        const nomeLimpo = nome.trim()
        const emailLimpo =
            email.trim().toLowerCase()

        if (!nomeLimpo) {
            setErroFormulario(
                'Informe o nome do barbeiro.',
            )

            return
        }

        if (!emailLimpo) {
            setErroFormulario(
                'Informe o e-mail do barbeiro.',
            )

            return
        }

        if (!barbeiroEditando && !senha) {
            setErroFormulario(
                'Informe uma senha inicial.',
            )

            return
        }

        try {
            setSalvando(true)

            let barbeiroSalvo: Barbeiro

            if (barbeiroEditando) {
                await atualizarUsuario(
                    barbeiroEditando.idUsuario,
                    {
                        nome: nomeLimpo,
                        email: emailLimpo,
                        telefone:
                            telefone.trim() || null,
                    },
                )

                barbeiroSalvo =
                    await atualizarBarbeiro(
                        barbeiroEditando.idBarbeiro,
                        {
                            idUsuario:
                                barbeiroEditando.idUsuario,

                            idBarbearia:
                                idBarbearia,

                            descricao:
                                descricao.trim() || null,
                        },
                    )
            } else {
                const usuarioCriado =
                    await cadastrarUsuario({
                        nome: nomeLimpo,
                        email: emailLimpo,
                        senha,
                        telefone:
                            telefone.trim() || null,
                    })

                barbeiroSalvo =
                    await cadastrarBarbeiro({
                        idUsuario:
                            usuarioCriado.idUsuario,

                        idBarbearia:
                            idBarbearia,

                        descricao:
                            descricao.trim() || null,
                    })
            }

            await sincronizarServicos(
                barbeiroSalvo.idBarbeiro,
            )

            await sincronizarDisponibilidade(
                barbeiroSalvo.idBarbeiro,
            )

            fecharModal()

            await carregarDados()

            setSucesso(
                barbeiroEditando
                    ? 'Barbeiro atualizado com sucesso.'
                    : 'Barbeiro cadastrado com sucesso.',
            )
        } catch (error) {
            console.error(error)

            if (error instanceof Error) {
                setErroFormulario(error.message)
            } else {
                setErroFormulario(
                    'Não foi possível salvar o barbeiro.',
                )
            }
        } finally {
            setSalvando(false)
        }
    }

    async function alterarStatus(
        barbeiro: Barbeiro,
    ) {
        try {
            setIdProcessando(
                barbeiro.idBarbeiro,
            )

            setErro('')
            setSucesso('')

            if (barbeiro.ativo) {
                await desativarBarbeiro(
                    barbeiro.idBarbeiro,
                )
            } else {
                await ativarBarbeiro(
                    barbeiro.idBarbeiro,
                )
            }

            await carregarDados()

            setSucesso(
                barbeiro.ativo
                    ? 'Barbeiro desativado com sucesso.'
                    : 'Barbeiro reativado com sucesso.',
            )
        } catch (error) {
            console.error(error)

            setErro(
                'Não foi possível alterar o status do barbeiro.',
            )
        } finally {
            setIdProcessando(null)
        }
    }

    return (
        <section className="admin-barbers">
            <div className="admin-barbers__top">
                <div>
                    <h1>Barbeiros</h1>

                    <p>
                        Gerencie profissionais, serviços e
                        disponibilidade.
                    </p>
                </div>

                <Button
                    variant="accent"
                    type="button"
                    onClick={abrirNovoBarbeiro}
                >
                    Adicionar barbeiro
                </Button>
            </div>

            {erro && (
                <p className="admin-barbers__feedback admin-barbers__feedback--error">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="admin-barbers__feedback admin-barbers__feedback--success">
                    {sucesso}
                </p>
            )}

            {carregando ? (
                <p className="admin-barbers__loading">
                    Carregando barbeiros...
                </p>
            ) : barbeirosOrdenados.length === 0 ? (
                <div className="admin-barbers__empty">
                    <strong>
                        Nenhum barbeiro cadastrado.
                    </strong>

                    <p>
                        Adicione o primeiro profissional
                        da barbearia.
                    </p>
                </div>
            ) : (
                <div className="admin-barbers__grid">
                    {barbeirosOrdenados.map(
                        (barbeiro) => {
                            const nomesServicos =
                                servicosDoBarbeiro(
                                    barbeiro.idBarbeiro,
                                )

                            const media = mediaBarbeiro(
                                barbeiro.idBarbeiro,
                            )

                            const quantidade =
                                quantidadeAvaliacoes(
                                    barbeiro.idBarbeiro,
                                )

                            return (
                                <article
                                    className={[
                                        'admin-barbers__card',
                                        !barbeiro.ativo
                                            ? 'admin-barbers__card--inactive'
                                            : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    key={barbeiro.idBarbeiro}
                                >
                                    <div className="admin-barbers__card-header">
                                        <div className="admin-barbers__avatar">
                                            {iniciaisBarbeiro(
                                                barbeiro,
                                            )}
                                        </div>

                                        <StatusBadge
                                            variant={
                                                barbeiro.ativo
                                                    ? 'active'
                                                    : 'inactive'
                                            }
                                        >
                                            {barbeiro.ativo
                                                ? 'ATIVO'
                                                : 'INATIVO'}
                                        </StatusBadge>
                                    </div>

                                    <div className="admin-barbers__identity">
                                        <h2>
                                            {nomeBarbeiro(
                                                barbeiro,
                                            )}
                                        </h2>

                                        {barbeiro.descricao && (
                                            <p>
                                                {barbeiro.descricao}
                                            </p>
                                        )}
                                    </div>

                                    <div className="admin-barbers__services">
                                        <span className="admin-barbers__label">
                                            Serviços
                                        </span>

                                        {nomesServicos.length > 0 ? (
                                            <div className="admin-barbers__chips">
                                                {nomesServicos.map(
                                                    (nomeServico) => (
                                                        <span
                                                            key={
                                                                nomeServico
                                                            }
                                                        >
                                                            {nomeServico}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p>
                                                Nenhum serviço
                                                vinculado
                                            </p>
                                        )}
                                    </div>

                                    <div className="admin-barbers__rating">
                                        {media !== null ? (
                                            <>
                                                <strong>
                                                    ★{' '}
                                                    {media
                                                        .toFixed(1)
                                                        .replace(
                                                            '.',
                                                            ',',
                                                        )}
                                                </strong>

                                                <span>
                                                    {quantidade}{' '}
                                                    {quantidade === 1
                                                        ? 'avaliação'
                                                        : 'avaliações'}
                                                </span>
                                            </>
                                        ) : (
                                            <span>
                                                Sem avaliações
                                            </span>
                                        )}
                                    </div>

                                    <div className="admin-barbers__card-actions">
                                        <button
                                            className="admin-barbers__edit"
                                            type="button"
                                            onClick={() =>
                                                abrirEdicao(
                                                    barbeiro,
                                                )
                                            }
                                        >
                                            Editar perfil e horários
                                            →
                                        </button>

                                        <button
                                            className="admin-barbers__status-action"
                                            type="button"
                                            disabled={
                                                idProcessando ===
                                                barbeiro.idBarbeiro
                                            }
                                            onClick={() =>
                                                alterarStatus(
                                                    barbeiro,
                                                )
                                            }
                                        >
                                            {idProcessando ===
                                                barbeiro.idBarbeiro
                                                ? 'Aguarde...'
                                                : barbeiro.ativo
                                                    ? 'Desativar'
                                                    : 'Reativar'}
                                        </button>
                                    </div>
                                </article>
                            )
                        },
                    )}
                </div>
            )}

            <div className="admin-barbers__mobile-new">
                <Button
                    variant="accent"
                    fullWidth
                    type="button"
                    onClick={abrirNovoBarbeiro}
                >
                    Adicionar barbeiro
                </Button>
            </div>

            {modalAberto && (
                <div
                    className="admin-barbers__modal"
                    role="presentation"
                    onMouseDown={fecharModal}
                >
                    <div
                        className="admin-barbers__modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="barber-form-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-barbers__modal-header">
                            <div>
                                <h2 id="barber-form-title">
                                    {barbeiroEditando
                                        ? 'Editar barbeiro'
                                        : 'Adicionar barbeiro'}
                                </h2>

                                <p>
                                    Perfil, serviços e
                                    disponibilidade.
                                </p>
                            </div>

                            <button
                                className="admin-barbers__close"
                                type="button"
                                aria-label="Fechar"
                                onClick={fecharModal}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="admin-barbers__form"
                            onSubmit={salvarBarbeiro}
                        >
                            <section className="admin-barbers__form-section">
                                <h3>Dados pessoais</h3>

                                <label>
                                    Nome
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(event) =>
                                            setNome(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Nome completo"
                                    />
                                </label>

                                <label>
                                    E-mail
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="email@exemplo.com"
                                    />
                                </label>

                                <label>
                                    Telefone
                                    <input
                                        type="tel"
                                        value={telefone}
                                        onChange={(event) =>
                                            setTelefone(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="(27) 99999-9999"
                                    />
                                </label>

                                {!barbeiroEditando && (
                                    <label>
                                        Senha inicial
                                        <input
                                            type="password"
                                            value={senha}
                                            onChange={(event) =>
                                                setSenha(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Senha inicial"
                                        />
                                    </label>
                                )}

                                <label>
                                    Descrição profissional
                                    <textarea
                                        value={descricao}
                                        onChange={(event) =>
                                            setDescricao(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Ex.: Especialista em corte masculino e barba"
                                    />
                                </label>
                            </section>

                            <section className="admin-barbers__form-section">
                                <h3>Serviços realizados</h3>

                                {barbeiroEditando &&
                                    !barbeiroEditando.ativo && (
                                        <p className="admin-barbers__helper">
                                            Reative o barbeiro para alterar os
                                            serviços realizados.
                                        </p>
                                    )}

                                {servicos.length === 0 ? (
                                    <p className="admin-barbers__helper">
                                        Nenhum serviço ativo cadastrado.
                                    </p>
                                ) : (
                                    <div className="admin-barbers__service-options">
                                        {servicos.map((servico) => (
                                            <label
                                                className="admin-barbers__check-option"
                                                key={servico.idServico}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={servicosSelecionados.includes(
                                                        servico.idServico,
                                                    )}
                                                    disabled={
                                                        barbeiroEditando !== null &&
                                                        !barbeiroEditando.ativo
                                                    }
                                                    onChange={() =>
                                                        alternarServico(
                                                            servico.idServico,
                                                        )
                                                    }
                                                />

                                                <span>{servico.nome}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="admin-barbers__form-section">
                                <h3>
                                    Disponibilidade semanal
                                </h3>

                                <div className="admin-barbers__availability">
                                    {DIAS.map((dia) => {
                                        const configuracao =
                                            disponibilidadeFormulario[
                                            dia.valor
                                            ]

                                        return (
                                            <div
                                                className="admin-barbers__availability-row"
                                                key={dia.valor}
                                            >
                                                <label className="admin-barbers__day-toggle">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            configuracao.ativo
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            atualizarDisponibilidadeForm(
                                                                dia.valor,
                                                                {
                                                                    ativo:
                                                                        event
                                                                            .target
                                                                            .checked,
                                                                },
                                                            )
                                                        }
                                                    />

                                                    <span>
                                                        {dia.label}
                                                    </span>
                                                </label>

                                                <div className="admin-barbers__time-fields">
                                                    <input
                                                        aria-label={`Início - ${dia.label}`}
                                                        type="time"
                                                        disabled={
                                                            !configuracao.ativo
                                                        }
                                                        value={
                                                            configuracao.horaInicio
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            atualizarDisponibilidadeForm(
                                                                dia.valor,
                                                                {
                                                                    horaInicio:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                    />

                                                    <span>até</span>

                                                    <input
                                                        aria-label={`Fim - ${dia.label}`}
                                                        type="time"
                                                        disabled={
                                                            !configuracao.ativo
                                                        }
                                                        value={
                                                            configuracao.horaFim
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            atualizarDisponibilidadeForm(
                                                                dia.valor,
                                                                {
                                                                    horaFim:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            {erroFormulario && (
                                <p className="admin-barbers__form-error">
                                    {erroFormulario}
                                </p>
                            )}

                            <div className="admin-barbers__form-actions">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={fecharModal}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="accent"
                                    type="submit"
                                    disabled={salvando}
                                >
                                    {salvando
                                        ? 'Salvando...'
                                        : barbeiroEditando
                                            ? 'Salvar alterações'
                                            : 'Adicionar barbeiro'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default BarbeirosProprietario