package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.BarbeiroServicoRequest;
import br.com.projetobarbearia.dto.BarbeiroServicoResponse;
import br.com.projetobarbearia.entity.BarbeiroServico;
import br.com.projetobarbearia.service.BarbeiroServicoService;

@RestController
@RequestMapping("/api/barbeiros-servicos")
public class BarbeiroServicoController {

    private final BarbeiroServicoService barbeiroServicoService;

    public BarbeiroServicoController(
            BarbeiroServicoService barbeiroServicoService) {

        this.barbeiroServicoService = barbeiroServicoService;
    }

    @GetMapping
    public ResponseEntity<List<BarbeiroServicoResponse>> listarTodos() {

        List<BarbeiroServicoResponse> vinculos = barbeiroServicoService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(vinculos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarbeiroServicoResponse> buscarPorId(
            @PathVariable Long id) {

        return barbeiroServicoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BarbeiroServicoResponse> cadastrar(
            @RequestBody BarbeiroServicoRequest request) {

        BarbeiroServico vinculo = barbeiroServicoService.cadastrar(
                request.getIdBarbeiro(),
                request.getIdServico());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(vinculo));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<BarbeiroServicoResponse> ativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        barbeiroServicoService.ativar(id)));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<BarbeiroServicoResponse> desativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        barbeiroServicoService.desativar(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        barbeiroServicoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private BarbeiroServicoResponse converterParaResponse(
            BarbeiroServico vinculo) {

        return new BarbeiroServicoResponse(
                vinculo.getIdBarbeiroServico(),
                vinculo.getBarbeiro().getIdBarbeiro(),
                vinculo.getServico().getIdServico(),
                vinculo.isAtivo());
    }
}