package br.com.projetobarbearia.dto;

public class FotoResponse {

    private Long idFoto;
    private Long idBarbearia;
    private String url;
    private String legenda;
    private int ordem;
    private boolean ativa;

    public FotoResponse() {
    }

    public FotoResponse(
            Long idFoto,
            Long idBarbearia,
            String url,
            String legenda,
            int ordem,
            boolean ativa) {

        this.idFoto = idFoto;
        this.idBarbearia = idBarbearia;
        this.url = url;
        this.legenda = legenda;
        this.ordem = ordem;
        this.ativa = ativa;
    }

    public Long getIdFoto() {
        return idFoto;
    }

    public void setIdFoto(Long idFoto) {
        this.idFoto = idFoto;
    }

    public Long getIdBarbearia() {
        return idBarbearia;
    }

    public void setIdBarbearia(Long idBarbearia) {
        this.idBarbearia = idBarbearia;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getLegenda() {
        return legenda;
    }

    public void setLegenda(String legenda) {
        this.legenda = legenda;
    }

    public int getOrdem() {
        return ordem;
    }

    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }
}