package br.com.projetobarbearia.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Favorito;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuario_IdUsuario(Long idUsuario);

    Optional<Favorito> findByUsuario_IdUsuarioAndBarbearia_IdBarbearia(
            Long idUsuario,
            Long idBarbearia);
}