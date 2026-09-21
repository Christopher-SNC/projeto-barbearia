package br.com.projetobarbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.ItemAgendamento;

public interface ItemAgendamentoRepository
        extends JpaRepository<ItemAgendamento, Long> {

    List<ItemAgendamento> findByAgendamento_IdAgendamento(
            Long idAgendamento);

}
