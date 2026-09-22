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

import br.com.projetobarbearia.dto.UsuarioRequest;
import br.com.projetobarbearia.dto.UsuarioResponse;
import br.com.projetobarbearia.dto.UsuarioUpdateRequest;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {

        List<UsuarioResponse> usuarios = usuarioService
                .listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(
            @PathVariable Long id) {

        return usuarioService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrar(
            @RequestBody UsuarioRequest request) {

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());

        Usuario usuarioSalvo = usuarioService.cadastrar(
                usuario,
                request.getSenha());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(usuarioSalvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
            @PathVariable Long id,
            @RequestBody UsuarioUpdateRequest request) {

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());

        Usuario usuarioAtualizado =
                usuarioService.atualizar(id, usuario);

        return ResponseEntity.ok(
                converterParaResponse(usuarioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        usuarioService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private UsuarioResponse converterParaResponse(
            Usuario usuario) {

        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.isAtivo());
    }
}