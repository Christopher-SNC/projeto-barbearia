package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Favorito;
import br.com.projetobarbearia.repository.FavoritoRepository;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;

    public FavoritoService(FavoritoRepository favoritoRepository) {
        this.favoritoRepository = favoritoRepository;
    }

    public List<Favorito> listarTodos() {
        return favoritoRepository.findAll();
    }

    public Optional<Favorito> buscarPorId(Long id) {
        return favoritoRepository.findById(id);
    }

    public Favorito salvar(Favorito favorito) {
        return favoritoRepository.save(favorito);
    }

    public void excluir(Long id) {

        if (!favoritoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Favorito não encontrado.");
        }

        favoritoRepository.deleteById(id);
    }
}
