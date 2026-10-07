package br.com.projetobarbearia.dto;

import java.time.LocalDateTime;

public class OcupacaoAgendamentoResponse {

    private LocalDateTime dataHoraInicio;
    private int duracaoMinutos;

    public OcupacaoAgendamentoResponse(
            LocalDateTime dataHoraInicio,
            int duracaoMinutos) {

        this.dataHoraInicio = dataHoraInicio;
        this.duracaoMinutos = duracaoMinutos;
    }

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(
            LocalDateTime dataHoraInicio) {

        this.dataHoraInicio = dataHoraInicio;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(
            int duracaoMinutos) {

        this.duracaoMinutos = duracaoMinutos;
    }
}
