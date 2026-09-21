package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.repository.BarbeiroRepository;

@Service
public class BarbeiroService {

    private final BarbeiroRepository barbeiroRepository;

    public BarbeiroService(BarbeiroRepository barbeiroRepository) {
        this.barbeiroRepository = barbeiroRepository;
    }

    public List<Barbeiro> listarTodos() {
        return barbeiroRepository.findAll();
    }

    public Optional<Barbeiro> buscarPorId(Long id) {
        return barbeiroRepository.findById(id);
    }

    public Barbeiro salvar(Barbeiro barbeiro) {
        return barbeiroRepository.save(barbeiro);
    }

    public Barbeiro ativar(Long id) {

        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Barbeiro não encontrado."));

        barbeiro.setAtivo(true);

        return barbeiroRepository.save(barbeiro);
    }

    public Barbeiro desativar(Long id) {

        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Barbeiro não encontrado."));

        barbeiro.setAtivo(false);

        return barbeiroRepository.save(barbeiro);
    }

    public void excluir(Long id) {

        if (!barbeiroRepository.existsById(id)) {
            throw new IllegalArgumentException("Barbeiro não encontrado.");
        }

        barbeiroRepository.deleteById(id);
    }
}