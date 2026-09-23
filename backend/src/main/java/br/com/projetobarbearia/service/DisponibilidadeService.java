package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.Disponibilidade;
import br.com.projetobarbearia.repository.DisponibilidadeRepository;

@Service
public class DisponibilidadeService {

    private final DisponibilidadeRepository disponibilidadeRepository;
    private final BarbeiroService barbeiroService;

    public DisponibilidadeService(
            DisponibilidadeRepository disponibilidadeRepository,
            BarbeiroService barbeiroService) {

        this.disponibilidadeRepository = disponibilidadeRepository;
        this.barbeiroService = barbeiroService;
    }

    public List<Disponibilidade> listarTodos() {
        return disponibilidadeRepository.findAll();
    }

    public Optional<Disponibilidade> buscarPorId(Long id) {
        return disponibilidadeRepository.findById(id);
    }

    public Disponibilidade cadastrar(
            Long idBarbeiro,
            Disponibilidade disponibilidade) {

        Barbeiro barbeiro = barbeiroService.buscarPorId(idBarbeiro)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbeiro não encontrado."));

        validarDisponibilidade(disponibilidade);

        disponibilidade.setBarbeiro(barbeiro);
        disponibilidade.setAtivo(true);

        return disponibilidadeRepository.save(
                disponibilidade);
    }

    public Disponibilidade atualizar(
            Long id,
            Long idBarbeiro,
            Disponibilidade novosDados) {

        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Disponibilidade não encontrada."));

        Barbeiro barbeiro = barbeiroService.buscarPorId(idBarbeiro)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbeiro não encontrado."));

        validarDisponibilidade(novosDados);

        disponibilidade.setBarbeiro(barbeiro);
        disponibilidade.setDiaSemana(
                novosDados.getDiaSemana());
        disponibilidade.setHoraInicio(
                novosDados.getHoraInicio());
        disponibilidade.setHoraFim(
                novosDados.getHoraFim());

        return disponibilidadeRepository.save(
                disponibilidade);
    }

    public Disponibilidade ativar(Long id) {

        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Disponibilidade não encontrada."));

        disponibilidade.setAtivo(true);

        return disponibilidadeRepository.save(
                disponibilidade);
    }

    public Disponibilidade desativar(Long id) {

        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Disponibilidade não encontrada."));

        disponibilidade.setAtivo(false);

        return disponibilidadeRepository.save(
                disponibilidade);
    }

    public void excluir(Long id) {

        if (!disponibilidadeRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Disponibilidade não encontrada.");
        }

        disponibilidadeRepository.deleteById(id);
    }

    private void validarDisponibilidade(
            Disponibilidade disponibilidade) {

        if (disponibilidade.getDiaSemana() == null) {
            throw new IllegalArgumentException(
                    "O dia da semana é obrigatório.");
        }

        if (disponibilidade.getHoraInicio() == null
                || disponibilidade.getHoraFim() == null) {

            throw new IllegalArgumentException(
                    "Horário inicial e final são obrigatórios.");
        }

        if (!disponibilidade.getHoraInicio()
                .isBefore(disponibilidade.getHoraFim())) {

            throw new IllegalArgumentException(
                    "O horário inicial deve ser anterior ao horário final.");
        }
    }
}