package br.com.projetobarbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.ProprietarioBarbearia;

public interface ProprietarioBarbeariaRepository
        extends JpaRepository<ProprietarioBarbearia, Long> {

    boolean existsByBarbearia_IdBarbeariaAndAtivoTrue(
            Long idBarbearia);

    List<ProprietarioBarbearia>
            findByUsuario_IdUsuarioAndAtivoTrue(
                    Long idUsuario);

    List<ProprietarioBarbearia>
            findByBarbearia_IdBarbeariaIn(
                    List<Long> idsBarbearias);
}