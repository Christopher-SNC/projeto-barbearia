package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Barbeiro;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {

}