package br.com.projetobarbearia.controller;

import java.time.LocalDateTime;
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

import br.com.projetobarbearia.entity.Favorito;
import br.com.projetobarbearia.service.FavoritoService;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    public record FavoritoRequest(Long idBarbearia) {
    }

    public record FavoritoResponse(
            Long idFavorito,
            Long idBarbearia,
            LocalDateTime dataAdicao) {
    }

    @GetMapping
    public ResponseEntity<List<FavoritoResponse>> listar() {

        List<FavoritoResponse> favoritos =
                favoritoService.listarMeusFavoritos()
                        .stream()
                        .map(this::converter)
                        .toList();

        return ResponseEntity.ok(favoritos);
    }

    @PostMapping
    public ResponseEntity<FavoritoResponse> adicionar(
            @RequestBody FavoritoRequest request) {

        Favorito favorito =
                favoritoService.adicionar(request.idBarbearia());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converter(favorito));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {

        favoritoService.remover(id);

        return ResponseEntity.noContent().build();
    }

    private FavoritoResponse converter(Favorito favorito) {

        return new FavoritoResponse(
                favorito.getIdFavorito(),
                favorito.getBarbearia().getIdBarbearia(),
                favorito.getDataAdicao());
    }
}