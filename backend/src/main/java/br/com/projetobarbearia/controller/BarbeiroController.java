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

import br.com.projetobarbearia.dto.BarbeiroRequest;
import br.com.projetobarbearia.dto.BarbeiroResponse;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.service.BarbeiroService;

@RestController
@RequestMapping("/api/barbeiros")
public class BarbeiroController {

    private final BarbeiroService barbeiroService;

    public BarbeiroController(
            BarbeiroService barbeiroService) {

        this.barbeiroService = barbeiroService;
    }

    @GetMapping
    public ResponseEntity<List<BarbeiroResponse>> listarTodos() {

        List<BarbeiroResponse> barbeiros =
                barbeiroService.listarTodos()
                        .stream()
                        .map(this::converterParaResponse)
                        .toList();

        return ResponseEntity.ok(barbeiros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarbeiroResponse> buscarPorId(
            @PathVariable Long id) {

        return barbeiroService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BarbeiroResponse> cadastrar(
            @RequestBody BarbeiroRequest request) {

        Barbeiro barbeiro = barbeiroService.cadastrar(
                request.getIdUsuario(),
                request.getIdBarbearia(),
                request.getDescricao());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(barbeiro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarbeiroResponse> atualizar(
            @PathVariable Long id,
            @RequestBody BarbeiroRequest request) {

        Barbeiro barbeiro = barbeiroService.atualizar(
                id,
                request.getIdUsuario(),
                request.getIdBarbearia(),
                request.getDescricao());

        return ResponseEntity.ok(
                converterParaResponse(barbeiro));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<BarbeiroResponse> ativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        barbeiroService.ativar(id)));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<BarbeiroResponse> desativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        barbeiroService.desativar(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        barbeiroService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private BarbeiroResponse converterParaResponse(
            Barbeiro barbeiro) {

        return new BarbeiroResponse(
                barbeiro.getIdBarbeiro(),
                barbeiro.getUsuario().getIdUsuario(),
                barbeiro.getBarbearia().getIdBarbearia(),
                barbeiro.getDescricao(),
                barbeiro.isAtivo());
    }
}