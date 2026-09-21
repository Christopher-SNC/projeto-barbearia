package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Disponibilidade;
import br.com.projetobarbearia.repository.DisponibilidadeRepository;

@Service
public class DisponibilidadeService {

    private final DisponibilidadeRepository disponibilidadeRepository;

    public DisponibilidadeService(
            DisponibilidadeRepository disponibilidadeRepository) {

        this.disponibilidadeRepository = disponibilidadeRepository;
    }

    public List<Disponibilidade> listarTodas() {
        return disponibilidadeRepository.findAll();
    }

    public Optional<Disponibilidade> buscarPorId(Long id) {
        return disponibilidadeRepository.findById(id);
    }

    public Disponibilidade salvar(Disponibilidade disponibilidade) {
        return disponibilidadeRepository.save(disponibilidade);
    }

    public Disponibilidade ativar(Long id) {

        Disponibilidade disponibilidade = disponibilidadeRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Disponibilidade não encontrada."));

        disponibilidade.setAtivo(true);

        return disponibilidadeRepository.save(disponibilidade);
    }

    public Disponibilidade desativar(Long id) {

        Disponibilidade disponibilidade = disponibilidadeRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Disponibilidade não encontrada."));

        disponibilidade.setAtivo(false);

        return disponibilidadeRepository.save(disponibilidade);
    }

    public void excluir(Long id) {

        if (!disponibilidadeRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Disponibilidade não encontrada.");
        }

        disponibilidadeRepository.deleteById(id);
    }
}
