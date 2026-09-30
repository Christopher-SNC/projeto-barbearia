package br.com.projetobarbearia.dto;

public class PromocaoServicoRequest {

    private Long idPromocao;
    private Long idServico;

    public PromocaoServicoRequest() {
    }

    public Long getIdPromocao() {
        return idPromocao;
    }

    public void setIdPromocao(Long idPromocao) {
        this.idPromocao = idPromocao;
    }

    public Long getIdServico() {
        return idServico;
    }

    public void setIdServico(Long idServico) {
        this.idServico = idServico;
    }
}