package br.com.projetobarbearia.dto;

public class BarbeiroServicoRequest {

    private Long idBarbeiro;
    private Long idServico;

    public BarbeiroServicoRequest() {
    }

    public Long getIdBarbeiro() {
        return idBarbeiro;
    }

    public void setIdBarbeiro(Long idBarbeiro) {
        this.idBarbeiro = idBarbeiro;
    }

    public Long getIdServico() {
        return idServico;
    }

    public void setIdServico(Long idServico) {
        this.idServico = idServico;
    }
}
