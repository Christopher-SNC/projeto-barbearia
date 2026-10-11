package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.EnderecoRepository;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.ServicoRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class BarbeariaCadastroPermissaoTests {
    @Mock private BarbeariaRepository barbeariaRepository;
    @Mock private ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;
    @Mock private EnderecoRepository enderecoRepository;
    @Mock private HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    @Mock private BarbeiroRepository barbeiroRepository;
    @Mock private ServicoRepository servicoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private AutorizacaoService autorizacaoService;
    @InjectMocks private BarbeariaService service;

    private void prepararLogin() {
        when(autorizacaoService.obterIdUsuarioAutenticado()).thenReturn(10L);
    }

    private void prepararGravacao() {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(10L);
        when(usuarioRepository.findById(10L)).thenReturn(Optional.of(usuario));
        when(barbeariaRepository.save(any(Barbearia.class))).thenAnswer(invocacao -> {
            Barbearia barbearia = invocacao.getArgument(0);
            barbearia.setIdBarbearia(33L);
            return barbearia;
        });
    }

    @Test
    void impedeBarbeiroFuncionarioDeCriarBarbeariaPelaApi() {
        prepararLogin();
        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(10L))
                .thenReturn(Optional.of(new Barbeiro()));

        assertThrows(AccessDeniedException.class, () -> service.salvar(new Barbearia()));
        verify(barbeariaRepository, never()).save(any(Barbearia.class));
        verify(proprietarioBarbeariaRepository, never()).save(any(ProprietarioBarbearia.class));
    }

    @Test
    void clienteComumPodeCriarBarbearia() {
        prepararLogin();
        prepararGravacao();
        Barbearia resultado = service.salvar(new Barbearia());
        assertEquals(33L, resultado.getIdBarbearia());
        assertFalse(resultado.isAtiva());
        verify(proprietarioBarbeariaRepository).save(any(ProprietarioBarbearia.class));
    }

    @Test
    void proprietarioQueTambemEBarbeiroPodeCriarOutraBarbearia() {
        prepararLogin();
        prepararGravacao();
        when(barbeiroRepository.findByUsuario_IdUsuarioAndAtivoTrue(10L))
                .thenReturn(Optional.of(new Barbeiro()));
        when(proprietarioBarbeariaRepository.findByUsuario_IdUsuarioAndAtivoTrue(10L))
                .thenReturn(List.of(new ProprietarioBarbearia()));

        Barbearia resultado = service.salvar(new Barbearia());
        assertEquals(33L, resultado.getIdBarbearia());
        verify(proprietarioBarbeariaRepository).save(any(ProprietarioBarbearia.class));
    }
}
