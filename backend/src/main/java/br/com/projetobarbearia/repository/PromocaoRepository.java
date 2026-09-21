package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Promocao;

public interface PromocaoRepository extends JpaRepository<Promocao, Long> {

}
