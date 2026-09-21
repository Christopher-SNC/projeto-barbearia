package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.BarbeiroServico;
import br.com.projetobarbearia.repository.BarbeiroServicoRepository;

@Service
public class BarbeiroServicoService {

    private final BarbeiroServicoRepository barbeiroServicoRepository;

    public BarbeiroServicoService(
            BarbeiroServicoRepository barbeiroServicoRepository) {

        this.barbeiroServicoRepository = barbeiroServicoRepository;
    }

    public List<BarbeiroServico> listarTodos() {
        return barbeiroServicoRepository.findAll();
    }

    public Optional<BarbeiroServico> buscarPorId(Long id) {
        return barbeiroServicoRepository.findById(id);
    }

    public BarbeiroServico salvar(BarbeiroServico barbeiroServico) {
        return barbeiroServicoRepository.save(barbeiroServico);
    }

    public BarbeiroServico ativar(Long id) {

        BarbeiroServico barbeiroServico = barbeiroServicoRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vínculo entre barbeiro e serviço não encontrado."));

        barbeiroServico.setAtivo(true);

        return barbeiroServicoRepository.save(barbeiroServico);
    }

    public BarbeiroServico desativar(Long id) {

        BarbeiroServico barbeiroServico = barbeiroServicoRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vínculo entre barbeiro e serviço não encontrado."));

        barbeiroServico.setAtivo(false);

        return barbeiroServicoRepository.save(barbeiroServico);
    }

    public void excluir(Long id) {

        if (!barbeiroServicoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Vínculo entre barbeiro e serviço não encontrado.");
        }

        barbeiroServicoRepository.deleteById(id);
    }
}