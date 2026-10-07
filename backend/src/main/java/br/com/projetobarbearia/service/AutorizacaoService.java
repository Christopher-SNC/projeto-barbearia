package br.com.projetobarbearia.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.security.UsuarioPrincipal;

@Service
public class AutorizacaoService {

    private final BarbeiroRepository barbeiroRepository;
    private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;

    public AutorizacaoService(
            BarbeiroRepository barbeiroRepository,
            ProprietarioBarbeariaRepository proprietarioBarbeariaRepository) {

        this.barbeiroRepository = barbeiroRepository;
        this.proprietarioBarbeariaRepository = proprietarioBarbeariaRepository;
    }

    public Long obterIdUsuarioAutenticado() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            negarAcesso();
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UsuarioPrincipal)) {
            negarAcesso();
        }

        return ((UsuarioPrincipal) principal)
                .getIdUsuario();
    }

    public void exigirProprioUsuario(
            Long idUsuario) {

        Long idUsuarioAutenticado = obterIdUsuarioAutenticado();

        if (!idUsuarioAutenticado.equals(idUsuario)) {
            negarAcesso();
        }
    }

    public void exigirPermissaoCancelarAgendamento(
            Agendamento agendamento) {

        Long idUsuarioAutenticado = obterIdUsuarioAutenticado();

        boolean clienteDoAgendamento = idUsuarioAutenticado.equals(
                agendamento.getCliente()
                        .getIdUsuario());

        boolean proprietarioDaBarbearia = ehProprietarioDaBarbearia(
                idUsuarioAutenticado,
                agendamento.getBarbearia()
                        .getIdBarbearia());

        if (!clienteDoAgendamento
                && !proprietarioDaBarbearia) {

            negarAcesso();
        }
    }

    public void exigirPermissaoGerenciarAgendamento(
            Agendamento agendamento) {

        Long idUsuarioAutenticado = obterIdUsuarioAutenticado();

        boolean barbeiroResponsavel = barbeiroRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(
                        idUsuarioAutenticado)
                .map(barbeiro -> barbeiro.getIdBarbeiro()
                        .equals(
                                agendamento
                                        .getBarbeiro()
                                        .getIdBarbeiro()))
                .orElse(false);

        boolean proprietarioDaBarbearia = ehProprietarioDaBarbearia(
                idUsuarioAutenticado,
                agendamento.getBarbearia()
                        .getIdBarbearia());

        if (!barbeiroResponsavel
                && !proprietarioDaBarbearia) {

            negarAcesso();
        }
    }

    public void exigirPermissaoVisualizarAgendamento(
            Agendamento agendamento) {

        Long idUsuarioAutenticado =
                obterIdUsuarioAutenticado();

        boolean clienteDoAgendamento =
                idUsuarioAutenticado.equals(
                        agendamento.getCliente()
                                .getIdUsuario());

        boolean barbeiroResponsavel = barbeiroRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(
                        idUsuarioAutenticado)
                .map(barbeiro -> barbeiro.getIdBarbeiro()
                        .equals(
                                agendamento.getBarbeiro()
                                        .getIdBarbeiro()))
                .orElse(false);

        boolean proprietarioDaBarbearia =
                ehProprietarioDaBarbearia(
                        idUsuarioAutenticado,
                        agendamento.getBarbearia()
                                .getIdBarbearia());

        if (!clienteDoAgendamento
                && !barbeiroResponsavel
                && !proprietarioDaBarbearia) {

            negarAcesso();
        }
    }

    private boolean ehProprietarioDaBarbearia(
            Long idUsuario,
            Long idBarbearia) {

        return proprietarioBarbeariaRepository
                .findByUsuario_IdUsuarioAndAtivoTrue(
                        idUsuario)
                .stream()
                .anyMatch(vinculo -> vinculo.getBarbearia()
                        .getIdBarbearia()
                        .equals(idBarbearia));
    }

    private void negarAcesso() {

        throw new AccessDeniedException(
                "Acesso negado.");
    }
}
