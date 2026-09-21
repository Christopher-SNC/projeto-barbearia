package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.Favorito;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

}
