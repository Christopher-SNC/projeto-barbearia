package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Promocao;
import br.com.projetobarbearia.entity.PromocaoServico;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.PromocaoServicoRepository;

@ExtendWith(MockitoExtension.class)
class PrecoPromocionalServiceTests {

    @Mock
    private PromocaoServicoRepository repository;

    @InjectMocks
    private PrecoPromocionalService service;

    private static final LocalDate DATA =
            LocalDate.of(2026, 10, 15);

    private Servico servico(String preco) {
        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(10L);

        Servico servico = new Servico();
        servico.setIdServico(1L);
        servico.setBarbearia(barbearia);
        servico.setPreco(new BigDecimal(preco));
        return servico;
    }

    private PromocaoServico promocao(
            String percentual,
            boolean ativa,
            LocalDate inicio,
            LocalDate fim) {

        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(10L);

        Promocao promocao = new Promocao();
        promocao.setBarbearia(barbearia);
        promocao.setPercentualDesconto(
                new BigDecimal(percentual));
        promocao.setAtiva(ativa);
        promocao.setDataInicio(inicio);
        promocao.setDataFim(fim);

        PromocaoServico vinculo = new PromocaoServico();
        vinculo.setPromocao(promocao);
        return vinculo;
    }

    @Test
    void semPromocaoMantemPrecoOriginal() {
        when(repository.findByServico_IdServico(1L))
                .thenReturn(List.of());

        var resultado = service.calcular(servico("50.00"), DATA);

        assertEquals(
                new BigDecimal("50.00"),
                resultado.precoFinal());
        assertEquals(
                new BigDecimal("0.00"),
                resultado.percentualDesconto());
    }

    @Test
    void aplicaMaiorDescontoSemAcumular() {
        var inicio = DATA.minusDays(1);
        var fim = DATA.plusDays(1);

        when(repository.findByServico_IdServico(1L))
                .thenReturn(List.of(
                        promocao("10.00", true, inicio, fim),
                        promocao("30.00", true, inicio, fim)
                ));

        var resultado = service.calcular(servico("50.00"), DATA);

        assertEquals(
                new BigDecimal("35.00"),
                resultado.precoFinal());
        assertEquals(
                new BigDecimal("30.00"),
                resultado.percentualDesconto());
    }

    @Test
    void ignoraPromocaoInativaOuVencida() {
        when(repository.findByServico_IdServico(1L))
                .thenReturn(List.of(
                        promocao("20.00", false, DATA, DATA),
                        promocao(
                                "30.00",
                                true,
                                DATA.minusDays(10),
                                DATA.minusDays(1))
                ));

        var resultado = service.calcular(servico("50.00"), DATA);

        assertEquals(
                new BigDecimal("50.00"),
                resultado.precoFinal());
    }

    @Test
    void arredondaPrecoParaDuasCasas() {
        when(repository.findByServico_IdServico(1L))
                .thenReturn(List.of(
                        promocao("15.00", true, DATA, DATA)
                ));

        var resultado = service.calcular(servico("49.99"), DATA);

        assertEquals(
                new BigDecimal("42.49"),
                resultado.precoFinal());
    }

    @Test
    void ignoraDescontoAcimaDeCemPorCento() {
        when(repository.findByServico_IdServico(1L))
                .thenReturn(List.of(
                        promocao("125.00", true, DATA, DATA)
                ));

        var resultado = service.calcular(servico("50.00"), DATA);

        assertEquals(
                new BigDecimal("50.00"),
                resultado.precoFinal());
    }
}