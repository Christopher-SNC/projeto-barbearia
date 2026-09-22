package br.com.projetobarbearia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Barbearia;

public interface BarbeariaRepository
        extends JpaRepository<Barbearia, Long> {

    Optional<Barbearia> findByCnpj(String cnpj);

}