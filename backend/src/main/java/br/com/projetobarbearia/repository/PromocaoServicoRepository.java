package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.PromocaoServico;

public interface PromocaoServicoRepository
        extends JpaRepository<PromocaoServico, Long> {

}
