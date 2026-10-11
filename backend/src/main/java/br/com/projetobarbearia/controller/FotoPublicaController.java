package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.FotoResponse;
import br.com.projetobarbearia.entity.Foto;
import br.com.projetobarbearia.repository.FotoRepository;

@RestController
@RequestMapping("/api/barbearias")
public class FotoPublicaController {

    private final FotoRepository fotoRepository;

    public FotoPublicaController(FotoRepository fotoRepository) {
        this.fotoRepository = fotoRepository;
    }

    @GetMapping("/fotos-publicas")
    public ResponseEntity<List<FotoResponse>> listarPublicas() {
        List<FotoResponse> fotos = fotoRepository
                .listarPublicasOrdenadas()
                .stream()
                .map(this::converter)
                .toList();

        return ResponseEntity.ok(fotos);
    }

    private FotoResponse converter(Foto foto) {
        return new FotoResponse(
                foto.getIdFoto(),
                foto.getBarbearia().getIdBarbearia(),
                foto.getUrl(),
                foto.getLegenda(),
                foto.getOrdem(),
                foto.isAtiva());
    }
}