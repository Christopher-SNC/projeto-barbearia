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

import br.com.projetobarbearia.dto.ProprietarioBarbeariaRequest;
import br.com.projetobarbearia.dto.ProprietarioBarbeariaResponse;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.service.ProprietarioBarbeariaService;

@RestController
@RequestMapping("/api/proprietarios-barbearias")
public class ProprietarioBarbeariaController {

    private final ProprietarioBarbeariaService proprietarioService;

    public ProprietarioBarbeariaController(
            ProprietarioBarbeariaService proprietarioService) {

        this.proprietarioService = proprietarioService;
    }

    @GetMapping
    public ResponseEntity<List<ProprietarioBarbeariaResponse>> listarTodos() {

        List<ProprietarioBarbeariaResponse> proprietarios = proprietarioService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(proprietarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProprietarioBarbeariaResponse> buscarPorId(
            @PathVariable Long id) {

        return proprietarioService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProprietarioBarbeariaResponse> cadastrar(
            @RequestBody ProprietarioBarbeariaRequest request) {

        ProprietarioBarbearia proprietario = proprietarioService.cadastrar(
                request.getIdUsuario(),
                request.getIdBarbearia(),
                request.getDataVinculo());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(proprietario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProprietarioBarbeariaResponse> atualizar(
            @PathVariable Long id,
            @RequestBody ProprietarioBarbeariaRequest request) {

        ProprietarioBarbearia proprietario = proprietarioService.atualizar(
                id,
                request.getIdUsuario(),
                request.getIdBarbearia(),
                request.getDataVinculo());

        return ResponseEntity.ok(
                converterParaResponse(proprietario));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<ProprietarioBarbeariaResponse> ativar(
            @PathVariable Long id) {

        ProprietarioBarbearia proprietario = proprietarioService.ativar(id);

        return ResponseEntity.ok(
                converterParaResponse(proprietario));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<ProprietarioBarbeariaResponse> desativar(
            @PathVariable Long id) {

        ProprietarioBarbearia proprietario = proprietarioService.desativar(id);

        return ResponseEntity.ok(
                converterParaResponse(proprietario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        proprietarioService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private ProprietarioBarbeariaResponse converterParaResponse(
            ProprietarioBarbearia proprietario) {

        return new ProprietarioBarbeariaResponse(
                proprietario.getIdProprietarioBarbearia(),
                proprietario.getUsuario().getIdUsuario(),
                proprietario.getBarbearia().getIdBarbearia(),
                proprietario.getDataVinculo(),
                proprietario.isAtivo());
    }
}