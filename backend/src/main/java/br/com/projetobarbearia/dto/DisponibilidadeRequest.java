package br.com.projetobarbearia.dto;

import java.time.LocalTime;

import br.com.projetobarbearia.enums.DiaSemana;

public class DisponibilidadeRequest {

    private Long idBarbeiro;
    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFim;

    public DisponibilidadeRequest() {
    }

    public Long getIdBarbeiro() {
        return idBarbeiro;
    }

    public void setIdBarbeiro(Long idBarbeiro) {
        this.idBarbeiro = idBarbeiro;
    }

    public DiaSemana getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DiaSemana diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }
}