package br.com.projetobarbearia.dto;

public class AvaliacaoRequest {

    private Long idAgendamento;
    private int notaBarbearia;
    private Integer notaBarbeiro;
    private String comentario;

    public AvaliacaoRequest() {
    }

    public Long getIdAgendamento() {
        return idAgendamento;
    }

    public void setIdAgendamento(Long idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public int getNotaBarbearia() {
        return notaBarbearia;
    }

    public void setNotaBarbearia(int notaBarbearia) {
        this.notaBarbearia = notaBarbearia;
    }

    public Integer getNotaBarbeiro() {
        return notaBarbeiro;
    }

    public void setNotaBarbeiro(Integer notaBarbeiro) {
        this.notaBarbeiro = notaBarbeiro;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}