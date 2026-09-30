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

import br.com.projetobarbearia.dto.PromocaoRequest;
import br.com.projetobarbearia.dto.PromocaoResponse;
import br.com.projetobarbearia.entity.Promocao;
import br.com.projetobarbearia.service.PromocaoService;

@RestController
@RequestMapping("/api/promocoes")
public class PromocaoController {

    private final PromocaoService promocaoService;

    public PromocaoController(
            PromocaoService promocaoService) {

        this.promocaoService = promocaoService;
    }

    @GetMapping
    public ResponseEntity<List<PromocaoResponse>> listarTodas() {

        List<PromocaoResponse> promocoes = promocaoService.listarTodas()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(promocoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromocaoResponse> buscarPorId(
            @PathVariable Long id) {

        return promocaoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PromocaoResponse> cadastrar(
            @RequestBody PromocaoRequest request) {

        Promocao promocao = converterParaEntidade(request);

        Promocao salva = promocaoService.cadastrar(
                request.getIdBarbearia(),
                promocao);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromocaoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody PromocaoRequest request) {

        Promocao promocao = converterParaEntidade(request);

        Promocao atualizada = promocaoService.atualizar(
                id,
                request.getIdBarbearia(),
                promocao);

        return ResponseEntity.ok(
                converterParaResponse(atualizada));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<PromocaoResponse> ativar(
            @PathVariable Long id) {

        Promocao promocao = promocaoService.ativar(id);

        return ResponseEntity.ok(
                converterParaResponse(promocao));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<PromocaoResponse> desativar(
            @PathVariable Long id) {

        Promocao promocao = promocaoService.desativar(id);

        return ResponseEntity.ok(
                converterParaResponse(promocao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        promocaoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private Promocao converterParaEntidade(
            PromocaoRequest request) {

        Promocao promocao = new Promocao();

        promocao.setTitulo(
                request.getTitulo());

        promocao.setDescricao(
                request.getDescricao());

        promocao.setPercentualDesconto(
                request.getPercentualDesconto());

        promocao.setDataInicio(
                request.getDataInicio());

        promocao.setDataFim(
                request.getDataFim());

        promocao.setTipo(
                request.getTipo());

        return promocao;
    }

    private PromocaoResponse converterParaResponse(
            Promocao promocao) {

        return new PromocaoResponse(
                promocao.getIdPromocao(),
                promocao.getBarbearia()
                        .getIdBarbearia(),
                promocao.getTitulo(),
                promocao.getDescricao(),
                promocao.getPercentualDesconto(),
                promocao.getDataInicio(),
                promocao.getDataFim(),
                promocao.getTipo(),
                promocao.isAtiva());
    }
}