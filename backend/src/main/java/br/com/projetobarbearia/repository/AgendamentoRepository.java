package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Agendamento;

public interface AgendamentoRepository
        extends JpaRepository<Agendamento, Long> {

}
