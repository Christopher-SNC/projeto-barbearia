package br.com.projetobarbearia.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import br.com.projetobarbearia.dto.LoginResponse;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@Service
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final UsuarioRepository usuarioRepository;
        private final BarbeiroRepository barbeiroRepository;
        private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;

        public AuthService(
                        AuthenticationManager authenticationManager,
                        UsuarioRepository usuarioRepository,
                        BarbeiroRepository barbeiroRepository,
                        ProprietarioBarbeariaRepository proprietarioBarbeariaRepository) {

                this.authenticationManager = authenticationManager;
                this.usuarioRepository = usuarioRepository;
                this.barbeiroRepository = barbeiroRepository;
                this.proprietarioBarbeariaRepository = proprietarioBarbeariaRepository;
        }

        public Authentication autenticar(
                        String email,
                        String senha) {

                Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(
                                email,
                                senha);

                return authenticationManager.authenticate(
                                authenticationRequest);
        }

        public LoginResponse buscarDadosUsuarioAutenticado(
                        Long idUsuario) {

                Usuario usuario = usuarioRepository.findById(idUsuario)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Usuário não encontrado."));

                List<String> perfis = new ArrayList<>();

                Long idBarbeiro = null;
                Long idBarbeariaBarbeiro = null;

                Barbeiro barbeiro = barbeiroRepository
                                .findByUsuario_IdUsuarioAndAtivoTrue(
                                                usuario.getIdUsuario())
                                .orElse(null);

                if (barbeiro != null) {
                        perfis.add("BARBEIRO");

                        idBarbeiro = barbeiro.getIdBarbeiro();

                        idBarbeariaBarbeiro = barbeiro
                                        .getBarbearia()
                                        .getIdBarbearia();
                }

                List<ProprietarioBarbearia> vinculosProprietario = proprietarioBarbeariaRepository
                                .findByUsuario_IdUsuarioAndAtivoTrue(
                                                usuario.getIdUsuario());

                List<Long> idsBarbeariasProprietario = vinculosProprietario.stream()
                                .map(vinculo -> vinculo
                                                .getBarbearia()
                                                .getIdBarbearia())
                                .toList();

                if (!idsBarbeariasProprietario.isEmpty()) {
                        perfis.add("PROPRIETARIO");
                }

                // Barbeiro funcionario possui apenas o perfil BARBEIRO.
                // Proprietario que tambem atua como barbeiro mantem os tres perfis.
                if (barbeiro == null || !idsBarbeariasProprietario.isEmpty()) {
                        perfis.add(0, "CLIENTE");
                }

                return new LoginResponse(
                                usuario.getIdUsuario(),
                                usuario.getNome(),
                                usuario.getEmail(),
                                perfis,
                                idBarbeiro,
                                idBarbeariaBarbeiro,
                                idsBarbeariasProprietario);
        }
}
