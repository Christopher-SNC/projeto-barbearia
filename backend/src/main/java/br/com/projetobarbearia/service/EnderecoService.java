package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Endereco;
import br.com.projetobarbearia.repository.EnderecoRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final BarbeariaService barbeariaService;

    public EnderecoService(
            EnderecoRepository enderecoRepository,
            BarbeariaService barbeariaService) {

        this.enderecoRepository = enderecoRepository;
        this.barbeariaService = barbeariaService;
    }

    public List<Endereco> listarTodos() {
        return enderecoRepository.findAll();
    }

    public Optional<Endereco> buscarPorId(Long id) {
        return enderecoRepository.findById(id);
    }

    @Transactional
    public Endereco salvar(Endereco endereco) {

        Endereco enderecoSalvo =
                enderecoRepository.save(endereco);

        barbeariaService.desativarSeInvalida(
                enderecoSalvo.getBarbearia()
                        .getIdBarbearia());

        return enderecoSalvo;
    }

    @Transactional
    public void excluir(Long id) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Endereço não encontrado."));

        Long idBarbearia =
                endereco.getBarbearia().getIdBarbearia();

        enderecoRepository.delete(endereco);
        enderecoRepository.flush();

        barbeariaService.desativarSeInvalida(
                idBarbearia);
    }
}