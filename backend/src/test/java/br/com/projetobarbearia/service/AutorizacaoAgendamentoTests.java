package br.com.projetobarbearia.service;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.security.UsuarioPrincipal;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AutorizacaoAgendamentoTests {

    private final BarbeiroRepository barbeiroRepository =
            mock(BarbeiroRepository.class);

    private final ProprietarioBarbeariaRepository proprietarioRepository =
            mock(ProprietarioBarbeariaRepository.class);

    private AutorizacaoService autorizacaoService;
    private Agendamento agendamento;

    @BeforeEach
    void preparar() {
        autorizacaoService = new AutorizacaoService(
                barbeiroRepository,
                proprietarioRepository
        );

        Usuario cliente = new Usuario();
        cliente.setIdUsuario(10L);

        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(20L);

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setIdBarbeiro(30L);

        agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbearia(barbearia);
        agendamento.setBarbeiro(barbeiro);

        when(proprietarioRepository.findByUsuario_IdUsuarioAndAtivoTrue(anyLong()))
                .thenReturn(List.of());

        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(anyLong()))
                .thenReturn(Optional.empty());
    }

    @AfterEach
    void limpar() {
        SecurityContextHolder.clearContext();
    }

    private void autenticar(long idUsuario) {
        UsuarioPrincipal principal = mock(UsuarioPrincipal.class);

        when(principal.getIdUsuario()).thenReturn(idUsuario);

        var autenticacao = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                List.of()
        );

        SecurityContextHolder.getContext().setAuthentication(autenticacao);
    }

    @Test
    void clienteNaoPodeConcluir() {
        autenticar(10L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPermissaoGerenciarAgendamento(
                        agendamento
                )
        );
    }

    @Test
    void clienteNaoPodeRegistrarAusencia() {
        autenticar(10L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPermissaoGerenciarAgendamento(
                        agendamento
                )
        );
    }

    @Test
    void barbeiroDiferenteNaoPodeGerenciar() {
        autenticar(40L);

        Barbeiro outroBarbeiro = new Barbeiro();
        outroBarbeiro.setIdBarbeiro(99L);

        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(40L))
                .thenReturn(Optional.of(outroBarbeiro));

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPermissaoGerenciarAgendamento(
                        agendamento
                )
        );
    }

    @Test
    void barbeiroResponsavelPodeGerenciar() {
        autenticar(40L);

        Barbeiro barbeiroResponsavel = new Barbeiro();
        barbeiroResponsavel.setIdBarbeiro(30L);

        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(40L))
                .thenReturn(Optional.of(barbeiroResponsavel));

        assertDoesNotThrow(
                () -> autorizacaoService.exigirPermissaoGerenciarAgendamento(
                        agendamento
                )
        );
    }

    @Test
    void clientePodeCancelarProprioAgendamento() {
        autenticar(10L);

        assertDoesNotThrow(
                () -> autorizacaoService.exigirPermissaoCancelarAgendamento(
                        agendamento
                )
        );
    }

    @Test
    void proprietarioDaBarbeariaPodeGerenciar() {
        autenticar(60L);

        ProprietarioBarbearia vinculo = new ProprietarioBarbearia();

        Usuario proprietario = new Usuario();
        proprietario.setIdUsuario(60L);

        vinculo.setUsuario(proprietario);
        vinculo.setBarbearia(agendamento.getBarbearia());
        vinculo.setAtivo(true);

        when(proprietarioRepository.findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(List.of(vinculo));

        assertDoesNotThrow(
                () -> autorizacaoService.exigirPermissaoGerenciarAgendamento(
                        agendamento
                )
        );
    }

    @Test
    void proprietarioDeOutraBarbeariaNaoPodeGerenciar() {
        autenticar(60L);

        Barbearia outraBarbearia = new Barbearia();
        outraBarbearia.setIdBarbearia(99L);

        ProprietarioBarbearia vinculo = new ProprietarioBarbearia();

        Usuario proprietario = new Usuario();
        proprietario.setIdUsuario(60L);

        vinculo.setUsuario(proprietario);
        vinculo.setBarbearia(outraBarbearia);
        vinculo.setAtivo(true);

        when(proprietarioRepository.findByUsuario_IdUsuarioAndAtivoTrue(60L))
                .thenReturn(List.of(vinculo));

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPermissaoGerenciarAgendamento(
                        agendamento
                )
        );
    }
    @Test
    void outroUsuarioNaoPodeCancelar() {
        autenticar(50L);

        assertThrows(
                AccessDeniedException.class,
                () -> autorizacaoService.exigirPermissaoCancelarAgendamento(
                        agendamento
                )
        );
    }
}