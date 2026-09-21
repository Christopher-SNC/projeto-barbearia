package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.ServicoRepository;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscarPorId(Long id) {
        return servicoRepository.findById(id);
    }

    public Servico salvar(Servico servico) {
        return servicoRepository.save(servico);
    }

    public Servico ativar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Serviço não encontrado."));

        servico.setAtivo(true);

        return servicoRepository.save(servico);
    }

    public Servico desativar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Serviço não encontrado."));

        servico.setAtivo(false);

        return servicoRepository.save(servico);
    }

    public void excluir(Long id) {

        if (!servicoRepository.existsById(id)) {
            throw new IllegalArgumentException("Serviço não encontrado.");
        }

        servicoRepository.deleteById(id);
    }
}