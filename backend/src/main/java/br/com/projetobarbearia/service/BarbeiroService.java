package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeiroRepository;

@Service
public class BarbeiroService {

        private final BarbeiroRepository barbeiroRepository;
        private final UsuarioService usuarioService;
        private final BarbeariaService barbeariaService;

        public BarbeiroService(
                        BarbeiroRepository barbeiroRepository,
                        UsuarioService usuarioService,
                        BarbeariaService barbeariaService) {

                this.barbeiroRepository = barbeiroRepository;
                this.usuarioService = usuarioService;
                this.barbeariaService = barbeariaService;
        }

        public List<Barbeiro> listarTodos() {
                return barbeiroRepository.findAll();
        }

        public Optional<Barbeiro> buscarPorId(Long id) {
                return barbeiroRepository.findById(id);
        }

        public Barbeiro cadastrar(
                        Long idUsuario,
                        Long idBarbearia,
                        String descricao) {

                Usuario usuario = usuarioService.buscarPorId(idUsuario)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Usuário não encontrado."));

                if (!usuario.isAtivo()) {
                        throw new IllegalArgumentException(
                                        "O usuário precisa estar ativo.");
                }

                Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbearia não encontrada."));

                Barbeiro barbeiro = new Barbeiro();
                barbeiro.setUsuario(usuario);
                barbeiro.setBarbearia(barbearia);
                barbeiro.setDescricao(descricao);
                barbeiro.setAtivo(true);

                return barbeiroRepository.save(barbeiro);
        }

        public Barbeiro atualizar(
                        Long id,
                        Long idUsuario,
                        Long idBarbearia,
                        String descricao) {

                Barbeiro barbeiro = barbeiroRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbeiro não encontrado."));

                Usuario usuario = usuarioService.buscarPorId(idUsuario)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Usuário não encontrado."));

                if (!usuario.isAtivo()) {
                        throw new IllegalArgumentException(
                                        "O usuário precisa estar ativo.");
                }

                Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbearia não encontrada."));

                Long idBarbeariaAnterior = barbeiro.getBarbearia().getIdBarbearia();

                barbeiro.setUsuario(usuario);
                barbeiro.setBarbearia(barbearia);
                barbeiro.setDescricao(descricao);

                Barbeiro salvo = barbeiroRepository.save(barbeiro);

                if (!idBarbeariaAnterior.equals(idBarbearia)) {
                        barbeariaService.desativarSeInvalida(
                                        idBarbeariaAnterior);
                }

                return salvo;
        }

        public Barbeiro ativar(Long id) {

                Barbeiro barbeiro = barbeiroRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbeiro não encontrado."));

                barbeiro.setAtivo(true);

                return barbeiroRepository.save(barbeiro);
        }

        public Barbeiro desativar(Long id) {

                Barbeiro barbeiro = barbeiroRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbeiro não encontrado."));

                barbeiro.setAtivo(false);

                Barbeiro salvo = barbeiroRepository.save(barbeiro);

                barbeariaService.desativarSeInvalida(
                                barbeiro.getBarbearia().getIdBarbearia());

                return salvo;
        }

        @Transactional
        public void excluir(Long id) {

                Barbeiro barbeiro = barbeiroRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbeiro não encontrado."));

                Long idBarbearia = barbeiro.getBarbearia().getIdBarbearia();

                barbeiroRepository.delete(barbeiro);
                barbeiroRepository.flush();

                barbeariaService.desativarSeInvalida(idBarbearia);
        }
}