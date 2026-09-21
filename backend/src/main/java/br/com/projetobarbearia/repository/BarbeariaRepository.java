package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Barbearia;

public interface BarbeariaRepository extends JpaRepository<Barbearia, Long> {

}
