package br.com.projetobarbearia.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Favorito;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.FavoritoRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final BarbeariaRepository barbeariaRepository;
    private final AutorizacaoService autorizacaoService;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UsuarioRepository usuarioRepository,
            BarbeariaRepository barbeariaRepository,
            AutorizacaoService autorizacaoService) {

        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.barbeariaRepository = barbeariaRepository;
        this.autorizacaoService = autorizacaoService;
    }

    @Transactional(readOnly = true)
    public List<Favorito> listarMeusFavoritos() {

        autorizacaoService.exigirPerfilCliente();
        Long idUsuario = autorizacaoService.obterIdUsuarioAutenticado();

        return favoritoRepository.findByUsuario_IdUsuario(idUsuario);
    }

    @Transactional
    public Favorito adicionar(Long idBarbearia) {

        autorizacaoService.exigirPerfilCliente();

        if (idBarbearia == null) {
            throw new IllegalArgumentException(
                    "A barbearia e obrigatoria.");
        }

        Long idUsuario = autorizacaoService.obterIdUsuarioAutenticado();

        var existente =
                favoritoRepository
                        .findByUsuario_IdUsuarioAndBarbearia_IdBarbearia(
                                idUsuario,
                                idBarbearia);

        if (existente.isPresent()) {
            return existente.get();
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuario nao encontrado."));

        Barbearia barbearia = barbeariaRepository.findById(idBarbearia)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia nao encontrada."));

        if (!barbearia.isAtiva()) {
            throw new IllegalArgumentException(
                    "A barbearia nao esta ativa.");
        }

        Favorito favorito = new Favorito();

        favorito.setUsuario(usuario);
        favorito.setBarbearia(barbearia);
        favorito.setDataAdicao(LocalDateTime.now());

        return favoritoRepository.save(favorito);
    }

    @Transactional
    public void remover(Long idFavorito) {

        autorizacaoService.exigirPerfilCliente();
        Long idUsuario = autorizacaoService.obterIdUsuarioAutenticado();

        Favorito favorito = favoritoRepository.findById(idFavorito)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Favorito nao encontrado."));

        if (!idUsuario.equals(
                favorito.getUsuario().getIdUsuario())) {

            throw new AccessDeniedException("Acesso negado.");
        }

        favoritoRepository.delete(favorito);
    }
}
