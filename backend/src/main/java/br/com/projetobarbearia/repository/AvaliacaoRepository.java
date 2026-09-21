package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Avaliacao;

public interface AvaliacaoRepository
        extends JpaRepository<Avaliacao, Long> {

}