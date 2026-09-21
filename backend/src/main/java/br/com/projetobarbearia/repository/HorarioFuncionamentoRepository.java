package br.com.projetobarbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.enums.DiaSemana;

public interface HorarioFuncionamentoRepository
        extends JpaRepository<HorarioFuncionamento, Long> {

    boolean existsByBarbearia_IdBarbeariaAndFechadoFalse(
            Long idBarbearia);

    List<HorarioFuncionamento>
            findByBarbearia_IdBarbeariaAndDiaSemanaAndFechadoFalse(
                    Long idBarbearia,
                    DiaSemana diaSemana);
}