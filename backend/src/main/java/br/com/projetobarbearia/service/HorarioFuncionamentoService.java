package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;

@Service
public class HorarioFuncionamentoService {

    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;

    public HorarioFuncionamentoService(
            HorarioFuncionamentoRepository horarioFuncionamentoRepository) {

        this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
    }

    public List<HorarioFuncionamento> listarTodos() {
        return horarioFuncionamentoRepository.findAll();
    }

    public Optional<HorarioFuncionamento> buscarPorId(Long id) {
        return horarioFuncionamentoRepository.findById(id);
    }

    public HorarioFuncionamento salvar(
            HorarioFuncionamento horarioFuncionamento) {

        return horarioFuncionamentoRepository.save(horarioFuncionamento);
    }

    public void excluir(Long id) {

        if (!horarioFuncionamentoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Horário de funcionamento não encontrado.");
        }

        horarioFuncionamentoRepository.deleteById(id);
    }
}