package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.ServicoRequest;
import br.com.projetobarbearia.dto.ServicoResponse;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.service.ServicoService;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public ResponseEntity<List<ServicoResponse>> listarTodos() {

        List<ServicoResponse> servicos = servicoService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponse> buscarPorId(
            @PathVariable Long id) {

        return servicoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServicoResponse> cadastrar(
            @RequestBody ServicoRequest request) {

        Servico servico = converterParaEntidade(request);

        Servico salvo = servicoService.cadastrar(
                request.getIdBarbearia(),
                servico);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody ServicoRequest request) {

        Servico dados = converterParaEntidade(request);

        Servico atualizado = servicoService.atualizar(
                id,
                request.getIdBarbearia(),
                dados);

        return ResponseEntity.ok(
                converterParaResponse(atualizado));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<ServicoResponse> ativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        servicoService.ativar(id)));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<ServicoResponse> desativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        servicoService.desativar(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        servicoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private Servico converterParaEntidade(
            ServicoRequest request) {

        Servico servico = new Servico();

        servico.setNome(request.getNome());
        servico.setDescricao(request.getDescricao());
        servico.setPreco(request.getPreco());
        servico.setDuracaoMinutos(
                request.getDuracaoMinutos());

        return servico;
    }

    private ServicoResponse converterParaResponse(
            Servico servico) {

        return new ServicoResponse(
                servico.getIdServico(),
                servico.getBarbearia().getIdBarbearia(),
                servico.getNome(),
                servico.getDescricao(),
                servico.getPreco(),
                servico.getDuracaoMinutos(),
                servico.isAtivo());
    }
}
