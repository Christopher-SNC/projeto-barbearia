package br.com.projetobarbearia.dto;

import java.util.List;

public class LoginResponse {

    private Long idUsuario;
    private String nome;
    private String email;
    private List<String> perfis;
    private Long idBarbeiro;
    private Long idBarbeariaBarbeiro;
    private List<Long> idsBarbeariasProprietario;

    public LoginResponse() {
    }

    public LoginResponse(
            Long idUsuario,
            String nome,
            String email,
            List<String> perfis,
            Long idBarbeiro,
            Long idBarbeariaBarbeiro,
            List<Long> idsBarbeariasProprietario) {

        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.perfis = perfis;
        this.idBarbeiro = idBarbeiro;
        this.idBarbeariaBarbeiro = idBarbeariaBarbeiro;
        this.idsBarbeariasProprietario = idsBarbeariasProprietario;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getPerfis() {
        return perfis;
    }

    public void setPerfis(List<String> perfis) {
        this.perfis = perfis;
    }

    public Long getIdBarbeiro() {
        return idBarbeiro;
    }

    public void setIdBarbeiro(Long idBarbeiro) {
        this.idBarbeiro = idBarbeiro;
    }

    public Long getIdBarbeariaBarbeiro() {
        return idBarbeariaBarbeiro;
    }

    public void setIdBarbeariaBarbeiro(Long idBarbeariaBarbeiro) {
        this.idBarbeariaBarbeiro = idBarbeariaBarbeiro;
    }

    public List<Long> getIdsBarbeariasProprietario() {
        return idsBarbeariasProprietario;
    }

    public void setIdsBarbeariasProprietario(
            List<Long> idsBarbeariasProprietario) {

        this.idsBarbeariasProprietario = idsBarbeariasProprietario;
    }
}
