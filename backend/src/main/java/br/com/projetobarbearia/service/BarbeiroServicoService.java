package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.BarbeiroServico;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.BarbeiroServicoRepository;

@Service
public class BarbeiroServicoService {

    private final BarbeiroServicoRepository barbeiroServicoRepository;
    private final BarbeiroService barbeiroService;
    private final ServicoService servicoService;

    public BarbeiroServicoService(
            BarbeiroServicoRepository barbeiroServicoRepository,
            BarbeiroService barbeiroService,
            ServicoService servicoService) {

        this.barbeiroServicoRepository = barbeiroServicoRepository;
        this.barbeiroService = barbeiroService;
        this.servicoService = servicoService;
    }

    public List<BarbeiroServico> listarTodos() {
        return barbeiroServicoRepository.findAll();
    }

    public Optional<BarbeiroServico> buscarPorId(Long id) {
        return barbeiroServicoRepository.findById(id);
    }

    public BarbeiroServico cadastrar(
            Long idBarbeiro,
            Long idServico) {

        Barbeiro barbeiro = barbeiroService.buscarPorId(idBarbeiro)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbeiro não encontrado."));

        Servico servico = servicoService.buscarPorId(idServico)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        if (!barbeiro.getBarbearia().getIdBarbearia()
                .equals(servico.getBarbearia().getIdBarbearia())) {

            throw new IllegalArgumentException(
                    "O barbeiro e o serviço precisam pertencer à mesma barbearia.");
        }

        if (!barbeiro.isAtivo()) {
            throw new IllegalArgumentException(
                    "O barbeiro precisa estar ativo.");
        }

        if (!servico.isAtivo()) {
            throw new IllegalArgumentException(
                    "O serviço precisa estar ativo.");
        }

        Optional<BarbeiroServico> existente =
                barbeiroServicoRepository
                        .findByBarbeiro_IdBarbeiroAndServico_IdServico(
                                idBarbeiro,
                                idServico);

        if (existente.isPresent()) {

            if (existente.get().isAtivo()) {
                throw new IllegalArgumentException(
                        "Este serviço já está vinculado ao barbeiro.");
            }

            BarbeiroServico vinculo = existente.get();
            vinculo.setAtivo(true);

            return barbeiroServicoRepository.save(vinculo);
        }

        BarbeiroServico barbeiroServico =
                new BarbeiroServico();

        barbeiroServico.setBarbeiro(barbeiro);
        barbeiroServico.setServico(servico);
        barbeiroServico.setAtivo(true);

        return barbeiroServicoRepository.save(
                barbeiroServico);
    }

    public BarbeiroServico ativar(Long id) {

        BarbeiroServico barbeiroServico =
                barbeiroServicoRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vínculo barbeiro-serviço não encontrado."));

        if (!barbeiroServico.getBarbeiro().isAtivo()) {
            throw new IllegalArgumentException(
                    "O barbeiro precisa estar ativo.");
        }

        if (!barbeiroServico.getServico().isAtivo()) {
            throw new IllegalArgumentException(
                    "O serviço precisa estar ativo.");
        }

        barbeiroServico.setAtivo(true);

        return barbeiroServicoRepository.save(
                barbeiroServico);
    }

    public BarbeiroServico desativar(Long id) {

        BarbeiroServico barbeiroServico =
                barbeiroServicoRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vínculo barbeiro-serviço não encontrado."));

        barbeiroServico.setAtivo(false);

        return barbeiroServicoRepository.save(
                barbeiroServico);
    }

    public void excluir(Long id) {

        if (!barbeiroServicoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Vínculo barbeiro-serviço não encontrado.");
        }

        barbeiroServicoRepository.deleteById(id);
    }
}