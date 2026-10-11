package br.com.projetobarbearia.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetobarbearia.dto.ResumoAvaliacaoBarbeariaResponse;
import br.com.projetobarbearia.repository.AvaliacaoRepository;

@ExtendWith(MockitoExtension.class)
class AvaliacaoResumoControllerTests {

    @Mock
    private AvaliacaoRepository avaliacaoRepository;

    @InjectMocks
    private AvaliacaoResumoController controller;

    @Test
    void deveRetornarResumoDasAvaliacoes() {
        var esperado = List.of(
                new ResumoAvaliacaoBarbeariaResponse(1L, 4.5, 2L),
                new ResumoAvaliacaoBarbeariaResponse(2L, 5.0, 1L)
        );

        when(avaliacaoRepository.listarResumoPorBarbearia())
                .thenReturn(esperado);

        var resultado = controller.listar();

        assertEquals(esperado, resultado);
        verify(avaliacaoRepository).listarResumoPorBarbearia();
    }
}