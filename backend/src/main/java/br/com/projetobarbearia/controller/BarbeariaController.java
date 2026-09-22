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

import br.com.projetobarbearia.dto.BarbeariaRequest;
import br.com.projetobarbearia.dto.BarbeariaResponse;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.service.BarbeariaService;

@RestController
@RequestMapping("/api/barbearias")
public class BarbeariaController {

    private final BarbeariaService barbeariaService;

    public BarbeariaController(
            BarbeariaService barbeariaService) {

        this.barbeariaService = barbeariaService;
    }

    @GetMapping
    public ResponseEntity<List<BarbeariaResponse>> listarTodas() {

        List<BarbeariaResponse> barbearias =
                barbeariaService.listarTodas()
                        .stream()
                        .map(this::converterParaResponse)
                        .toList();

        return ResponseEntity.ok(barbearias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarbeariaResponse> buscarPorId(
            @PathVariable Long id) {

        return barbeariaService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BarbeariaResponse> cadastrar(
            @RequestBody BarbeariaRequest request) {

        Barbearia barbearia = new Barbearia();

        barbearia.setNome(request.getNome());
        barbearia.setCnpj(request.getCnpj());
        barbearia.setDescricao(request.getDescricao());
        barbearia.setTelefone(request.getTelefone());

        Barbearia barbeariaSalva =
                barbeariaService.salvar(barbearia);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(barbeariaSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarbeariaResponse> atualizar(
            @PathVariable Long id,
            @RequestBody BarbeariaRequest request) {

        Barbearia barbearia = barbeariaService
                .buscarPorId(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        barbearia.setNome(request.getNome());
        barbearia.setCnpj(request.getCnpj());
        barbearia.setDescricao(request.getDescricao());
        barbearia.setTelefone(request.getTelefone());

        Barbearia atualizada =
                barbeariaService.salvar(barbearia);

        return ResponseEntity.ok(
                converterParaResponse(atualizada));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<BarbeariaResponse> ativar(
            @PathVariable Long id) {

        Barbearia barbearia =
                barbeariaService.ativar(id);

        return ResponseEntity.ok(
                converterParaResponse(barbearia));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<BarbeariaResponse> desativar(
            @PathVariable Long id) {

        Barbearia barbearia =
                barbeariaService.desativar(id);

        return ResponseEntity.ok(
                converterParaResponse(barbearia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        barbeariaService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private BarbeariaResponse converterParaResponse(
            Barbearia barbearia) {

        return new BarbeariaResponse(
                barbearia.getIdBarbearia(),
                barbearia.getNome(),
                barbearia.getCnpj(),
                barbearia.getDescricao(),
                barbearia.getTelefone(),
                barbearia.isAtiva());
    }
}
