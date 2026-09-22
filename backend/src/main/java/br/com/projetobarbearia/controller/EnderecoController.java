package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.EnderecoRequest;
import br.com.projetobarbearia.dto.EnderecoResponse;
import br.com.projetobarbearia.entity.Endereco;
import br.com.projetobarbearia.service.EnderecoService;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(
            EnderecoService enderecoService) {

        this.enderecoService = enderecoService;
    }

    @GetMapping
    public ResponseEntity<List<EnderecoResponse>> listarTodos() {

        List<EnderecoResponse> enderecos = enderecoService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(enderecos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoResponse> buscarPorId(
            @PathVariable Long id) {

        return enderecoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EnderecoResponse> cadastrar(
            @RequestBody EnderecoRequest request) {

        Endereco endereco = converterParaEntidade(request);

        Endereco salvo = enderecoService.cadastrar(
                request.getIdBarbearia(),
                endereco);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody EnderecoRequest request) {

        Endereco dados = converterParaEntidade(request);

        Endereco atualizado = enderecoService.atualizar(
                id,
                request.getIdBarbearia(),
                dados);

        return ResponseEntity.ok(
                converterParaResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        enderecoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private Endereco converterParaEntidade(
            EnderecoRequest request) {

        Endereco endereco = new Endereco();

        endereco.setLogradouro(request.getLogradouro());
        endereco.setNumero(request.getNumero());
        endereco.setComplemento(request.getComplemento());
        endereco.setBairro(request.getBairro());
        endereco.setCidade(request.getCidade());
        endereco.setEstado(request.getEstado());
        endereco.setCep(request.getCep());
        endereco.setLatitude(request.getLatitude());
        endereco.setLongitude(request.getLongitude());

        return endereco;
    }

    private EnderecoResponse converterParaResponse(
            Endereco endereco) {

        return new EnderecoResponse(
                endereco.getIdEndereco(),
                endereco.getBarbearia().getIdBarbearia(),
                endereco.getLogradouro(),
                endereco.getNumero(),
                endereco.getComplemento(),
                endereco.getBairro(),
                endereco.getCidade(),
                endereco.getEstado(),
                endereco.getCep(),
                endereco.getLatitude(),
                endereco.getLongitude());
    }
}