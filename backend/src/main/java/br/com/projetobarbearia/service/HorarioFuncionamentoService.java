package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;

@Service
public class HorarioFuncionamentoService {

    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    private final BarbeariaService barbeariaService;

    public HorarioFuncionamentoService(
            HorarioFuncionamentoRepository horarioFuncionamentoRepository,
            BarbeariaService barbeariaService) {

        this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
        this.barbeariaService = barbeariaService;
    }

    public List<HorarioFuncionamento> listarTodos() {
        return horarioFuncionamentoRepository.findAll();
    }

    public Optional<HorarioFuncionamento> buscarPorId(Long id) {
        return horarioFuncionamentoRepository.findById(id);
    }

    public HorarioFuncionamento cadastrar(
            Long idBarbearia,
            HorarioFuncionamento horario) {

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        validarHorario(horario);

        horario.setBarbearia(barbearia);

        return horarioFuncionamentoRepository.save(horario);
    }

    public HorarioFuncionamento atualizar(
            Long id,
            Long idBarbearia,
            HorarioFuncionamento novosDados) {

        HorarioFuncionamento horario =
                horarioFuncionamentoRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Horário de funcionamento não encontrado."));

        Barbearia barbearia =
                barbeariaService.buscarPorId(idBarbearia)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Barbearia não encontrada."));

        validarHorario(novosDados);

        Long idBarbeariaAnterior =
                horario.getBarbearia().getIdBarbearia();

        horario.setBarbearia(barbearia);
        horario.setDiaSemana(novosDados.getDiaSemana());
        horario.setHoraAbertura(novosDados.getHoraAbertura());
        horario.setHoraFechamento(novosDados.getHoraFechamento());
        horario.setFechado(novosDados.isFechado());

        HorarioFuncionamento salvo =
                horarioFuncionamentoRepository.save(horario);

        barbeariaService.desativarSeInvalida(idBarbearia);

        if (!idBarbeariaAnterior.equals(idBarbearia)) {
            barbeariaService.desativarSeInvalida(
                    idBarbeariaAnterior);
        }

        return salvo;
    }

    @Transactional
    public void excluir(Long id) {

        HorarioFuncionamento horario =
                horarioFuncionamentoRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Horário de funcionamento não encontrado."));

        Long idBarbearia =
                horario.getBarbearia().getIdBarbearia();

        horarioFuncionamentoRepository.delete(horario);
        horarioFuncionamentoRepository.flush();

        barbeariaService.desativarSeInvalida(idBarbearia);
    }

    private void validarHorario(
            HorarioFuncionamento horario) {

        if (horario.getDiaSemana() == null) {
            throw new IllegalArgumentException(
                    "O dia da semana é obrigatório.");
        }

        if (!horario.isFechado()) {

            if (horario.getHoraAbertura() == null
                    || horario.getHoraFechamento() == null) {

                throw new IllegalArgumentException(
                        "Horário de abertura e fechamento são obrigatórios.");
            }

            if (!horario.getHoraAbertura()
                    .isBefore(horario.getHoraFechamento())) {

                throw new IllegalArgumentException(
                        "O horário de abertura deve ser anterior ao horário de fechamento.");
            }
        }
    }
}