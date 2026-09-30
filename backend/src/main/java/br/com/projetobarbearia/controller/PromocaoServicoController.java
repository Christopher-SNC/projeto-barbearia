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

import br.com.projetobarbearia.dto.PromocaoServicoRequest;
import br.com.projetobarbearia.dto.PromocaoServicoResponse;
import br.com.projetobarbearia.entity.PromocaoServico;
import br.com.projetobarbearia.service.PromocaoServicoService;

@RestController
@RequestMapping("/api/promocoes-servicos")
public class PromocaoServicoController {

    private final PromocaoServicoService promocaoServicoService;

    public PromocaoServicoController(
            PromocaoServicoService promocaoServicoService) {

        this.promocaoServicoService = promocaoServicoService;
    }

    @GetMapping
    public ResponseEntity<List<PromocaoServicoResponse>> listarTodos() {

        List<PromocaoServicoResponse> vinculos = promocaoServicoService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(vinculos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromocaoServicoResponse> buscarPorId(
            @PathVariable Long id) {

        return promocaoServicoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/promocao/{idPromocao}")
    public ResponseEntity<List<PromocaoServicoResponse>> listarPorPromocao(
            @PathVariable Long idPromocao) {

        List<PromocaoServicoResponse> vinculos = promocaoServicoService
                .listarPorPromocao(idPromocao)
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(vinculos);
    }

    @PostMapping
    public ResponseEntity<PromocaoServicoResponse> cadastrar(
            @RequestBody PromocaoServicoRequest request) {

        PromocaoServico vinculo = promocaoServicoService.cadastrar(
                request.getIdPromocao(),
                request.getIdServico());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(vinculo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        promocaoServicoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private PromocaoServicoResponse converterParaResponse(
            PromocaoServico vinculo) {

        return new PromocaoServicoResponse(
                vinculo.getIdPromocaoServico(),
                vinculo.getPromocao()
                        .getIdPromocao(),
                vinculo.getServico()
                        .getIdServico());
    }
}