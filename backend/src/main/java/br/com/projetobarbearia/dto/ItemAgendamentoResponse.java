package br.com.projetobarbearia.dto;

import java.math.BigDecimal;

public class ItemAgendamentoResponse {

    private Long idItemAgendamento;
    private Long idServico;
    private String nomeServico;
    private BigDecimal precoOriginal;
    private BigDecimal percentualDesconto;
    private BigDecimal precoFinal;
    private int duracaoMinutos;

    public ItemAgendamentoResponse() {
    }

    public ItemAgendamentoResponse(
            Long idItemAgendamento,
            Long idServico,
            String nomeServico,
            BigDecimal precoOriginal,
            BigDecimal percentualDesconto,
            BigDecimal precoFinal,
            int duracaoMinutos) {

        this.idItemAgendamento = idItemAgendamento;
        this.idServico = idServico;
        this.nomeServico = nomeServico;
        this.precoOriginal = precoOriginal;
        this.percentualDesconto = percentualDesconto;
        this.precoFinal = precoFinal;
        this.duracaoMinutos = duracaoMinutos;
    }

    public Long getIdItemAgendamento() {
        return idItemAgendamento;
    }

    public void setIdItemAgendamento(Long idItemAgendamento) {
        this.idItemAgendamento = idItemAgendamento;
    }

    public Long getIdServico() {
        return idServico;
    }

    public void setIdServico(Long idServico) {
        this.idServico = idServico;
    }

    public String getNomeServico() {
        return nomeServico;
    }

    public void setNomeServico(String nomeServico) {
        this.nomeServico = nomeServico;
    }

    public BigDecimal getPrecoOriginal() {
        return precoOriginal;
    }

    public void setPrecoOriginal(BigDecimal precoOriginal) {
        this.precoOriginal = precoOriginal;
    }

    public BigDecimal getPercentualDesconto() {
        return percentualDesconto;
    }

    public void setPercentualDesconto(BigDecimal percentualDesconto) {
        this.percentualDesconto = percentualDesconto;
    }

    public BigDecimal getPrecoFinal() {
        return precoFinal;
    }

    public void setPrecoFinal(BigDecimal precoFinal) {
        this.precoFinal = precoFinal;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(int duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }
}