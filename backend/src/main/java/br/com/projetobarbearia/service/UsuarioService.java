package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.UsuarioRepository;

@Service
public class UsuarioService {

        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;

        public UsuarioService(
                        UsuarioRepository usuarioRepository,
                        PasswordEncoder passwordEncoder) {

                this.usuarioRepository = usuarioRepository;
                this.passwordEncoder = passwordEncoder;
        }

        public List<Usuario> listarTodos() {
                return usuarioRepository.findAll();
        }

        public Optional<Usuario> buscarPorId(Long id) {
                return usuarioRepository.findById(id);
        }

        public Usuario cadastrar(
                        Usuario usuario,
                        String senha) {

                if (senha == null || senha.isBlank()) {
                        throw new IllegalArgumentException(
                                        "A senha é obrigatória.");
                }

                Optional<Usuario> usuarioComMesmoEmail = usuarioRepository.findByEmail(usuario.getEmail());

                if (usuarioComMesmoEmail.isPresent()) {
                        throw new IllegalArgumentException(
                                        "E-mail já cadastrado.");
                }

                String senhaHash = passwordEncoder.encode(senha);

                usuario.setSenhaHash(senhaHash);
                usuario.setAtivo(true);

                return usuarioRepository.save(usuario);
        }

        public Usuario salvar(Usuario usuario) {

                Optional<Usuario> usuarioComMesmoEmail = usuarioRepository.findByEmail(usuario.getEmail());

                if (usuarioComMesmoEmail.isPresent()
                                && !usuarioComMesmoEmail.get()
                                                .getIdUsuario()
                                                .equals(usuario.getIdUsuario())) {

                        throw new IllegalArgumentException(
                                        "E-mail já cadastrado.");
                }

                return usuarioRepository.save(usuario);
        }

        public void excluir(Long id) {

                if (!usuarioRepository.existsById(id)) {
                        throw new IllegalArgumentException(
                                        "Usuário não encontrado.");
                }

                usuarioRepository.deleteById(id);
        }

        public Usuario atualizar(
                        Long id,
                        Usuario dadosAtualizados) {

                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Usuário não encontrado."));

                Optional<Usuario> usuarioComMesmoEmail = usuarioRepository.findByEmail(
                                dadosAtualizados.getEmail());

                if (usuarioComMesmoEmail.isPresent()
                                && !usuarioComMesmoEmail.get()
                                                .getIdUsuario()
                                                .equals(id)) {

                        throw new IllegalArgumentException(
                                        "E-mail já cadastrado.");
                }

                usuario.setNome(dadosAtualizados.getNome());
                usuario.setEmail(dadosAtualizados.getEmail());
                usuario.setTelefone(dadosAtualizados.getTelefone());

                return usuarioRepository.save(usuario);
        }

        public void alterarSenha(
                        Long id,
                        String senhaAtual,
                        String novaSenha,
                        String confirmarNovaSenha) {

                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Usuário não encontrado."));

                if (senhaAtual == null
                                || senhaAtual.isBlank()) {

                        throw new IllegalArgumentException(
                                        "Informe a senha atual.");
                }

                if (novaSenha == null
                                || novaSenha.isBlank()) {

                        throw new IllegalArgumentException(
                                        "Informe a nova senha.");
                }

                if (confirmarNovaSenha == null
                                || confirmarNovaSenha.isBlank()) {

                        throw new IllegalArgumentException(
                                        "Confirme a nova senha.");
                }

                if (!passwordEncoder.matches(
                                senhaAtual,
                                usuario.getSenhaHash())) {

                        throw new IllegalArgumentException(
                                        "Senha atual incorreta.");
                }

                if (!novaSenha.equals(
                                confirmarNovaSenha)) {

                        throw new IllegalArgumentException(
                                        "A confirmação da nova senha não confere.");
                }

                usuario.setSenhaHash(
                                passwordEncoder.encode(novaSenha));

                usuarioRepository.save(usuario);
        }
}