package br.com.projetobarbearia.dto;

import java.time.LocalDate;

public class ProprietarioBarbeariaRequest {

    private Long idUsuario;
    private Long idBarbearia;
    private LocalDate dataVinculo;

    public ProprietarioBarbeariaRequest() {
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
}