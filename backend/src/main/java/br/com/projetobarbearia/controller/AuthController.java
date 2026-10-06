package br.com.projetobarbearia.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.web.csrf.CsrfToken;

import br.com.projetobarbearia.dto.LoginRequest;
import br.com.projetobarbearia.dto.LoginResponse;
import br.com.projetobarbearia.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @GetMapping("/csrf")
        public ResponseEntity<CsrfToken> csrf(
                        CsrfToken csrfToken) {

                return ResponseEntity.ok(csrfToken);
        }

        private final AuthService authService;
        private final SecurityContextRepository securityContextRepository;
        private final SessionAuthenticationStrategy sessionAuthenticationStrategy;

        public AuthController(
                        AuthService authService,
                        SecurityContextRepository securityContextRepository,
                        SessionAuthenticationStrategy sessionAuthenticationStrategy) {

                this.authService = authService;
                this.securityContextRepository = securityContextRepository;
                this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
        }

        @PostMapping("/login")
        public ResponseEntity<Void> login(
                        @RequestBody LoginRequest request,
                        HttpServletRequest httpRequest,
                        HttpServletResponse httpResponse) {

                Authentication authentication = authService.autenticar(
                                request.getEmail(),
                                request.getSenha());

                sessionAuthenticationStrategy.onAuthentication(
                                authentication,
                                httpRequest,
                                httpResponse);

                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                securityContext.setAuthentication(authentication);
                SecurityContextHolder.setContext(securityContext);

                securityContextRepository.saveContext(
                                securityContext,
                                httpRequest,
                                httpResponse);

                return ResponseEntity.ok().build();
        }

        @GetMapping("/me")
        public ResponseEntity<LoginResponse> me(
                        @CurrentSecurityContext(expression = "authentication") Authentication authentication) {

                if (authentication == null
                                || authentication instanceof AnonymousAuthenticationToken
                                || !authentication.isAuthenticated()) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .build();
                }

                LoginResponse response = authService.buscarDadosUsuarioAutenticado(
                                authentication.getName());

                return ResponseEntity.ok(response);
        }
}
