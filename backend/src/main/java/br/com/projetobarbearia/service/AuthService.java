package br.com.projetobarbearia.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;

    public AuthService(
            AuthenticationManager authenticationManager) {

        this.authenticationManager = authenticationManager;
    }

    public Authentication autenticar(
            String email,
            String senha) {

        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(
                email,
                senha);

        return authenticationManager.authenticate(
                authenticationRequest);
    }
}
