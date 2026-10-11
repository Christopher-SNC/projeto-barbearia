package br.com.projetobarbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import br.com.projetobarbearia.dto.ResumoAvaliacaoBarbeariaResponse;

import br.com.projetobarbearia.entity.Avaliacao;

public interface AvaliacaoRepository
        extends JpaRepository<Avaliacao, Long> {

    boolean existsByAgendamento_IdAgendamento(Long idAgendamento);

    @Query("""
            SELECT new br.com.projetobarbearia.dto.ResumoAvaliacaoBarbeariaResponse(
                b.idBarbearia,
                AVG(av.notaBarbearia),
                COUNT(av)
            )
            FROM Avaliacao av
            JOIN av.agendamento ag
            JOIN ag.barbearia b
            GROUP BY b.idBarbearia
            """)
    List<ResumoAvaliacaoBarbeariaResponse> listarResumoPorBarbearia();

}