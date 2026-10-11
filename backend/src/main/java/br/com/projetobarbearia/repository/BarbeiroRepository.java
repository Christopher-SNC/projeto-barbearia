package br.com.projetobarbearia.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.projetobarbearia.entity.Barbeiro;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select b from Barbeiro b
        where b.idBarbeiro = :idBarbeiro
        """)
    Optional<Barbeiro> buscarParaAgendamentoComLock(
            @Param("idBarbeiro") Long idBarbeiro);

    boolean existsByBarbearia_IdBarbeariaAndAtivoTrue(Long idBarbearia);

    Optional<Barbeiro> findByUsuario_IdUsuarioAndAtivoTrue(Long idUsuario);

    List<Barbeiro> findByBarbearia_IdBarbeariaIn(
            List<Long> idsBarbearias);
}