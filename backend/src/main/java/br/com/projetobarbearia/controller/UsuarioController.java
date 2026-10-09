package br.com.projetobarbearia.controller;

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
import org.springframework.security.core.context.SecurityContextHolder;

import br.com.projetobarbearia.dto.AlterarSenhaRequest;
import br.com.projetobarbearia.dto.UsuarioRequest;
import br.com.projetobarbearia.dto.UsuarioResponse;
import br.com.projetobarbearia.dto.UsuarioUpdateRequest;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.service.AutorizacaoService;
import br.com.projetobarbearia.service.BarbeiroService;
import br.com.projetobarbearia.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

        private final UsuarioService usuarioService;
        private final AutorizacaoService autorizacaoService;
        private final BarbeiroService barbeiroService;

        public UsuarioController(
                        UsuarioService usuarioService,
                        AutorizacaoService autorizacaoService,
                        BarbeiroService barbeiroService) {

                this.usuarioService = usuarioService;
                this.autorizacaoService = autorizacaoService;
                this.barbeiroService = barbeiroService;
        }

        @GetMapping("/{id}")
        public ResponseEntity<UsuarioResponse> buscarPorId(
                        @PathVariable Long id) {

                autorizacaoService.exigirProprioUsuario(id);

                return usuarioService.buscarPorId(id)
                                .map(this::converterParaResponse)
                                .map(ResponseEntity::ok)
                                .orElseGet(() -> ResponseEntity.notFound().build());
        }

        @GetMapping("/barbeiros/{idBarbeiro}")
        public ResponseEntity<UsuarioResponse> buscarUsuarioBarbeiro(
                        @PathVariable Long idBarbeiro) {

                Barbeiro barbeiro =
                                obterBarbeiroGerenciavel(idBarbeiro);

                return ResponseEntity.ok(
                                converterParaResponse(
                                                barbeiro.getUsuario()));
        }

        @PutMapping("/barbeiros/{idBarbeiro}")
        public ResponseEntity<UsuarioResponse> atualizarUsuarioBarbeiro(
                        @PathVariable Long idBarbeiro,
                        @RequestBody UsuarioUpdateRequest request) {

                Barbeiro barbeiro =
                                obterBarbeiroGerenciavel(idBarbeiro);

                Usuario dadosAtualizados = new Usuario();

                dadosAtualizados.setNome(request.getNome());
                dadosAtualizados.setEmail(request.getEmail());
                dadosAtualizados.setTelefone(request.getTelefone());

                Usuario usuarioAtualizado =
                                usuarioService.atualizar(
                                                barbeiro.getUsuario()
                                                                .getIdUsuario(),
                                                dadosAtualizados);

                return ResponseEntity.ok(
                                converterParaResponse(
                                                usuarioAtualizado));
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

                autorizacaoService.exigirProprioUsuario(id);

                Usuario usuario = new Usuario();

                usuario.setNome(request.getNome());
                usuario.setEmail(request.getEmail());
                usuario.setTelefone(request.getTelefone());

                Usuario usuarioAtualizado = usuarioService.atualizar(
                                id,
                                usuario);

                return ResponseEntity.ok(
                                converterParaResponse(usuarioAtualizado));
        }

        @PatchMapping("/{id}/senha")
        public ResponseEntity<Void> alterarSenha(
                        @PathVariable Long id,
                        @RequestBody AlterarSenhaRequest request) {

                autorizacaoService.exigirProprioUsuario(id);

                usuarioService.alterarSenha(
                                id,
                                request.getSenhaAtual(),
                                request.getNovaSenha(),
                                request.getConfirmarNovaSenha());

                return ResponseEntity.noContent().build();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> excluir(
                        @PathVariable Long id,
                        HttpServletRequest request) {

                autorizacaoService.exigirProprioUsuario(id);

                usuarioService.excluir(id);

                SecurityContextHolder.clearContext();

                HttpSession session = request.getSession(false);

                if (session != null) {
                        session.invalidate();
                }

                return ResponseEntity.noContent().build();
        }

        private Barbeiro obterBarbeiroGerenciavel(
                        Long idBarbeiro) {

                Barbeiro barbeiro = barbeiroService
                                .buscarPorId(idBarbeiro)
                                .orElseThrow(() ->
                                                new IllegalArgumentException(
                                                                "Barbeiro não encontrado."));

                autorizacaoService.exigirProprietarioDaBarbearia(
                                barbeiro.getBarbearia()
                                                .getIdBarbearia());

                return barbeiro;
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