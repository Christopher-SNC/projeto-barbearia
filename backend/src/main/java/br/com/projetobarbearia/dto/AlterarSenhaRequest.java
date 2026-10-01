package br.com.projetobarbearia.dto;

public class AlterarSenhaRequest {

    private String senhaAtual;
    private String novaSenha;
    private String confirmarNovaSenha;

    public AlterarSenhaRequest() {
    }

    public String getSenhaAtual() {
        return senhaAtual;
    }

    public void setSenhaAtual(String senhaAtual) {
        this.senhaAtual = senhaAtual;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }

    public String getConfirmarNovaSenha() {
        return confirmarNovaSenha;
    }

    public void setConfirmarNovaSenha(
            String confirmarNovaSenha) {

        this.confirmarNovaSenha = confirmarNovaSenha;
    }
}