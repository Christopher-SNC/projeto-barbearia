package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.repository.BarbeiroRepository;

@Service
public class BarbeiroService {

    private final BarbeiroRepository barbeiroRepository;
    private final BarbeariaService barbeariaService;

    public BarbeiroService(
            BarbeiroRepository barbeiroRepository,
            BarbeariaService barbeariaService) {

        this.barbeiroRepository = barbeiroRepository;
        this.barbeariaService = barbeariaService;
    }

    public List<Barbeiro> listarTodos() {
        return barbeiroRepository.findAll();
    }

    public Optional<Barbeiro> buscarPorId(Long id) {
        return barbeiroRepository.findById(id);
    }

    @Transactional
    public Barbeiro salvar(Barbeiro barbeiro) {

        Barbeiro barbeiroSalvo =
                barbeiroRepository.save(barbeiro);

        barbeariaService.desativarSeInvalida(
                barbeiroSalvo.getBarbearia().getIdBarbearia());

        return barbeiroSalvo;
    }

    @Transactional
    public Barbeiro ativar(Long id) {

        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbeiro não encontrado."));

        barbeiro.setAtivo(true);

        return barbeiroRepository.save(barbeiro);
    }

    @Transactional
    public Barbeiro desativar(Long id) {

        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbeiro não encontrado."));

        barbeiro.setAtivo(false);

        Barbeiro barbeiroSalvo =
                barbeiroRepository.save(barbeiro);

        barbeariaService.desativarSeInvalida(
                barbeiro.getBarbearia().getIdBarbearia());

        return barbeiroSalvo;
    }

    @Transactional
    public void excluir(Long id) {

        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbeiro não encontrado."));

        Long idBarbearia =
                barbeiro.getBarbearia().getIdBarbearia();

        barbeiroRepository.delete(barbeiro);
        barbeiroRepository.flush();

        barbeariaService.desativarSeInvalida(idBarbearia);
    }
}