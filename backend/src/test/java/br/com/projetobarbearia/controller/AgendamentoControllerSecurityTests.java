package br.com.projetobarbearia.controller;

import br.com.projetobarbearia.config.SecurityConfig;
import br.com.projetobarbearia.exception.GlobalExceptionHandler;
import br.com.projetobarbearia.service.AgendamentoService;
import br.com.projetobarbearia.service.AutorizacaoService;
import br.com.projetobarbearia.service.ItemAgendamentoService;
import br.com.projetobarbearia.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AgendamentoController.class)
@Import({
        SecurityConfig.class,
        GlobalExceptionHandler.class
})
class AgendamentoControllerSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private AgendamentoService agendamentoService;

    @MockitoBean
    private ItemAgendamentoService itemAgendamentoService;

    @MockitoBean
    private AutorizacaoService autorizacaoService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @Test
    void operacoesAutorizadasRetornam200() throws Exception {
        var agendamento = new br.com.projetobarbearia.entity.Agendamento();
        agendamento.setIdAgendamento(100L);

        var cliente = new br.com.projetobarbearia.entity.Usuario();
        cliente.setIdUsuario(10L);
        cliente.setNome("Cliente Teste");

        var barbearia = new br.com.projetobarbearia.entity.Barbearia();
        barbearia.setIdBarbearia(20L);

        var usuarioBarbeiro = new br.com.projetobarbearia.entity.Usuario();
        usuarioBarbeiro.setNome("Barbeiro Teste");

        var barbeiro = new br.com.projetobarbearia.entity.Barbeiro();
        barbeiro.setIdBarbeiro(30L);
        barbeiro.setUsuario(usuarioBarbeiro);

        agendamento.setCliente(cliente);
        agendamento.setBarbearia(barbearia);
        agendamento.setBarbeiro(barbeiro);

        when(agendamentoService.cancelar(100L)).thenReturn(agendamento);
        when(agendamentoService.concluir(100L)).thenReturn(agendamento);
        when(agendamentoService.marcarNaoCompareceu(100L))
                .thenReturn(agendamento);

        for (String operacao : new String[] {
                "cancelar", "concluir", "nao-compareceu"
        }) {
            mockMvc.perform(
                    patch("/api/agendamentos/100/" + operacao)
                            .with(user("teste"))
                            .with(csrf())
            ).andExpect(status().isOk());
        }

        verify(agendamentoService).cancelar(100L);
        verify(agendamentoService).concluir(100L);
        verify(agendamentoService).marcarNaoCompareceu(100L);
    }
    @Test
    void semAutenticacaoRetorna401() throws Exception {
        mockMvc.perform(
                patch("/api/agendamentos/100/concluir")
                        .with(csrf())
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void semCsrfRetorna403() throws Exception {
        mockMvc.perform(
                patch("/api/agendamentos/100/concluir")
                        .with(user("teste"))
        ).andExpect(status().isForbidden());
    }

    @Test
    void acessoNegadoRetorna403() throws Exception {
        when(agendamentoService.concluir(100L))
                .thenThrow(
                        new org.springframework.security.access.AccessDeniedException(
                                "Acesso negado."
                        )
                );

        mockMvc.perform(
                patch("/api/agendamentos/100/concluir")
                        .with(user("teste"))
                        .with(csrf())
        ).andExpect(status().isForbidden());
    }

    @Test
    void statusInvalidoRetorna400() throws Exception {
        when(agendamentoService.cancelar(100L))
                .thenThrow(
                        new IllegalArgumentException(
                                "Agendamento não está confirmado."
                        )
                );

        mockMvc.perform(
                patch("/api/agendamentos/100/cancelar")
                        .with(user("teste"))
                        .with(csrf())
        ).andExpect(status().isBadRequest());
    }
}