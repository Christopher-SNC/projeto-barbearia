package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;

@Service
public class HorarioFuncionamentoService {

    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    private final BarbeariaService barbeariaService;

    public HorarioFuncionamentoService(
            HorarioFuncionamentoRepository horarioFuncionamentoRepository,
            BarbeariaService barbeariaService) {

        this.horarioFuncionamentoRepository =
                horarioFuncionamentoRepository;

        this.barbeariaService = barbeariaService;
    }

    public List<HorarioFuncionamento> listarTodos() {
        return horarioFuncionamentoRepository.findAll();
    }

    public Optional<HorarioFuncionamento> buscarPorId(Long id) {
        return horarioFuncionamentoRepository.findById(id);
    }

    @Transactional
    public HorarioFuncionamento salvar(
            HorarioFuncionamento horarioFuncionamento) {

        HorarioFuncionamento salvo =
                horarioFuncionamentoRepository.save(
                        horarioFuncionamento);

        barbeariaService.desativarSeInvalida(
                salvo.getBarbearia().getIdBarbearia());

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
                horario.getBarbearia()
                        .getIdBarbearia();

        horarioFuncionamentoRepository.delete(
                horario);

        horarioFuncionamentoRepository.flush();

        barbeariaService.desativarSeInvalida(
                idBarbearia);
    }
}