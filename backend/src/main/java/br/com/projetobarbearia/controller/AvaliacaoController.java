package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.AvaliacaoRequest;
import br.com.projetobarbearia.dto.AvaliacaoResponse;
import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Avaliacao;
import br.com.projetobarbearia.service.AvaliacaoService;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(
            AvaliacaoService avaliacaoService) {

        this.avaliacaoService = avaliacaoService;
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoResponse>> listarTodas() {

        List<AvaliacaoResponse> avaliacoes =
                avaliacaoService.listarTodas()
                        .stream()
                        .map(this::converterParaResponse)
                        .toList();

        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoResponse> buscarPorId(
            @PathVariable Long id) {

        return avaliacaoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AvaliacaoResponse> cadastrar(
            @RequestBody AvaliacaoRequest request) {

        Avaliacao avaliacao =
                converterParaEntidade(request);

        Avaliacao salva =
                avaliacaoService.salvar(avaliacao);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        avaliacaoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private Avaliacao converterParaEntidade(
            AvaliacaoRequest request) {

        Avaliacao avaliacao = new Avaliacao();

        Agendamento agendamento = new Agendamento();
        agendamento.setIdAgendamento(
                request.getIdAgendamento());

        avaliacao.setAgendamento(agendamento);
        avaliacao.setNotaBarbearia(
                request.getNotaBarbearia());
        avaliacao.setNotaBarbeiro(
                request.getNotaBarbeiro());
        avaliacao.setComentario(
                request.getComentario());

        return avaliacao;
    }

    private AvaliacaoResponse converterParaResponse(
            Avaliacao avaliacao) {

        return new AvaliacaoResponse(
                avaliacao.getIdAvaliacao(),
                avaliacao.getAgendamento()
                        .getIdAgendamento(),
                avaliacao.getNotaBarbearia(),
                avaliacao.getNotaBarbeiro(),
                avaliacao.getComentario(),
                avaliacao.getDataAvaliacao());
    }
}