package br.com.projetobarbearia.dto;

import java.time.LocalTime;

import br.com.projetobarbearia.enums.DiaSemana;

public class HorarioFuncionamentoResponse {

    private Long idHorario;
    private Long idBarbearia;
    private DiaSemana diaSemana;
    private LocalTime horaAbertura;
    private LocalTime horaFechamento;
    private boolean fechado;

    public HorarioFuncionamentoResponse() {
    }

    public HorarioFuncionamentoResponse(
            Long idHorario,
            Long idBarbearia,
            DiaSemana diaSemana,
            LocalTime horaAbertura,
            LocalTime horaFechamento,
            boolean fechado) {

        this.idHorario = idHorario;
        this.idBarbearia = idBarbearia;
        this.diaSemana = diaSemana;
        this.horaAbertura = horaAbertura;
        this.horaFechamento = horaFechamento;
        this.fechado = fechado;
    }

    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public DiaSemana getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DiaSemana diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraAbertura() {
        return horaAbertura;
    }

    public void setHoraAbertura(LocalTime horaAbertura) {
        this.horaAbertura = horaAbertura;
    }

    public LocalTime getHoraFechamento() {
        return horaFechamento;
    }

    public void setHoraFechamento(LocalTime horaFechamento) {
        this.horaFechamento = horaFechamento;
    }

    public boolean isFechado() {
        return fechado;
    }

    public void setFechado(boolean fechado) {
        this.fechado = fechado;
    }
}
