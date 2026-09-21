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

        Optional<Usuario> usuarioComMesmoEmail =
                usuarioRepository.findByEmail(usuario.getEmail());

        if (usuarioComMesmoEmail.isPresent()) {
            throw new IllegalArgumentException(
                    "E-mail já cadastrado.");
        }

        String senhaHash =
                passwordEncoder.encode(senha);

        usuario.setSenhaHash(senhaHash);
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }

    public Usuario salvar(Usuario usuario) {

        Optional<Usuario> usuarioComMesmoEmail =
                usuarioRepository.findByEmail(usuario.getEmail());

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
}