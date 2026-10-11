package br.com.projetobarbearia.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Promocao;
import br.com.projetobarbearia.entity.PromocaoServico;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.PromocaoServicoRepository;

@Service
public class PrecoPromocionalService {

    private static final BigDecimal CEM = new BigDecimal("100");

    private final PromocaoServicoRepository repository;

    public PrecoPromocionalService(
            PromocaoServicoRepository repository) {
        this.repository = repository;
    }

    public record ResultadoPreco(
            BigDecimal precoOriginal,
            BigDecimal percentualDesconto,
            BigDecimal precoFinal
    ) {}

    @Transactional(readOnly = true)
    public ResultadoPreco calcular(
            Servico servico,
            LocalDate dataAtendimento) {

        BigDecimal desconto = repository
                .findByServico_IdServico(servico.getIdServico())
                .stream()
                .map(PromocaoServico::getPromocao)
                .filter(promocao ->
                        promocaoValida(
                                promocao,
                                servico,
                                dataAtendimento))
                .map(Promocao::getPercentualDesconto)
                .max(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        BigDecimal original = servico.getPreco();

        BigDecimal finalCalculado = original
                .multiply(CEM.subtract(desconto))
                .divide(CEM, 2, RoundingMode.HALF_UP);

        return new ResultadoPreco(
                original,
                desconto.setScale(2),
                finalCalculado);
    }

    private boolean promocaoValida(
            Promocao promocao,
            Servico servico,
            LocalDate data) {

        if (promocao == null
                || !promocao.isAtiva()
                || promocao.getBarbearia() == null
                || servico.getBarbearia() == null
                || !promocao.getBarbearia().getIdBarbearia()
                        .equals(servico.getBarbearia().getIdBarbearia())
                || promocao.getDataInicio() == null
                || promocao.getDataFim() == null
                || promocao.getPercentualDesconto() == null) {
            return false;
        }

        BigDecimal percentual = promocao.getPercentualDesconto();

        return !data.isBefore(promocao.getDataInicio())
                && !data.isAfter(promocao.getDataFim())
                && percentual.signum() > 0
                && percentual.compareTo(CEM) <= 0;
    }
}