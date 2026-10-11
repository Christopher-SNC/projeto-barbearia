package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.ResumoAvaliacaoBarbeariaResponse;
import br.com.projetobarbearia.repository.AvaliacaoRepository;

@RestController
@RequestMapping("/api/barbearias/avaliacoes-resumo")
public class AvaliacaoResumoController {

    private final AvaliacaoRepository avaliacaoRepository;

    public AvaliacaoResumoController(
            AvaliacaoRepository avaliacaoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @GetMapping
    public List<ResumoAvaliacaoBarbeariaResponse> listar() {
        return avaliacaoRepository.listarResumoPorBarbearia();
    }
}