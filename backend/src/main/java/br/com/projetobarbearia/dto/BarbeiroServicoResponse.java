package br.com.projetobarbearia.dto;

public class BarbeiroServicoResponse {

    private Long idBarbeiroServico;
    private Long idBarbeiro;
    private Long idServico;
    private boolean ativo;

    public BarbeiroServicoResponse() {
    }

    public BarbeiroServicoResponse(
            Long idBarbeiroServico,
            Long idBarbeiro,
            Long idServico,
            boolean ativo) {

        this.idBarbeiroServico = idBarbeiroServico;
        this.idBarbeiro = idBarbeiro;
        this.idServico = idServico;
        this.ativo = ativo;
    }

    public Long getIdBarbeiroServico() {
        return idBarbeiroServico;
    }

    public void setIdBarbeiroServico(Long idBarbeiroServico) {
        this.idBarbeiroServico = idBarbeiroServico;
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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}