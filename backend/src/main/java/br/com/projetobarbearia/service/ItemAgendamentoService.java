package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.ItemAgendamento;
import br.com.projetobarbearia.repository.ItemAgendamentoRepository;

@Service
public class ItemAgendamentoService {

    private final ItemAgendamentoRepository itemAgendamentoRepository;

    public ItemAgendamentoService(
            ItemAgendamentoRepository itemAgendamentoRepository) {

        this.itemAgendamentoRepository = itemAgendamentoRepository;
    }

    public List<ItemAgendamento> listarTodos() {
        return itemAgendamentoRepository.findAll();
    }

    public Optional<ItemAgendamento> buscarPorId(Long id) {
        return itemAgendamentoRepository.findById(id);
    }

    public List<ItemAgendamento> listarPorAgendamento(
            Long idAgendamento) {

        return itemAgendamentoRepository
                .findByAgendamento_IdAgendamento(idAgendamento);
    }
}
