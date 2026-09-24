package br.com.projetobarbearia.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.AgendamentoRequest;
import br.com.projetobarbearia.dto.AgendamentoResponse;
import br.com.projetobarbearia.dto.ItemAgendamentoRequest;
import br.com.projetobarbearia.dto.ItemAgendamentoResponse;
import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ItemAgendamento;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.service.AgendamentoService;
import br.com.projetobarbearia.service.ItemAgendamentoService;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final ItemAgendamentoService itemAgendamentoService;

    public AgendamentoController(
            AgendamentoService agendamentoService,
            ItemAgendamentoService itemAgendamentoService) {

        this.agendamentoService = agendamentoService;
        this.itemAgendamentoService = itemAgendamentoService;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponse>> listarTodos() {

        List<AgendamentoResponse> agendamentos =
                agendamentoService.listarTodos()
                        .stream()
                        .map(this::converterParaResponse)
                        .toList();

        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> buscarPorId(
            @PathVariable Long id) {

        return agendamentoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(
            @RequestBody AgendamentoRequest request) {

        Agendamento agendamento =
                converterParaAgendamento(request);

        List<ItemAgendamento> itens =
                converterParaItens(request.getItens());

        Agendamento salvo =
                agendamentoService.criar(
                        agendamento,
                        itens);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salvo));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponse> cancelar(
            @PathVariable Long id) {

        Agendamento agendamento =
                agendamentoService.cancelar(id);

        return ResponseEntity.ok(
                converterParaResponse(agendamento));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<AgendamentoResponse> concluir(
            @PathVariable Long id) {

        Agendamento agendamento =
                agendamentoService.concluir(id);

        return ResponseEntity.ok(
                converterParaResponse(agendamento));
    }

    @PatchMapping("/{id}/nao-compareceu")
    public ResponseEntity<AgendamentoResponse> marcarNaoCompareceu(
            @PathVariable Long id) {

        Agendamento agendamento =
                agendamentoService.marcarNaoCompareceu(id);

        return ResponseEntity.ok(
                converterParaResponse(agendamento));
    }

    private Agendamento converterParaAgendamento(
            AgendamentoRequest request) {

        Agendamento agendamento = new Agendamento();

        Usuario cliente = new Usuario();
        cliente.setIdUsuario(request.getIdCliente());

        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(
                request.getIdBarbearia());

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setIdBarbeiro(
                request.getIdBarbeiro());

        agendamento.setCliente(cliente);
        agendamento.setBarbearia(barbearia);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setDataHoraInicio(
                request.getDataHoraInicio());

        return agendamento;
    }

    private List<ItemAgendamento> converterParaItens(
            List<ItemAgendamentoRequest> requests) {

        List<ItemAgendamento> itens =
                new ArrayList<>();

        if (requests == null) {
            return itens;
        }

        for (ItemAgendamentoRequest request : requests) {

            ItemAgendamento item =
                    new ItemAgendamento();

            Servico servico = new Servico();
            servico.setIdServico(
                    request.getIdServico());

            item.setServico(servico);

            itens.add(item);
        }

        return itens;
    }

    private AgendamentoResponse converterParaResponse(
            Agendamento agendamento) {

        List<ItemAgendamentoResponse> itens =
                itemAgendamentoService
                        .listarPorAgendamento(
                                agendamento.getIdAgendamento())
                        .stream()
                        .map(this::converterItemParaResponse)
                        .toList();

        return new AgendamentoResponse(
                agendamento.getIdAgendamento(),
                agendamento.getCliente().getIdUsuario(),
                agendamento.getBarbearia().getIdBarbearia(),
                agendamento.getBarbeiro().getIdBarbeiro(),
                agendamento.getDataHoraInicio(),
                agendamento.getStatus(),
                agendamento.getValorTotal(),
                agendamento.getDataCriacao(),
                itens);
    }

    private ItemAgendamentoResponse converterItemParaResponse(
            ItemAgendamento item) {

        return new ItemAgendamentoResponse(
                item.getIdItemAgendamento(),
                item.getServico().getIdServico(),
                item.getServico().getNome(),
                item.getPrecoOriginal(),
                item.getPercentualDesconto(),
                item.getPrecoFinal(),
                item.getDuracaoMinutos());
    }
}