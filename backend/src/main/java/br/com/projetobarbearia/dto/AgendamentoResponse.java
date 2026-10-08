package br.com.projetobarbearia.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.com.projetobarbearia.enums.StatusAgendamento;

public class AgendamentoResponse {

    private Long idAgendamento;
    private Long idCliente;
    private String nomeCliente;
    private Long idBarbearia;
    private Long idBarbeiro;
    private String nomeBarbeiro;
    private LocalDateTime dataHoraInicio;
    private StatusAgendamento status;
    private BigDecimal valorTotal;
    private LocalDateTime dataCriacao;
    private List<ItemAgendamentoResponse> itens;

    public AgendamentoResponse() {
    }

    public AgendamentoResponse(
            Long idAgendamento,
            Long idCliente,
            String nomeCliente,
            Long idBarbearia,
            Long idBarbeiro,
            String nomeBarbeiro,
            LocalDateTime dataHoraInicio,
            StatusAgendamento status,
            BigDecimal valorTotal,
            LocalDateTime dataCriacao,
            List<ItemAgendamentoResponse> itens) {

        this.idAgendamento = idAgendamento;
        this.idCliente = idCliente;
        this.nomeCliente = nomeCliente;
        this.idBarbearia = idBarbearia;
        this.idBarbeiro = idBarbeiro;
        this.nomeBarbeiro = nomeBarbeiro;
        this.dataHoraInicio = dataHoraInicio;
        this.status = status;
        this.valorTotal = valorTotal;
        this.dataCriacao = dataCriacao;
        this.itens = itens;
    }

    public Long getIdAgendamento() {
        return idAgendamento;
    }

    public void setIdAgendamento(Long idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public Long getIdBarbeiro() {
        return idBarbeiro;
    }

    public void setIdBarbeiro(Long idBarbeiro) {
        this.idBarbeiro = idBarbeiro;
    }

    public String getNomeBarbeiro() {
        return nomeBarbeiro;
    }

    public void setNomeBarbeiro(String nomeBarbeiro) {
        this.nomeBarbeiro = nomeBarbeiro;
    }

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public void setStatus(StatusAgendamento status) {
        this.status = status;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public List<ItemAgendamentoResponse> getItens() {
        return itens;
    }

    public void setItens(List<ItemAgendamentoResponse> itens) {
        this.itens = itens;
    }
}