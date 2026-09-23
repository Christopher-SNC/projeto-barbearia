package br.com.projetobarbearia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.BarbeiroServico;

public interface BarbeiroServicoRepository
                extends JpaRepository<BarbeiroServico, Long> {

        boolean existsByBarbeiro_IdBarbeiroAndServico_IdServicoAndAtivoTrue(
                        Long idBarbeiro,
                        Long idServico);

        Optional<BarbeiroServico> findByBarbeiro_IdBarbeiroAndServico_IdServico(
                        Long idBarbeiro,
                        Long idServico);
}