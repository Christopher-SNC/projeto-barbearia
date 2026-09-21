package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.HorarioFuncionamento;

public interface HorarioFuncionamentoRepository
        extends JpaRepository<HorarioFuncionamento, Long> {
            boolean existsByBarbearia_IdBarbeariaAndFechadoFalse(Long idBarbearia);
}
