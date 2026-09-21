package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.BarbeiroServico;

public interface BarbeiroServicoRepository
        extends JpaRepository<BarbeiroServico, Long> {

}
