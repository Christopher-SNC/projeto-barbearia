package br.com.projetobarbearia.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import br.com.projetobarbearia.entity.Usuario;

import br.com.projetobarbearia.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarTodos() {
    return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario salvar(Usuario usuario) {

        Optional<Usuario> usuarioComMesmoEmail =
                usuarioRepository.findByEmail(usuario.getEmail());

        if (usuarioComMesmoEmail.isPresent()
                && !usuarioComMesmoEmail.get().getIdUsuario().equals(usuario.getIdUsuario())) {

            throw new IllegalArgumentException("E-mail já cadastrado.");
    }

    return usuarioRepository.save(usuario);
    }

    public void excluir(Long id) {

        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }

        usuarioRepository.deleteById(id);
    }
}
