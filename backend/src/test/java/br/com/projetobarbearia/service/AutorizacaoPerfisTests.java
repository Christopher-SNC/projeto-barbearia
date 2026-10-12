package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.security.UsuarioPrincipal;

@ExtendWith(MockitoExtension.class)
class AutorizacaoPerfisTests {

    @Mock
    private BarbeiroRepository barbeiroRepository;

    @Mock
    private ProprietarioBarbeariaRepository proprietarioRepository;

    @InjectMocks
    private AutorizacaoService autorizacaoService;

    @AfterEach
    void limparSessao() {
        SecurityContextHolder.clearContext();
    }

    private void autenticar(Long idUsuario) {
        UsuarioPrincipal principal =
                mock(UsuarioPrincipal.class);

        when(principal.getIdUsuario())
                .thenReturn(idUsuario);

        var autenticacao =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        List.of()
                );

        SecurityContextHolder
                .getContext()
                .setAuthentication(autenticacao);
    }

    private ProprietarioBarbearia vinculo(Long idBarbearia) {
        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(idBarbearia);

        ProprietarioBarbearia vinculo =
                new ProprietarioBarbearia();

        vinculo.setBarbearia(barbearia);
        vinculo.setAtivo(true);

        return vinculo;
    }

    private Barbeiro barbeiro(boolean ativo) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(30L);

        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(20L);

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setIdBarbeiro(40L);
        barbeiro.setUsuario(usuario);
        barbeiro.setBarbearia(barbearia);
        barbeiro.setAtivo(ativo);

        return barbeiro;
    }

    @Test
    void usuarioNaoAutenticadoNaoPodeAcessarDados() {
        SecurityContextHolder.clearContext();

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService
                        .obterIdUsuarioAutenticado()
        );
    }

    @Test
    void usuarioPodeAcessarPropriosDados() {
        autenticar(10L);

        assertDoesNotThrow(
                () -> autorizacaoService
                        .exigirProprioUsuario(10L)
        );
    }

    @Test
    void usuarioNaoPodeAcessarDadosDeOutro() {
        autenticar(10L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService
                        .exigirProprioUsuario(11L)
        );
    }

    @Test
    void proprietarioPodeAdministrarSuaBarbearia() {
        autenticar(60L);

        when(proprietarioRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(List.of(vinculo(20L)));

        assertDoesNotThrow(
                () -> autorizacaoService
                        .exigirProprietarioDaBarbearia(20L)
        );
    }

    @Test
    void proprietarioNaoPodeAdministrarOutraBarbearia() {
        autenticar(60L);

        when(proprietarioRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(List.of(vinculo(99L)));

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService
                        .exigirProprietarioDaBarbearia(20L)
        );
    }

    @Test
    void clienteSemVinculoNaoPodeAdministrarBarbearia() {
        autenticar(10L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService
                        .exigirProprietarioDaBarbearia(20L)
        );
    }

    @Test
    void barbeiroAtivoPodeGerenciarSuaDisponibilidade() {
        autenticar(30L);

        assertDoesNotThrow(
                () -> autorizacaoService
                        .exigirPermissaoGerenciarDisponibilidade(
                                barbeiro(true))
        );
    }

    @Test
    void outroUsuarioNaoPodeGerenciarDisponibilidade() {
        autenticar(50L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService
                        .exigirPermissaoGerenciarDisponibilidade(
                                barbeiro(true))
        );
    }

    @Test
    void barbeiroInativoNaoPodeGerenciarDisponibilidade() {
        autenticar(30L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService
                        .exigirPermissaoGerenciarDisponibilidade(
                                barbeiro(false))
        );
    }

    @Test
    void proprietarioPodeGerenciarDisponibilidadeDeSeuBarbeiro() {
        autenticar(60L);

        when(proprietarioRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(List.of(vinculo(20L)));

        assertDoesNotThrow(
                () -> autorizacaoService
                        .exigirPermissaoGerenciarDisponibilidade(
                                barbeiro(true))
        );
    }

    @Test
    void clienteComumPodeUsarOperacoesDeCliente() {
        autenticar(10L);

        assertDoesNotThrow(
                () -> autorizacaoService.exigirPerfilCliente());
    }

    @Test
    void funcionarioBarbeiroNaoPodeUsarOperacoesDeCliente() {
        autenticar(30L);

        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(30L))
                .thenReturn(Optional.of(barbeiro(true)));

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPerfilCliente());
    }

    @Test
    void proprietarioQueTambemEBarbeiroMantemPerfilCliente() {
        autenticar(60L);

        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(Optional.of(barbeiro(true)));
        when(proprietarioRepository.findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(List.of(vinculo(20L)));

        assertDoesNotThrow(
                () -> autorizacaoService.exigirPerfilCliente());
    }

    @Test
    void perfilClienteExigeSessaoAutenticada() {
        SecurityContextHolder.clearContext();

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPerfilCliente());
    }
}
