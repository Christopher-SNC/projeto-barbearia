package br.com.projetobarbearia.dto;

import java.time.LocalTime;

import br.com.projetobarbearia.enums.DiaSemana;

public class DisponibilidadeResponse {

    private Long idDisponibilidade;
    private Long idBarbeiro;
    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private boolean ativo;

    public DisponibilidadeResponse() {
    }

    public DisponibilidadeResponse(
            Long idDisponibilidade,
            Long idBarbeiro,
            DiaSemana diaSemana,
            LocalTime horaInicio,
            LocalTime horaFim,
            boolean ativo) {

        this.idDisponibilidade = idDisponibilidade;
        this.idBarbeiro = idBarbeiro;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.ativo = ativo;
    }

    public Long getIdDisponibilidade() {
        return idDisponibilidade;
    }

    public void setIdDisponibilidade(Long idDisponibilidade) {
        this.idDisponibilidade = idDisponibilidade;
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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}