package br.com.projetobarbearia.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.com.projetobarbearia.enums.TipoPromocao;

public class PromocaoRequest {

    private Long idBarbearia;
    private String titulo;
    private String descricao;
    private BigDecimal percentualDesconto;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private TipoPromocao tipo;

    public PromocaoRequest() {
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPercentualDesconto() {
        return percentualDesconto;
    }

    public void setPercentualDesconto(
            BigDecimal percentualDesconto) {

        this.percentualDesconto = percentualDesconto;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public TipoPromocao getTipo() {
        return tipo;
    }

    public void setTipo(TipoPromocao tipo) {
        this.tipo = tipo;
    }
}