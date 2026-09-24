package br.com.projetobarbearia.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AgendamentoRequest {

    private Long idCliente;
    private Long idBarbearia;
    private Long idBarbeiro;
    private LocalDateTime dataHoraInicio;
    private List<ItemAgendamentoRequest> itens;

    public AgendamentoRequest() {
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

    public List<ItemAgendamentoRequest> getItens() {
        return itens;
    }

    public void setItens(List<ItemAgendamentoRequest> itens) {
        this.itens = itens;
    }
}