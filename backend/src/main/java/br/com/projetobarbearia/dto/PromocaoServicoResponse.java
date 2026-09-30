package br.com.projetobarbearia.dto;

public class PromocaoServicoResponse {

    private Long idPromocaoServico;
    private Long idPromocao;
    private Long idServico;

    public PromocaoServicoResponse() {
    }

    public PromocaoServicoResponse(
            Long idPromocaoServico,
            Long idPromocao,
            Long idServico) {

        this.idPromocaoServico = idPromocaoServico;

        this.idPromocao = idPromocao;

        this.idServico = idServico;
    }

    public Long getIdPromocaoServico() {
        return idPromocaoServico;
    }

    public void setIdPromocaoServico(
            Long idPromocaoServico) {

        this.idPromocaoServico = idPromocaoServico;
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