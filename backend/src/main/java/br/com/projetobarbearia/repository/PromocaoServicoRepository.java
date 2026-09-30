package br.com.projetobarbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetobarbearia.entity.PromocaoServico;

public interface PromocaoServicoRepository
                extends JpaRepository<PromocaoServico, Long> {

        boolean existsByPromocao_IdPromocaoAndServico_IdServico(
                        Long idPromocao,
                        Long idServico);

        List<PromocaoServico> findByPromocao_IdPromocao(
                        Long idPromocao);

        void deleteByPromocao_IdPromocao(
                        Long idPromocao);
}