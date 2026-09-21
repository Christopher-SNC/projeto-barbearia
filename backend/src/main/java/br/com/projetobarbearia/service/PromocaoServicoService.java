package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.PromocaoServico;
import br.com.projetobarbearia.repository.PromocaoServicoRepository;

@Service
public class PromocaoServicoService {

    private final PromocaoServicoRepository promocaoServicoRepository;

    public PromocaoServicoService(
            PromocaoServicoRepository promocaoServicoRepository) {

        this.promocaoServicoRepository = promocaoServicoRepository;
    }

    public List<PromocaoServico> listarTodos() {
        return promocaoServicoRepository.findAll();
    }

    public Optional<PromocaoServico> buscarPorId(Long id) {
        return promocaoServicoRepository.findById(id);
    }

    public PromocaoServico salvar(PromocaoServico promocaoServico) {
        return promocaoServicoRepository.save(promocaoServico);
    }

    public void excluir(Long id) {

        if (!promocaoServicoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Vínculo entre promoção e serviço não encontrado.");
        }

        promocaoServicoRepository.deleteById(id);
    }
}