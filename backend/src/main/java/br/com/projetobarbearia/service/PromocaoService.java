package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Promocao;
import br.com.projetobarbearia.repository.PromocaoRepository;

@Service
public class PromocaoService {

    private final PromocaoRepository promocaoRepository;

    public PromocaoService(PromocaoRepository promocaoRepository) {
        this.promocaoRepository = promocaoRepository;
    }

    public List<Promocao> listarTodas() {
        return promocaoRepository.findAll();
    }

    public Optional<Promocao> buscarPorId(Long id) {
        return promocaoRepository.findById(id);
    }

    public Promocao salvar(Promocao promocao) {
        return promocaoRepository.save(promocao);
    }

    public Promocao ativar(Long id) {

        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Promoção não encontrada."));

        promocao.setAtiva(true);

        return promocaoRepository.save(promocao);
    }

    public Promocao desativar(Long id) {

        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Promoção não encontrada."));

        promocao.setAtiva(false);

        return promocaoRepository.save(promocao);
    }

    public void excluir(Long id) {

        if (!promocaoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Promoção não encontrada.");
        }

        promocaoRepository.deleteById(id);
    }
}