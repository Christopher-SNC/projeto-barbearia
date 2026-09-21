package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Disponibilidade;

public interface DisponibilidadeRepository
        extends JpaRepository<Disponibilidade, Long> {

}
