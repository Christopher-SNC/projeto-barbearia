package br.com.projetobarbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Disponibilidade;
import br.com.projetobarbearia.enums.DiaSemana;

public interface DisponibilidadeRepository
        extends JpaRepository<Disponibilidade, Long> {

    List<Disponibilidade>
            findByBarbeiro_IdBarbeiroAndDiaSemanaAndAtivoTrue(
                    Long idBarbeiro,
                    DiaSemana diaSemana);
}