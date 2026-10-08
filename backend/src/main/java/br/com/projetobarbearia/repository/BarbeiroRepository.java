package br.com.projetobarbearia.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Barbeiro;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {

    boolean existsByBarbearia_IdBarbeariaAndAtivoTrue(Long idBarbearia);

    Optional<Barbeiro> findByUsuario_IdUsuarioAndAtivoTrue(Long idUsuario);

    List<Barbeiro> findByBarbearia_IdBarbeariaIn(
            List<Long> idsBarbearias);
}