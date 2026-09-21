package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Foto;

public interface FotoRepository extends JpaRepository<Foto, Long> {

}
