package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import br.com.projetobarbearia.dto.LoginResponse;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class AuthPerfisFuncionarioTests {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private BarbeiroRepository barbeiroRepository;
    @Mock private ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;
    @InjectMocks private AuthService authService;

    private void configurarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(10L);
        usuario.setNome("Usuario Teste");
        usuario.setEmail("teste@example.invalid");
        when(usuarioRepository.findById(10L)).thenReturn(Optional.of(usuario));
    }

    private void configurarBarbeiro() {
        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(20L);
        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setIdBarbeiro(30L);
        barbeiro.setBarbearia(barbearia);
        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(10L))
                .thenReturn(Optional.of(barbeiro));
    }

    private void configurarProprietario() {
        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(20L);
        ProprietarioBarbearia vinculo = new ProprietarioBarbearia();
        vinculo.setBarbearia(barbearia);
        when(proprietarioBarbeariaRepository.findByUsuario_IdUsuarioAndAtivoTrue(10L))
                .thenReturn(List.of(vinculo));
    }

    @Test
    void clienteComumMantemSomenteCliente() {
        configurarUsuario();
        LoginResponse resposta = authService.buscarDadosUsuarioAutenticado(10L);
        assertEquals(List.of("CLIENTE"), resposta.getPerfis());
    }

    @Test
    void funcionarioBarbeiroNaoRecebePerfilCliente() {
        configurarUsuario();
        configurarBarbeiro();
        LoginResponse resposta = authService.buscarDadosUsuarioAutenticado(10L);
        assertEquals(List.of("BARBEIRO"), resposta.getPerfis());
        assertEquals(30L, resposta.getIdBarbeiro());
    }

    @Test
    void proprietarioNaoBarbeiroMantemClienteEProprietario() {
        configurarUsuario();
        configurarProprietario();
        LoginResponse resposta = authService.buscarDadosUsuarioAutenticado(10L);
        assertEquals(List.of("CLIENTE", "PROPRIETARIO"), resposta.getPerfis());
    }

    @Test
    void proprietarioBarbeiroMantemTresPerfis() {
        configurarUsuario();
        configurarBarbeiro();
        configurarProprietario();
        LoginResponse resposta = authService.buscarDadosUsuarioAutenticado(10L);
        assertEquals(List.of("CLIENTE", "BARBEIRO", "PROPRIETARIO"), resposta.getPerfis());
    }
}
