package br.com.projetobarbearia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Avaliacao;
import br.com.projetobarbearia.enums.StatusAgendamento;
import br.com.projetobarbearia.repository.AgendamentoRepository;
import br.com.projetobarbearia.repository.AvaliacaoRepository;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AgendamentoRepository agendamentoRepository;

    public AvaliacaoService(
            AvaliacaoRepository avaliacaoRepository,
            AgendamentoRepository agendamentoRepository) {

        this.avaliacaoRepository = avaliacaoRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findAll();
    }

    public Optional<Avaliacao> buscarPorId(Long id) {
        return avaliacaoRepository.findById(id);
    }

    public Avaliacao salvar(Avaliacao avaliacao) {

        validarNotas(avaliacao);

        if (avaliacao.getAgendamento() == null
                || avaliacao.getAgendamento().getIdAgendamento() == null) {

            throw new IllegalArgumentException(
                    "O agendamento é obrigatório.");
        }

        Long idAgendamento =
                avaliacao.getAgendamento().getIdAgendamento();

        Agendamento agendamento = agendamentoRepository
                .findById(idAgendamento)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Agendamento não encontrado."));

        if (agendamento.getStatus()
                != StatusAgendamento.CONCLUIDO) {

            throw new IllegalArgumentException(
                    "Só é possível avaliar um agendamento concluído.");
        }

        if (avaliacao.getIdAvaliacao() == null
                && avaliacaoRepository
                        .existsByAgendamento_IdAgendamento(
                                idAgendamento)) {

            throw new IllegalArgumentException(
                    "Este agendamento já possui uma avaliação.");
        }

        avaliacao.setAgendamento(agendamento);

        if (avaliacao.getDataAvaliacao() == null) {
            avaliacao.setDataAvaliacao(LocalDateTime.now());
        }

        return avaliacaoRepository.save(avaliacao);
    }

    public void excluir(Long id) {

        if (!avaliacaoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Avaliação não encontrada.");
        }

        avaliacaoRepository.deleteById(id);
    }

    private void validarNotas(Avaliacao avaliacao) {

        if (avaliacao.getNotaBarbearia() < 1
                || avaliacao.getNotaBarbearia() > 5) {

            throw new IllegalArgumentException(
                    "A nota da barbearia deve estar entre 1 e 5.");
        }

        if (avaliacao.getNotaBarbeiro() != null
                && (avaliacao.getNotaBarbeiro() < 1
                        || avaliacao.getNotaBarbeiro() > 5)) {

            throw new IllegalArgumentException(
                    "A nota do barbeiro deve estar entre 1 e 5.");
        }
    }
}