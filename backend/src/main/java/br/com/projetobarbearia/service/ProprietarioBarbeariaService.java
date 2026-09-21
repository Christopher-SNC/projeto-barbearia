package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;

@Service
public class ProprietarioBarbeariaService {

    private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;
    private final BarbeariaService barbeariaService;

    public ProprietarioBarbeariaService(
            ProprietarioBarbeariaRepository proprietarioBarbeariaRepository,
            BarbeariaService barbeariaService) {

        this.proprietarioBarbeariaRepository =
                proprietarioBarbeariaRepository;

        this.barbeariaService = barbeariaService;
    }

    public List<ProprietarioBarbearia> listarTodos() {
        return proprietarioBarbeariaRepository.findAll();
    }

    public Optional<ProprietarioBarbearia> buscarPorId(Long id) {
        return proprietarioBarbeariaRepository.findById(id);
    }

    @Transactional
    public ProprietarioBarbearia salvar(
            ProprietarioBarbearia proprietarioBarbearia) {

        ProprietarioBarbearia salvo =
                proprietarioBarbeariaRepository.save(
                        proprietarioBarbearia);

        barbeariaService.desativarSeInvalida(
                salvo.getBarbearia().getIdBarbearia());

        return salvo;
    }

    @Transactional
    public ProprietarioBarbearia ativar(Long id) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vínculo de proprietário não encontrado."));

        proprietario.setAtivo(true);

        return proprietarioBarbeariaRepository.save(
                proprietario);
    }

    @Transactional
    public ProprietarioBarbearia desativar(Long id) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vínculo de proprietário não encontrado."));

        proprietario.setAtivo(false);

        ProprietarioBarbearia salvo =
                proprietarioBarbeariaRepository.save(
                        proprietario);

        barbeariaService.desativarSeInvalida(
                proprietario.getBarbearia()
                        .getIdBarbearia());

        return salvo;
    }

    @Transactional
    public void excluir(Long id) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vínculo de proprietário não encontrado."));

        Long idBarbearia =
                proprietario.getBarbearia()
                        .getIdBarbearia();

        proprietarioBarbeariaRepository.delete(
                proprietario);

        proprietarioBarbeariaRepository.flush();

        barbeariaService.desativarSeInvalida(
                idBarbearia);
    }
}