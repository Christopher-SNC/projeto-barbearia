package br.com.projetobarbearia.security;

import java.io.IOException;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.projetobarbearia.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class SessaoUsuarioAtivoFilter extends OncePerRequestFilter {

    private final UsuarioRepository usuarioRepository;

    public SessaoUsuarioAtivoFilter(
            UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                && authentication.getPrincipal()
                        instanceof UsuarioPrincipal usuarioPrincipal) {

            boolean usuarioAtivo = usuarioRepository
                    .findById(usuarioPrincipal.getIdUsuario())
                    .map(usuario -> usuario.isAtivo())
                    .orElse(false);

            if (!usuarioAtivo) {
                SecurityContextHolder.clearContext();

                HttpSession session =
                        request.getSession(false);

                if (session != null) {
                    session.invalidate();
                }
            }
        }

        filterChain.doFilter(
                request,
                response);
    }
}
