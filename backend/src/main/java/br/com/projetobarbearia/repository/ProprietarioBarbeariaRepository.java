package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.ProprietarioBarbearia;

public interface ProprietarioBarbeariaRepository
        extends JpaRepository<ProprietarioBarbearia, Long> {

        boolean existsByBarbearia_IdBarbeariaAndAtivoTrue(Long idBarbearia);
}
