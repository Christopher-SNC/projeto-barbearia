package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Endereco;
import br.com.projetobarbearia.repository.EnderecoRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final BarbeariaService barbeariaService;
    private final AutorizacaoService autorizacaoService;

    public EnderecoService(
            EnderecoRepository enderecoRepository,
            BarbeariaService barbeariaService,
            AutorizacaoService autorizacaoService) {

        this.enderecoRepository = enderecoRepository;
        this.barbeariaService = barbeariaService;
        this.autorizacaoService = autorizacaoService;
    }

    public List<Endereco> listarTodos() {
        return enderecoRepository.findAll();
    }

    public Optional<Endereco> buscarPorId(Long id) {
        return enderecoRepository.findById(id);
    }

    public Endereco cadastrar(Long idBarbearia, Endereco endereco) {
        autorizacaoService.exigirProprietarioDaBarbearia(idBarbearia);

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia nÃ£o encontrada."));

        endereco.setBarbearia(barbearia);
        return enderecoRepository.save(endereco);
    }

    public Endereco atualizar(
            Long id,
            Long idBarbearia,
            Endereco novosDados) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "EndereÃ§o nÃ£o encontrado."));

        Long idBarbeariaAnterior =
                endereco.getBarbearia().getIdBarbearia();

        autorizacaoService.exigirProprietarioDaBarbearia(
                idBarbeariaAnterior);
        autorizacaoService.exigirProprietarioDaBarbearia(idBarbearia);

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia nÃ£o encontrada."));

        endereco.setBarbearia(barbearia);
        endereco.setLogradouro(novosDados.getLogradouro());
        endereco.setNumero(novosDados.getNumero());
        endereco.setComplemento(novosDados.getComplemento());
        endereco.setBairro(novosDados.getBairro());
        endereco.setCidade(novosDados.getCidade());
        endereco.setEstado(novosDados.getEstado());
        endereco.setCep(novosDados.getCep());
        endereco.setLatitude(novosDados.getLatitude());
        endereco.setLongitude(novosDados.getLongitude());

        Endereco salvo = enderecoRepository.save(endereco);

        if (!idBarbeariaAnterior.equals(idBarbearia)) {
            barbeariaService.desativarSeInvalida(idBarbeariaAnterior);
        }

        return salvo;
    }

    @Transactional
    public void excluir(Long id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "EndereÃ§o nÃ£o encontrado."));

        Long idBarbearia = endereco.getBarbearia().getIdBarbearia();
        autorizacaoService.exigirProprietarioDaBarbearia(idBarbearia);

        enderecoRepository.delete(endereco);
        enderecoRepository.flush();
        barbeariaService.desativarSeInvalida(idBarbearia);
    }
}