package br.com.projetobarbearia.dto;

import java.math.BigDecimal;

public class ServicoResponse {

    private Long idServico;
    private Long idBarbearia;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private int duracaoMinutos;
    private boolean ativo;

    public ServicoResponse() {
    }

    public ServicoResponse(
            Long idServico,
            Long idBarbearia,
            String nome,
            String descricao,
            BigDecimal preco,
            int duracaoMinutos,
            boolean ativo) {

        this.idServico = idServico;
        this.idBarbearia = idBarbearia;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracaoMinutos = duracaoMinutos;
        this.ativo = ativo;
    }

    public Long getIdServico() {
        return idServico;
    }

    public void setIdServico(Long idServico) {
        this.idServico = idServico;
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(int duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}