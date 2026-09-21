package br.com.projetobarbearia.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

@Entity
@Table(name = "barbearia")
public class Barbearia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_barbearia")
    private Long idBarbearia;

    @Column(name = "nome", nullable = false, length = 120)
    private String nome;

    @Column(name = "cnpj", unique = true, length = 14)
    private String cnpj;

    @Column(name = "descricao", length = 500)
    private String descricao;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "ativa", nullable = false)
    private boolean ativa = false;

    public Barbearia() {

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
