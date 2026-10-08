package br.com.projetobarbearia.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@Service
public class UsuarioService {

        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;
        private final AgendamentoService agendamentoService;
        private final AutorizacaoService autorizacaoService;
        private final BarbeiroRepository barbeiroRepository;
        private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;

        public UsuarioService(
                        UsuarioRepository usuarioRepository,
                        PasswordEncoder passwordEncoder,
                        AgendamentoService agendamentoService,
                        AutorizacaoService autorizacaoService,
                        BarbeiroRepository barbeiroRepository,
                        ProprietarioBarbeariaRepository proprietarioBarbeariaRepository) {

                this.usuarioRepository = usuarioRepository;
                this.passwordEncoder = passwordEncoder;
                this.agendamentoService = agendamentoService;
                this.autorizacaoService = autorizacaoService;
                this.barbeiroRepository = barbeiroRepository;
                this.proprietarioBarbeariaRepository =
                                proprietarioBarbeariaRepository;
        }

        public List<Usuario> listarVisiveis() {

                Long idUsuarioAutenticado =
                                autorizacaoService.obterIdUsuarioAutenticado();

                LinkedHashMap<Long, Usuario> usuariosVisiveis =
                                new LinkedHashMap<>();

                usuarioRepository
                                .findById(idUsuarioAutenticado)
                                .ifPresent(usuario ->
                                                usuariosVisiveis.put(
                                                                usuario.getIdUsuario(),
                                                                usuario));

                agendamentoService
                                .listarTodos()
                                .forEach(agendamento -> {

                                        Usuario cliente =
                                                        agendamento.getCliente();

                                        if (cliente != null) {
                                                usuariosVisiveis.put(
                                                                cliente.getIdUsuario(),
                                                                cliente);
                                        }

                                        if (agendamento.getBarbeiro() != null
                                                        && agendamento.getBarbeiro()
                                                                        .getUsuario() != null) {

                                                Usuario usuarioBarbeiro =
                                                                agendamento.getBarbeiro()
                                                                                .getUsuario();

                                                usuariosVisiveis.put(
                                                                usuarioBarbeiro.getIdUsuario(),
                                                                usuarioBarbeiro);
                                        }
                                });

                List<Long> idsBarbeariasProprietario =
                                proprietarioBarbeariaRepository
                                                .findByUsuario_IdUsuarioAndAtivoTrue(
                                                                idUsuarioAutenticado)
                                                .stream()
                                                .map(vinculo ->
                                                                vinculo.getBarbearia()
                                                                                .getIdBarbearia())
                                                .distinct()
                                                .toList();

                if (!idsBarbeariasProprietario.isEmpty()) {

                        barbeiroRepository
                                        .findByBarbearia_IdBarbeariaIn(
                                                        idsBarbeariasProprietario)
                                        .forEach(barbeiro -> {

                                                Usuario usuarioBarbeiro =
                                                                barbeiro.getUsuario();

                                                usuariosVisiveis.put(
                                                                usuarioBarbeiro.getIdUsuario(),
                                                                usuarioBarbeiro);
                                        });
                }

                return List.copyOf(
                                usuariosVisiveis.values());
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