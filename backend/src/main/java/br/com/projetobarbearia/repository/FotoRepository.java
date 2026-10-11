package br.com.projetobarbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.projetobarbearia.entity.Foto;

public interface FotoRepository extends JpaRepository<Foto, Long> {

    @Query("""
        select f from Foto f
        join f.barbearia b
        where f.ativa = true
          and b.ativa = true
        order by b.idBarbearia, f.ordem, f.idFoto
        """)
    List<Foto> listarPublicasOrdenadas();
}
