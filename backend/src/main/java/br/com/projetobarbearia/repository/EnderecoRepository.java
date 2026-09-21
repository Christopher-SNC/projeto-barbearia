package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Endereco;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

}
