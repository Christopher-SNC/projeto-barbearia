package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Promocao;
import br.com.projetobarbearia.entity.PromocaoServico;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.PromocaoServicoRepository;

@Service
public class PromocaoServicoService {

    private final PromocaoServicoRepository promocaoServicoRepository;
    private final PromocaoService promocaoService;
    private final ServicoService servicoService;
    private final AutorizacaoService autorizacaoService;

    public PromocaoServicoService(
            PromocaoServicoRepository promocaoServicoRepository,
            PromocaoService promocaoService,
            ServicoService servicoService,
            AutorizacaoService autorizacaoService) {

        this.promocaoServicoRepository = promocaoServicoRepository;
        this.promocaoService = promocaoService;
        this.servicoService = servicoService;
        this.autorizacaoService = autorizacaoService;
    }

    public List<PromocaoServico> listarTodos() {
        return promocaoServicoRepository.findAll();
    }

    public List<PromocaoServico> listarPorPromocao(Long idPromocao) {
        return promocaoServicoRepository
                .findByPromocao_IdPromocao(idPromocao);
    }

    public Optional<PromocaoServico> buscarPorId(Long id) {
        return promocaoServicoRepository.findById(id);
    }

    public PromocaoServico cadastrar(
            Long idPromocao,
            Long idServico) {

        Promocao promocao = promocaoService.buscarPorId(idPromocao)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Promoção não encontrada."));

        Long idBarbeariaPromocao =
                promocao.getBarbearia().getIdBarbearia();

        autorizacaoService.exigirProprietarioDaBarbearia(
                idBarbeariaPromocao);

        Servico servico = servicoService.buscarPorId(idServico)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Serviço não encontrado."));

        Long idBarbeariaServico =
                servico.getBarbearia().getIdBarbearia();

        if (!idBarbeariaPromocao.equals(idBarbeariaServico)) {
            throw new IllegalArgumentException(
                    "A promoção e o serviço precisam pertencer à mesma barbearia.");
        }

        boolean jaExiste = promocaoServicoRepository
                .existsByPromocao_IdPromocaoAndServico_IdServico(
                        idPromocao,
                        idServico);

        if (jaExiste) {
            throw new IllegalArgumentException(
                    "O serviço já está vinculado a esta promoção.");
        }

        PromocaoServico vinculo = new PromocaoServico();
        vinculo.setPromocao(promocao);
        vinculo.setServico(servico);

        return promocaoServicoRepository.save(vinculo);
    }

    public void excluir(Long id) {

        PromocaoServico vinculo = promocaoServicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Vínculo entre promoção e serviço não encontrado."));

        autorizacaoService.exigirProprietarioDaBarbearia(
                vinculo.getPromocao()
                        .getBarbearia()
                        .getIdBarbearia());

        promocaoServicoRepository.delete(vinculo);
    }
}