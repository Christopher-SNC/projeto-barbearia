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

import br.com.projetobarbearia.dto.DisponibilidadeRequest;
import br.com.projetobarbearia.dto.DisponibilidadeResponse;
import br.com.projetobarbearia.entity.Disponibilidade;
import br.com.projetobarbearia.service.DisponibilidadeService;

@RestController
@RequestMapping("/api/disponibilidades")
public class DisponibilidadeController {

    private final DisponibilidadeService disponibilidadeService;

    public DisponibilidadeController(
            DisponibilidadeService disponibilidadeService) {

        this.disponibilidadeService = disponibilidadeService;
    }

    @GetMapping
    public ResponseEntity<List<DisponibilidadeResponse>> listarTodos() {

        List<DisponibilidadeResponse> disponibilidades = disponibilidadeService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(disponibilidades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisponibilidadeResponse> buscarPorId(
            @PathVariable Long id) {

        return disponibilidadeService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DisponibilidadeResponse> cadastrar(
            @RequestBody DisponibilidadeRequest request) {

        Disponibilidade disponibilidade = converterParaEntidade(request);

        Disponibilidade salva = disponibilidadeService.cadastrar(
                request.getIdBarbeiro(),
                disponibilidade);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadeResponse> atualizar(
            @PathVariable Long id,
            @RequestBody DisponibilidadeRequest request) {

        Disponibilidade disponibilidade = converterParaEntidade(request);

        Disponibilidade atualizada = disponibilidadeService.atualizar(
                id,
                request.getIdBarbeiro(),
                disponibilidade);

        return ResponseEntity.ok(
                converterParaResponse(atualizada));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<DisponibilidadeResponse> ativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        disponibilidadeService.ativar(id)));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<DisponibilidadeResponse> desativar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterParaResponse(
                        disponibilidadeService.desativar(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        disponibilidadeService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private Disponibilidade converterParaEntidade(
            DisponibilidadeRequest request) {

        Disponibilidade disponibilidade = new Disponibilidade();

        disponibilidade.setDiaSemana(
                request.getDiaSemana());
        disponibilidade.setHoraInicio(
                request.getHoraInicio());
        disponibilidade.setHoraFim(
                request.getHoraFim());

        return disponibilidade;
    }

    private DisponibilidadeResponse converterParaResponse(
            Disponibilidade disponibilidade) {

        return new DisponibilidadeResponse(
                disponibilidade.getIdDisponibilidade(),
                disponibilidade.getBarbeiro().getIdBarbeiro(),
                disponibilidade.getDiaSemana(),
                disponibilidade.getHoraInicio(),
                disponibilidade.getHoraFim(),
                disponibilidade.isAtivo());
    }
}
