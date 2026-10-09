package br.com.projetobarbearia.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.UsuarioRepository;
import br.com.projetobarbearia.security.UsuarioPrincipal;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(
            UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado."));

        return new UsuarioPrincipal(
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getSenhaHash(),
                usuario.isAtivo());
    }
}