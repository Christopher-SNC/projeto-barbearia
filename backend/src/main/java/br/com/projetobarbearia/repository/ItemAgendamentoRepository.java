package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.ItemAgendamento;

public interface ItemAgendamentoRepository
        extends JpaRepository<ItemAgendamento, Long> {

}
