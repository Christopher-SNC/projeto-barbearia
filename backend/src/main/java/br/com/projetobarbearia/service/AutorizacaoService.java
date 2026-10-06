package br.com.projetobarbearia.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.com.projetobarbearia.security.UsuarioPrincipal;

@Service
public class AutorizacaoService {

    public Long obterIdUsuarioAutenticado() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof UsuarioPrincipal usuarioPrincipal)) {

            throw new AccessDeniedException(
                    "Acesso negado.");
        }

        return usuarioPrincipal.getIdUsuario();
    }

    public void exigirProprioUsuario(
            Long idUsuario) {

        Long idUsuarioAutenticado = obterIdUsuarioAutenticado();

        if (!idUsuarioAutenticado.equals(idUsuario)) {
            throw new AccessDeniedException(
                    "Acesso negado.");
        }
    }
}