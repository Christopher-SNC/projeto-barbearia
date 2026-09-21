package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Foto;
import br.com.projetobarbearia.repository.FotoRepository;

@Service
public class FotoService {

    private final FotoRepository fotoRepository;

    public FotoService(FotoRepository fotoRepository) {
        this.fotoRepository = fotoRepository;
    }

    public List<Foto> listarTodas() {
        return fotoRepository.findAll();
    }

    public Optional<Foto> buscarPorId(Long id) {
        return fotoRepository.findById(id);
    }

    public Foto salvar(Foto foto) {
        return fotoRepository.save(foto);
    }

    public Foto ativar(Long id) {

        Foto foto = fotoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Foto não encontrada."));

        foto.setAtiva(true);

        return fotoRepository.save(foto);
    }

    public Foto desativar(Long id) {

        Foto foto = fotoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Foto não encontrada."));

        foto.setAtiva(false);

        return fotoRepository.save(foto);
    }

    public void excluir(Long id) {

        if (!fotoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Foto não encontrada.");
        }

        fotoRepository.deleteById(id);
    }
}
