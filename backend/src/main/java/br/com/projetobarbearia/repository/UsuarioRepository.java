package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
