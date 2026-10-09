package br.com.projetobarbearia.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsuarioPrincipal implements UserDetails {

    private final Long idUsuario;
    private final String email;
    private final String senhaHash;
    private final boolean ativo;

    public UsuarioPrincipal(
            Long idUsuario,
            String email,
            String senhaHash,
            boolean ativo) {

        this.idUsuario = idUsuario;
        this.email = email;
        this.senhaHash = senhaHash;
        this.ativo = ativo;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("USUARIO"));
    }

    @Override
    public String getPassword() {
        return senhaHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }
}