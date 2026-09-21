package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;

@Service
public class ProprietarioBarbeariaService {

    private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;

    public ProprietarioBarbeariaService(
            ProprietarioBarbeariaRepository proprietarioBarbeariaRepository) {

        this.proprietarioBarbeariaRepository = proprietarioBarbeariaRepository;
    }

    public List<ProprietarioBarbearia> listarTodos() {
        return proprietarioBarbeariaRepository.findAll();
    }

    public Optional<ProprietarioBarbearia> buscarPorId(Long id) {
        return proprietarioBarbeariaRepository.findById(id);
    }

    public ProprietarioBarbearia salvar(
            ProprietarioBarbearia proprietarioBarbearia) {

        return proprietarioBarbeariaRepository.save(proprietarioBarbearia);
    }

    public ProprietarioBarbearia ativar(Long id) {

        ProprietarioBarbearia proprietario = proprietarioBarbeariaRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vínculo de proprietário não encontrado."));

        proprietario.setAtivo(true);

        return proprietarioBarbeariaRepository.save(proprietario);
    }

    public ProprietarioBarbearia desativar(Long id) {

        ProprietarioBarbearia proprietario = proprietarioBarbeariaRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vínculo de proprietário não encontrado."));

        proprietario.setAtivo(false);

        return proprietarioBarbeariaRepository.save(proprietario);
    }

    public void excluir(Long id) {

        if (!proprietarioBarbeariaRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Vínculo de proprietário não encontrado.");
        }

        proprietarioBarbeariaRepository.deleteById(id);
    }
}