package br.com.projetobarbearia.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Foto;
import br.com.projetobarbearia.repository.FotoRepository;

@ExtendWith(MockitoExtension.class)
class FotoPublicaControllerTests {

    @Mock
    private FotoRepository repository;

    @InjectMocks
    private FotoPublicaController controller;

    @Test
    void retornaFotosPublicasComIdentificacaoDaBarbearia() {
        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(5L);

        Foto foto = new Foto();
        foto.setIdFoto(10L);
        foto.setBarbearia(barbearia);
        foto.setUrl("/imagens/fachada.png");
        foto.setLegenda("Fachada");
        foto.setOrdem(1);
        foto.setAtiva(true);

        when(repository.listarPublicasOrdenadas())
                .thenReturn(List.of(foto));

        var resposta = controller.listarPublicas().getBody();

        assertNotNull(resposta);
        assertEquals(1, resposta.size());
        assertEquals(5L, resposta.getFirst().getIdBarbearia());
        assertEquals("Fachada", resposta.getFirst().getLegenda());
        assertEquals(true, resposta.getFirst().isAtiva());
    }
}