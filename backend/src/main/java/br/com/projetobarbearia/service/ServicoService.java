package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.ServicoRepository;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final BarbeariaService barbeariaService;

    public ServicoService(
            ServicoRepository servicoRepository,
            BarbeariaService barbeariaService) {

        this.servicoRepository = servicoRepository;
        this.barbeariaService = barbeariaService;
    }

    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscarPorId(Long id) {
        return servicoRepository.findById(id);
    }

    @Transactional
    public Servico salvar(Servico servico) {

        Servico servicoSalvo =
                servicoRepository.save(servico);

        barbeariaService.desativarSeInvalida(
                servicoSalvo.getBarbearia().getIdBarbearia());

        return servicoSalvo;
    }

    @Transactional
    public Servico ativar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        servico.setAtivo(true);

        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico desativar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        servico.setAtivo(false);

        Servico servicoSalvo =
                servicoRepository.save(servico);

        barbeariaService.desativarSeInvalida(
                servico.getBarbearia().getIdBarbearia());

        return servicoSalvo;
    }

    @Transactional
    public void excluir(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        Long idBarbearia =
                servico.getBarbearia().getIdBarbearia();

        servicoRepository.delete(servico);
        servicoRepository.flush();

        barbeariaService.desativarSeInvalida(idBarbearia);
    }
}