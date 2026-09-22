package br.com.projetobarbearia.dto;

public class BarbeariaResponse {

    private Long idBarbearia;
    private String nome;
    private String cnpj;
    private String descricao;
    private String telefone;
    private boolean ativa;

    public BarbeariaResponse() {
    }

    public BarbeariaResponse(
            Long idBarbearia,
            String nome,
            String cnpj,
            String descricao,
            String telefone,
            boolean ativa) {

        this.idBarbearia = idBarbearia;
        this.nome = nome;
        this.cnpj = cnpj;
        this.descricao = descricao;
        this.telefone = telefone;
        this.ativa = ativa;
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }
}