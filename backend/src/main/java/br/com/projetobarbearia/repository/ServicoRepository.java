package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Servico;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

}
