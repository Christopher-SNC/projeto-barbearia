package br.com.projetobarbearia.dto;

import java.time.LocalDateTime;

public class AvaliacaoResponse {

    private Long idAvaliacao;
    private Long idAgendamento;
    private int notaBarbearia;
    private Integer notaBarbeiro;
    private String comentario;
    private LocalDateTime dataAvaliacao;

    public AvaliacaoResponse() {
    }

    public AvaliacaoResponse(
            Long idAvaliacao,
            Long idAgendamento,
            int notaBarbearia,
            Integer notaBarbeiro,
            String comentario,
            LocalDateTime dataAvaliacao) {

        this.idAvaliacao = idAvaliacao;
        this.idAgendamento = idAgendamento;
        this.notaBarbearia = notaBarbearia;
        this.notaBarbeiro = notaBarbeiro;
        this.comentario = comentario;
        this.dataAvaliacao = dataAvaliacao;
    }

    public Long getIdAvaliacao() {
        return idAvaliacao;
    }

    public void setIdAvaliacao(Long idAvaliacao) {
        this.idAvaliacao = idAvaliacao;
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

    public LocalDateTime getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}