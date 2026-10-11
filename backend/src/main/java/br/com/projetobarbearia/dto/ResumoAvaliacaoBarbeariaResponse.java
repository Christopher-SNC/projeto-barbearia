package br.com.projetobarbearia.dto;

public record ResumoAvaliacaoBarbeariaResponse(
        Long idBarbearia,
        Double media,
        Long quantidade
) {}