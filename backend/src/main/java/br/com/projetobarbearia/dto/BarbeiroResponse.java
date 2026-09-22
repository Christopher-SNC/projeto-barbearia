package br.com.projetobarbearia.dto;

public class BarbeiroResponse {

    private Long idBarbeiro;
    private Long idUsuario;
    private Long idBarbearia;
    private String descricao;
    private boolean ativo;

    public BarbeiroResponse() {
    }

    public BarbeiroResponse(
            Long idBarbeiro,
            Long idUsuario,
            Long idBarbearia,
            String descricao,
            boolean ativo) {

        this.idBarbeiro = idBarbeiro;
        this.idUsuario = idUsuario;
        this.idBarbearia = idBarbearia;
        this.descricao = descricao;
        this.ativo = ativo;
    }

    public Long getIdBarbeiro() {
        return idBarbeiro;
    }

    public void setIdBarbeiro(Long idBarbeiro) {
        this.idBarbeiro = idBarbeiro;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}