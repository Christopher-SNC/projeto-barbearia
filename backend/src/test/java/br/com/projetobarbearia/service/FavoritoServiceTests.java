package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Favorito;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.FavoritoRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

class FavoritoServiceTests {

    private FavoritoRepository favoritoRepository;
    private UsuarioRepository usuarioRepository;
    private BarbeariaRepository barbeariaRepository;
    private AutorizacaoService autorizacaoService;
    private FavoritoService service;

    @BeforeEach
    void preparar() {
        favoritoRepository = mock(FavoritoRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        barbeariaRepository = mock(BarbeariaRepository.class);
        autorizacaoService = mock(AutorizacaoService.class);

        service = new FavoritoService(
                favoritoRepository,
                usuarioRepository,
                barbeariaRepository,
                autorizacaoService);

        when(autorizacaoService.obterIdUsuarioAutenticado())
                .thenReturn(10L);
    }

    @Test
    void deveListarSomenteFavoritosDoUsuarioAutenticado() {
        Favorito favorito = new Favorito();

        when(favoritoRepository.findByUsuario_IdUsuario(10L))
                .thenReturn(List.of(favorito));

        assertEquals(1, service.listarMeusFavoritos().size());

        verify(favoritoRepository).findByUsuario_IdUsuario(10L);
        verify(favoritoRepository, never()).findAll();
    }

    @Test
    void naoDeveDuplicarFavoritoExistente() {
        Favorito existente = new Favorito();

        when(favoritoRepository
                .findByUsuario_IdUsuarioAndBarbearia_IdBarbearia(
                        10L, 20L))
                .thenReturn(Optional.of(existente));

        assertSame(existente, service.adicionar(20L));

        verify(favoritoRepository, never()).save(any());
    }

    @Test
    void deveImpedirExcluirFavoritoDeOutroUsuario() {
        Usuario outroUsuario = new Usuario();
        outroUsuario.setIdUsuario(99L);

        Favorito favorito = new Favorito();
        favorito.setUsuario(outroUsuario);

        when(favoritoRepository.findById(30L))
                .thenReturn(Optional.of(favorito));

        assertThrows(
                AccessDeniedException.class,
                () -> service.remover(30L));

        verify(favoritoRepository, never()).delete(any());
    }

    @Test
    void deveAdicionarFavoritoParaUsuarioAutenticado() {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(10L);

        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(20L);
        barbearia.setAtiva(true);

        when(favoritoRepository
                .findByUsuario_IdUsuarioAndBarbearia_IdBarbearia(
                        10L, 20L))
                .thenReturn(Optional.empty());

        when(usuarioRepository.findById(10L))
                .thenReturn(Optional.of(usuario));

        when(barbeariaRepository.findById(20L))
                .thenReturn(Optional.of(barbearia));

        when(favoritoRepository.save(any(Favorito.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Favorito salvo = service.adicionar(20L);

        assertSame(usuario, salvo.getUsuario());
        assertSame(barbearia, salvo.getBarbearia());
        assertNotNull(salvo.getDataAdicao());
    }

    @Test
    void deveRejeitarBarbeariaInativa() {
        Usuario usuario = new Usuario();
        Barbearia barbearia = new Barbearia();
        barbearia.setAtiva(false);

        when(usuarioRepository.findById(10L))
                .thenReturn(Optional.of(usuario));

        when(barbeariaRepository.findById(20L))
                .thenReturn(Optional.of(barbearia));

        assertThrows(
                IllegalArgumentException.class,
                () -> service.adicionar(20L));

        verify(favoritoRepository, never()).save(any());
    }
}