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

import br.com.projetobarbearia.dto.FotoRequest;
import br.com.projetobarbearia.dto.FotoResponse;
import br.com.projetobarbearia.entity.Foto;
import br.com.projetobarbearia.service.FotoService;

@RestController
@RequestMapping("/api/fotos")
public class FotoController {

    private final FotoService fotoService;

    public FotoController(
            FotoService fotoService) {

        this.fotoService = fotoService;
    }

    @GetMapping
    public ResponseEntity<List<FotoResponse>> listarTodas() {

        List<FotoResponse> fotos = fotoService.listarTodas()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(fotos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FotoResponse> buscarPorId(
            @PathVariable Long id) {

        return fotoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FotoResponse> cadastrar(
            @RequestBody FotoRequest request) {

        Foto foto = converterParaEntidade(request);

        Foto salva = fotoService.cadastrar(
                request.getIdBarbearia(),
                foto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FotoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody FotoRequest request) {

        Foto foto = converterParaEntidade(request);

        Foto atualizada = fotoService.atualizar(
                id,
                request.getIdBarbearia(),
                foto);

        return ResponseEntity.ok(
                converterParaResponse(atualizada));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<FotoResponse> ativar(
            @PathVariable Long id) {

        Foto foto = fotoService.ativar(id);

        return ResponseEntity.ok(
                converterParaResponse(foto));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<FotoResponse> desativar(
            @PathVariable Long id) {

        Foto foto = fotoService.desativar(id);

        return ResponseEntity.ok(
                converterParaResponse(foto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        fotoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private Foto converterParaEntidade(
            FotoRequest request) {

        Foto foto = new Foto();

        foto.setUrl(request.getUrl());
        foto.setLegenda(request.getLegenda());
        foto.setOrdem(request.getOrdem());

        return foto;
    }

    private FotoResponse converterParaResponse(
            Foto foto) {

        return new FotoResponse(
                foto.getIdFoto(),
                foto.getBarbearia()
                        .getIdBarbearia(),
                foto.getUrl(),
                foto.getLegenda(),
                foto.getOrdem(),
                foto.isAtiva());
    }
}