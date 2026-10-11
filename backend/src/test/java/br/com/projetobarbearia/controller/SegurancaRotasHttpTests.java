package br.com.projetobarbearia.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import br.com.projetobarbearia.config.SecurityConfig;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.exception.GlobalExceptionHandler;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.ServicoRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;
import br.com.projetobarbearia.security.UsuarioPrincipal;
import br.com.projetobarbearia.service.AutorizacaoService;
import br.com.projetobarbearia.service.BarbeariaService;
import br.com.projetobarbearia.service.BarbeiroService;
import br.com.projetobarbearia.service.ServicoService;
import br.com.projetobarbearia.service.UsuarioService;

@WebMvcTest({
    UsuarioController.class,
    ServicoController.class
})
@Import({
    SecurityConfig.class,
    GlobalExceptionHandler.class,
    AutorizacaoService.class,
    ServicoService.class
})
class SegurancaRotasHttpTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @MockitoBean
    private ProprietarioBarbeariaRepository proprietarioRepository;

    @MockitoBean
    private BarbeiroRepository barbeiroRepository;

    @MockitoBean
    private ServicoRepository servicoRepository;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private BarbeiroService barbeiroService;

    @MockitoBean
    private BarbeariaService barbeariaService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void prepararUsuarios() {
        for (Long id : List.of(10L, 60L)) {
            Usuario usuario = new Usuario();
            usuario.setIdUsuario(id);
            usuario.setNome("Usuario Teste");
            usuario.setEmail("usuario" + id + "@example.invalid");
            usuario.setAtivo(true);

            when(usuarioRepository.findById(id))
                    .thenReturn(Optional.of(usuario));
        }
    }

    private RequestPostProcessor usuarioAutenticado(Long id) {
        UsuarioPrincipal principal = new UsuarioPrincipal(
                id,
                "usuario" + id + "@example.invalid",
                "hash-teste",
                true
        );

        var autenticacao =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        List.of(new SimpleGrantedAuthority("USUARIO"))
                );

        return authentication(autenticacao);
    }

    private String servicoJson() {
        return """
                {
                  "idBarbearia": 20,
                  "nome": "Corte Teste",
                  "descricao": "Teste HTTP",
                  "preco": 40.00,
                  "duracaoMinutos": 30
                }
                """;
    }

    private void definirProprietario(Long usuario, Long barbearia) {
        Barbearia loja = new Barbearia();
        loja.setIdBarbearia(barbearia);

        ProprietarioBarbearia vinculo =
                new ProprietarioBarbearia();

        vinculo.setBarbearia(loja);
        vinculo.setAtivo(true);

        when(proprietarioRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(usuario))
                .thenReturn(List.of(vinculo));
    }

    @Test
    void consultaPublicaDeServicosRetorna200() throws Exception {
        mockMvc.perform(
                get("/api/servicos")
        ).andExpect(status().isOk());
    }

    @Test
    void consultaDeUsuarioSemLoginRetorna401() throws Exception {
        mockMvc.perform(
                get("/api/usuarios/10")
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void usuarioConsultaSeusDadosComSucesso() throws Exception {
        Usuario usuario = usuarioRepository.findById(10L)
                .orElseThrow();

        when(usuarioService.buscarPorId(10L))
                .thenReturn(Optional.of(usuario));

        mockMvc.perform(
                get("/api/usuarios/10")
                        .with(usuarioAutenticado(10L))
        ).andExpect(status().isOk());
    }

    @Test
    void usuarioNaoPodeConsultarDadosDeOutro() throws Exception {
        mockMvc.perform(
                get("/api/usuarios/11")
                        .with(usuarioAutenticado(10L))
        ).andExpect(status().isForbidden());

        verify(usuarioService, never()).buscarPorId(11L);
    }

    @Test
    void usuarioNaoPodeAtualizarDadosDeOutro() throws Exception {
        mockMvc.perform(
                put("/api/usuarios/11")
                        .with(usuarioAutenticado(10L))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Alteracao Indevida",
                                  "email": "outro@example.invalid",
                                  "telefone": null
                                }
                                """)
        ).andExpect(status().isForbidden());
    }

    @Test
    void cadastroDeServicoSemLoginRetorna401() throws Exception {
        mockMvc.perform(
                post("/api/servicos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(servicoJson())
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void cadastroDeServicoSemCsrfRetorna403() throws Exception {
        mockMvc.perform(
                post("/api/servicos")
                        .with(usuarioAutenticado(60L))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(servicoJson())
        ).andExpect(status().isForbidden());
    }

    @Test
    void clienteNaoPodeCadastrarServico() throws Exception {
        mockMvc.perform(
                post("/api/servicos")
                        .with(usuarioAutenticado(10L))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(servicoJson())
        ).andExpect(status().isForbidden());

        verify(servicoRepository, never())
                .save(any(Servico.class));
    }

    @Test
    void proprietarioNaoPodeCadastrarServicoEmOutraLoja()
            throws Exception {

        definirProprietario(60L, 99L);

        mockMvc.perform(
                post("/api/servicos")
                        .with(usuarioAutenticado(60L))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(servicoJson())
        ).andExpect(status().isForbidden());

        verify(servicoRepository, never())
                .save(any(Servico.class));
    }

    @Test
    void proprietarioPodeCadastrarServicoNaPropriaLoja()
            throws Exception {

        definirProprietario(60L, 20L);

        Barbearia loja = new Barbearia();
        loja.setIdBarbearia(20L);

        when(barbeariaService.buscarPorId(20L))
                .thenReturn(Optional.of(loja));

        when(servicoRepository.save(any(Servico.class)))
                .thenAnswer(invocacao -> {
                    Servico servico = invocacao.getArgument(0);
                    servico.setIdServico(40L);
                    return servico;
                });

        mockMvc.perform(
                post("/api/servicos")
                        .with(usuarioAutenticado(60L))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(servicoJson())
        ).andExpect(status().isCreated());

        verify(servicoRepository).save(any(Servico.class));
    }
}