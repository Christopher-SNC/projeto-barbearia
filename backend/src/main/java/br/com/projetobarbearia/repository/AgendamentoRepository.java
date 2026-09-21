package br.com.projetobarbearia.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.enums.StatusAgendamento;

public interface AgendamentoRepository
        extends JpaRepository<Agendamento, Long> {

    List<Agendamento>
            findByBarbeiro_IdBarbeiroAndStatusAndDataHoraInicioGreaterThanEqualAndDataHoraInicioLessThan(
                    Long idBarbeiro,
                    StatusAgendamento status,
                    LocalDateTime inicio,
                    LocalDateTime fim);

}
