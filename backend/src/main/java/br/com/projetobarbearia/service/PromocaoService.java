package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Promocao;
import br.com.projetobarbearia.repository.PromocaoRepository;
import br.com.projetobarbearia.repository.PromocaoServicoRepository;

@Service
public class PromocaoService {

    private final PromocaoRepository promocaoRepository;
    private final PromocaoServicoRepository promocaoServicoRepository;
    private final BarbeariaService barbeariaService;

    public PromocaoService(
            PromocaoRepository promocaoRepository,
            PromocaoServicoRepository promocaoServicoRepository,
            BarbeariaService barbeariaService) {

        this.promocaoRepository = promocaoRepository;
        this.promocaoServicoRepository = promocaoServicoRepository;
        this.barbeariaService = barbeariaService;
    }

    public List<Promocao> listarTodas() {
        return promocaoRepository.findAll();
    }

    public Optional<Promocao> buscarPorId(Long id) {
        return promocaoRepository.findById(id);
    }

    public Promocao cadastrar(
            Long idBarbearia,
            Promocao promocao) {

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia não encontrada."));

        validarPromocao(promocao);

        promocao.setBarbearia(barbearia);
        promocao.setAtiva(true);

        return promocaoRepository.save(promocao);
    }

    public Promocao atualizar(
            Long id,
            Long idBarbearia,
            Promocao novosDados) {

        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Promoção não encontrada."));

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia não encontrada."));

        validarPromocao(novosDados);

        /*
         * Uma promoção não deve ser transferida para outra
         * barbearia depois de criada, pois ela pode possuir
         * serviços vinculados.
         */
        if (!promocao.getBarbearia()
                .getIdBarbearia()
                .equals(barbearia.getIdBarbearia())) {

            throw new IllegalArgumentException(
                    "Não é permitido alterar a barbearia da promoção.");
        }

        promocao.setTitulo(
                novosDados.getTitulo());

        promocao.setDescricao(
                novosDados.getDescricao());

        promocao.setPercentualDesconto(
                novosDados.getPercentualDesconto());

        promocao.setDataInicio(
                novosDados.getDataInicio());

        promocao.setDataFim(
                novosDados.getDataFim());

        promocao.setTipo(
                novosDados.getTipo());

        return promocaoRepository.save(promocao);
    }

    public Promocao ativar(Long id) {

        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Promoção não encontrada."));

        validarPromocao(promocao);

        promocao.setAtiva(true);

        return promocaoRepository.save(promocao);
    }

    public Promocao desativar(Long id) {

        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Promoção não encontrada."));

        promocao.setAtiva(false);

        return promocaoRepository.save(promocao);
    }

    @Transactional
    public void excluir(Long id) {

        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Promoção não encontrada."));

        promocaoServicoRepository
                .deleteByPromocao_IdPromocao(id);

        promocaoRepository.delete(promocao);
    }

    private void validarPromocao(
            Promocao promocao) {

        if (promocao.getTitulo() == null
                || promocao.getTitulo().isBlank()) {

            throw new IllegalArgumentException(
                    "O título da promoção é obrigatório.");
        }

        if (promocao.getPercentualDesconto() == null
                || promocao.getPercentualDesconto()
                        .signum() <= 0) {

            throw new IllegalArgumentException(
                    "O percentual de desconto deve ser maior que zero.");
        }

        if (promocao.getDataInicio() == null) {
            throw new IllegalArgumentException(
                    "A data inicial é obrigatória.");
        }

        if (promocao.getDataFim() == null) {
            throw new IllegalArgumentException(
                    "A data final é obrigatória.");
        }

        if (promocao.getDataFim()
                .isBefore(promocao.getDataInicio())) {

            throw new IllegalArgumentException(
                    "A data final não pode ser anterior à data inicial.");
        }

        if (promocao.getTipo() == null) {
            throw new IllegalArgumentException(
                    "O tipo da promoção é obrigatório.");
        }
    }
}