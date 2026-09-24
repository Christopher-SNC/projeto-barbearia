package br.com.projetobarbearia.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.com.projetobarbearia.enums.StatusAgendamento;

public class AgendamentoResponse {

    private Long idAgendamento;
    private Long idCliente;
    private Long idBarbearia;
    private Long idBarbeiro;
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
            Long idBarbearia,
            Long idBarbeiro,
            LocalDateTime dataHoraInicio,
            StatusAgendamento status,
            BigDecimal valorTotal,
            LocalDateTime dataCriacao,
            List<ItemAgendamentoResponse> itens) {

        this.idAgendamento = idAgendamento;
        this.idCliente = idCliente;
        this.idBarbearia = idBarbearia;
        this.idBarbeiro = idBarbeiro;
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