package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Foto;
import br.com.projetobarbearia.repository.FotoRepository;

@Service
public class FotoService {

    private final FotoRepository fotoRepository;
    private final BarbeariaService barbeariaService;
    private final AutorizacaoService autorizacaoService;

    public FotoService(
            FotoRepository fotoRepository,
            BarbeariaService barbeariaService,
            AutorizacaoService autorizacaoService) {

        this.fotoRepository = fotoRepository;
        this.barbeariaService = barbeariaService;
        this.autorizacaoService = autorizacaoService;
    }

    public List<Foto> listarTodas() {
        return fotoRepository.findAll();
    }

    public Optional<Foto> buscarPorId(Long id) {
        return fotoRepository.findById(id);
    }

    public Foto cadastrar(
            Long idBarbearia,
            Foto foto) {

        autorizacaoService.exigirProprietarioDaBarbearia(idBarbearia);

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia não encontrada."));

        validar(foto);

        foto.setBarbearia(barbearia);
        foto.setAtiva(true);

        return fotoRepository.save(foto);
    }

    public Foto atualizar(
            Long id,
            Long idBarbearia,
            Foto novosDados) {

        Foto foto = fotoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Foto não encontrada."));

        Long idBarbeariaAtual =
                foto.getBarbearia().getIdBarbearia();

        autorizacaoService.exigirProprietarioDaBarbearia(idBarbeariaAtual);
        autorizacaoService.exigirProprietarioDaBarbearia(idBarbearia);

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia não encontrada."));

        validar(novosDados);

        if (!idBarbeariaAtual.equals(barbearia.getIdBarbearia())) {
            throw new IllegalArgumentException(
                    "Não é permitido alterar a barbearia da foto.");
        }

        foto.setUrl(novosDados.getUrl());
        foto.setLegenda(novosDados.getLegenda());
        foto.setOrdem(novosDados.getOrdem());

        return fotoRepository.save(foto);
    }

    public Foto ativar(Long id) {

        Foto foto = fotoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Foto não encontrada."));

        autorizacaoService.exigirProprietarioDaBarbearia(
                foto.getBarbearia().getIdBarbearia());

        foto.setAtiva(true);

        return fotoRepository.save(foto);
    }

    public Foto desativar(Long id) {

        Foto foto = fotoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Foto não encontrada."));

        autorizacaoService.exigirProprietarioDaBarbearia(
                foto.getBarbearia().getIdBarbearia());

        foto.setAtiva(false);

        return fotoRepository.save(foto);
    }

    public void excluir(Long id) {

        Foto foto = fotoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Foto não encontrada."));

        autorizacaoService.exigirProprietarioDaBarbearia(
                foto.getBarbearia().getIdBarbearia());

        fotoRepository.delete(foto);
    }

    private void validar(Foto foto) {

        if (foto.getUrl() == null
                || foto.getUrl().isBlank()) {
            throw new IllegalArgumentException(
                    "A URL da foto é obrigatória.");
        }

        if (foto.getOrdem() < 0) {
            throw new IllegalArgumentException(
                    "A ordem da foto não pode ser negativa.");
        }
    }
}