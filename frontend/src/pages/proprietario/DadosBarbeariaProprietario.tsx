import {
    useEffect,
    useState,
} from 'react'
import type { FormEvent } from 'react'

import Button from '../../components/Button/Button'

import {
    atualizarBarbearia,
    buscarBarbeariaPorId,
} from '../../services/barbeariaService'

import {
    atualizarEndereco,
    cadastrarEndereco,
    listarEnderecos,
} from '../../services/enderecoService'

import type { BarbeariaRequest } from '../../types/Barbearia'

import type {
    Endereco,
    EnderecoRequest,
} from '../../types/Endereco'

import './DadosBarbeariaProprietario.css'

const ID_BARBEARIA_ADMIN_TESTE = 1

function somenteDigitos(valor: string) {
    return valor.replace(/\D/g, '')
}

function formatarCnpj(valor: string) {
    const digitos = somenteDigitos(valor)
        .slice(0, 14)

    return digitos
        .replace(
            /^(\d{2})(\d)/,
            '$1.$2',
        )
        .replace(
            /^(\d{2})\.(\d{3})(\d)/,
            '$1.$2.$3',
        )
        .replace(
            /\.(\d{3})(\d)/,
            '.$1/$2',
        )
        .replace(
            /(\d{4})(\d)/,
            '$1-$2',
        )
}

function formatarCep(valor: string) {
    const digitos = somenteDigitos(valor)
        .slice(0, 8)

    return digitos.replace(
        /^(\d{5})(\d)/,
        '$1-$2',
    )
}

function separarCidadeEstado(
    valor: string,
) {
    const indiceBarra =
        valor.lastIndexOf('/')

    if (indiceBarra === -1) {
        return null
    }

    const cidade = valor
        .slice(0, indiceBarra)
        .trim()

    const estado = valor
        .slice(indiceBarra + 1)
        .trim()
        .toUpperCase()

    if (
        !cidade ||
        estado.length !== 2
    ) {
        return null
    }

    return {
        cidade,
        estado,
    }
}

function DadosBarbeariaProprietario() {
    const [
        enderecoAtual,
        setEnderecoAtual,
    ] = useState<Endereco | null>(null)

    const [nome, setNome] =
        useState('')

    const [cnpj, setCnpj] =
        useState('')

    const [telefone, setTelefone] =
        useState('')

    const [descricao, setDescricao] =
        useState('')

    const [logradouro, setLogradouro] =
        useState('')

    const [numero, setNumero] =
        useState('')

    const [bairro, setBairro] =
        useState('')

    const [
        cidadeEstado,
        setCidadeEstado,
    ] = useState('')

    const [cep, setCep] =
        useState('')

    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState('')

    const [sucesso, setSucesso] =
        useState('')

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    barbearia,
                    enderecos,
                ] = await Promise.all([
                    buscarBarbeariaPorId(
                        ID_BARBEARIA_ADMIN_TESTE,
                    ),

                    listarEnderecos(),
                ])

                setNome(barbearia.nome)

                setCnpj(
                    formatarCnpj(
                        barbearia.cnpj ?? '',
                    ),
                )

                setTelefone(
                    barbearia.telefone ?? '',
                )

                setDescricao(
                    barbearia.descricao ?? '',
                )

                const endereco =
                    enderecos.find(
                        (item) =>
                            item.idBarbearia ===
                            ID_BARBEARIA_ADMIN_TESTE,
                    ) ?? null

                setEnderecoAtual(endereco)

                if (endereco) {
                    setLogradouro(
                        endereco.logradouro,
                    )

                    setNumero(
                        endereco.numero,
                    )

                    setBairro(
                        endereco.bairro,
                    )

                    setCidadeEstado(
                        `${endereco.cidade} / ${endereco.estado}`,
                    )

                    setCep(
                        formatarCep(
                            endereco.cep,
                        ),
                    )
                }
            } catch (error) {
                console.error(error)

                setErro(
                    'Não foi possível carregar os dados da barbearia.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    async function salvarDados(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setErro('')
        setSucesso('')

        const nomeLimpo =
            nome.trim()

        const cnpjDigitos =
            somenteDigitos(cnpj)

        const cepDigitos =
            somenteDigitos(cep)

        const localizacao =
            separarCidadeEstado(
                cidadeEstado,
            )

        if (!nomeLimpo) {
            setErro(
                'Informe o nome da barbearia.',
            )

            return
        }

        if (
            cnpjDigitos &&
            cnpjDigitos.length !== 14
        ) {
            setErro(
                'Informe um CNPJ válido com 14 dígitos.',
            )

            return
        }

        if (
            !logradouro.trim() ||
            !numero.trim() ||
            !bairro.trim()
        ) {
            setErro(
                'Preencha os dados obrigatórios do endereço.',
            )

            return
        }

        if (!localizacao) {
            setErro(
                'Informe cidade e estado no formato Cidade / UF.',
            )

            return
        }

        if (
            cepDigitos.length !== 8
        ) {
            setErro(
                'Informe um CEP válido com 8 dígitos.',
            )

            return
        }

        const dadosBarbearia: BarbeariaRequest =
        {
            nome: nomeLimpo,

            cnpj:
                cnpjDigitos || null,

            telefone:
                telefone.trim() || null,

            descricao:
                descricao.trim() || null,
        }

        const dadosEndereco: EnderecoRequest =
        {
            idBarbearia:
                ID_BARBEARIA_ADMIN_TESTE,

            logradouro:
                logradouro.trim(),

            numero:
                numero.trim(),

            complemento:
                enderecoAtual?.complemento ??
                null,

            bairro:
                bairro.trim(),

            cidade:
                localizacao.cidade,

            estado:
                localizacao.estado,

            cep:
                cepDigitos,

            latitude:
                enderecoAtual?.latitude ??
                null,

            longitude:
                enderecoAtual?.longitude ??
                null,
        }

        try {
            setSalvando(true)

            const barbeariaAtualizada =
                await atualizarBarbearia(
                    ID_BARBEARIA_ADMIN_TESTE,
                    dadosBarbearia,
                )

            let enderecoSalvo: Endereco

            if (enderecoAtual) {
                enderecoSalvo =
                    await atualizarEndereco(
                        enderecoAtual.idEndereco,
                        dadosEndereco,
                    )
            } else {
                enderecoSalvo =
                    await cadastrarEndereco(
                        dadosEndereco,
                    )
            }

            setEnderecoAtual(
                enderecoSalvo,
            )

            setNome(
                barbeariaAtualizada.nome,
            )

            setCnpj(
                formatarCnpj(
                    barbeariaAtualizada.cnpj ??
                    '',
                ),
            )

            setTelefone(
                barbeariaAtualizada.telefone ??
                '',
            )

            setDescricao(
                barbeariaAtualizada.descricao ??
                '',
            )

            setLogradouro(
                enderecoSalvo.logradouro,
            )

            setNumero(
                enderecoSalvo.numero,
            )

            setBairro(
                enderecoSalvo.bairro,
            )

            setCidadeEstado(
                `${enderecoSalvo.cidade} / ${enderecoSalvo.estado}`,
            )

            setCep(
                formatarCep(
                    enderecoSalvo.cep,
                ),
            )

            setSucesso(
                'Dados da barbearia atualizados com sucesso.',
            )
        } catch (error) {
            console.error(error)

            setErro(
                'Não foi possível salvar os dados da barbearia.',
            )
        } finally {
            setSalvando(false)
        }
    }

    return (
        <section className="admin-data">
            <form onSubmit={salvarDados}>
                <div className="admin-data__top">
                    <div>
                        <h1>
                            Dados da Barbearia
                        </h1>

                        <p className="admin-data__description admin-data__description--desktop">
                            Informações públicas,
                            endereço e contato
                        </p>

                        <p className="admin-data__description admin-data__description--mobile">
                            Informações públicas
                            e endereço
                        </p>
                    </div>

                    <div className="admin-data__desktop-save">
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
                                : 'Salvar'}
                        </Button>
                    </div>
                </div>

                {erro && (
                    <p className="admin-data__feedback admin-data__feedback--error">
                        {erro}
                    </p>
                )}

                {sucesso && (
                    <p className="admin-data__feedback admin-data__feedback--success">
                        {sucesso}
                    </p>
                )}

                {carregando ? (
                    <p className="admin-data__loading">
                        Carregando dados...
                    </p>
                ) : (
                    <>
                        <div className="admin-data__content">
                            <section className="admin-data__card">
                                <h2>
                                    Informações gerais
                                </h2>

                                <label>
                                    Nome

                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(
                                            event,
                                        ) =>
                                            setNome(
                                                event.target
                                                    .value,
                                            )
                                        }
                                    />
                                </label>

                                <label>
                                    CNPJ

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={18}
                                        value={cnpj}
                                        onChange={(
                                            event,
                                        ) =>
                                            setCnpj(
                                                formatarCnpj(
                                                    event
                                                        .target
                                                        .value,
                                                ),
                                            )
                                        }
                                        placeholder="12.345.678/0001-90"
                                    />
                                </label>

                                <label>
                                    Telefone

                                    <input
                                        type="tel"
                                        value={
                                            telefone
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setTelefone(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="(27) 99999-9999"
                                    />
                                </label>

                                <label>
                                    Descrição

                                    <input
                                        type="text"
                                        value={
                                            descricao
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setDescricao(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="Ambiente moderno e atendimento com hora marcada."
                                    />
                                </label>
                            </section>

                            <section className="admin-data__card">
                                <h2>
                                    Endereço
                                </h2>

                                <label>
                                    Logradouro

                                    <input
                                        type="text"
                                        value={
                                            logradouro
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setLogradouro(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />
                                </label>

                                <label>
                                    Número

                                    <input
                                        type="text"
                                        value={numero}
                                        onChange={(
                                            event,
                                        ) =>
                                            setNumero(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />
                                </label>

                                <label>
                                    Bairro

                                    <input
                                        type="text"
                                        value={bairro}
                                        onChange={(
                                            event,
                                        ) =>
                                            setBairro(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />
                                </label>

                                <label>
                                    Cidade / Estado

                                    <input
                                        type="text"
                                        value={
                                            cidadeEstado
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setCidadeEstado(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="Vitória / ES"
                                    />
                                </label>

                                <label>
                                    CEP

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={9}
                                        value={cep}
                                        onChange={(
                                            event,
                                        ) =>
                                            setCep(
                                                formatarCep(
                                                    event
                                                        .target
                                                        .value,
                                                ),
                                            )
                                        }
                                        placeholder="29000-000"
                                    />
                                </label>

                                <p className="admin-data__coordinates-note">
                                    Latitude e longitude
                                    são usadas para busca
                                    por proximidade.
                                </p>
                            </section>
                        </div>

                        <div className="admin-data__mobile-save">
                            <Button
                                variant="accent"
                                fullWidth
                                type="submit"
                                disabled={
                                    salvando
                                }
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

export default DadosBarbeariaProprietario