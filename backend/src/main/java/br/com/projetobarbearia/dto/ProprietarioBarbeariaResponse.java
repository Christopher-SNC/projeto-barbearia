package br.com.projetobarbearia.dto;

import java.time.LocalDate;

public class ProprietarioBarbeariaResponse {

    private Long idProprietarioBarbearia;
    private Long idUsuario;
    private Long idBarbearia;
    private LocalDate dataVinculo;
    private boolean ativo;

    public ProprietarioBarbeariaResponse() {
    }

    public ProprietarioBarbeariaResponse(
            Long idProprietarioBarbearia,
            Long idUsuario,
            Long idBarbearia,
            LocalDate dataVinculo,
            boolean ativo) {

        this.idProprietarioBarbearia = idProprietarioBarbearia;
        this.idUsuario = idUsuario;
        this.idBarbearia = idBarbearia;
        this.dataVinculo = dataVinculo;
        this.ativo = ativo;
    }

    public Long getIdProprietarioBarbearia() {
        return idProprietarioBarbearia;
    }

    public void setIdProprietarioBarbearia(Long idProprietarioBarbearia) {
        this.idProprietarioBarbearia = idProprietarioBarbearia;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public LocalDate getDataVinculo() {
        return dataVinculo;
    }

    public void setDataVinculo(LocalDate dataVinculo) {
        this.dataVinculo = dataVinculo;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
