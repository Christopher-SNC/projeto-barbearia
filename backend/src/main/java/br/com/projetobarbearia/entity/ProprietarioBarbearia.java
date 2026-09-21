package br.com.projetobarbearia.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "proprietario_barbearia",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_proprietario_barbearia",
            columnNames = {"id_usuario", "id_barbearia"}
        )
    }
)
public class ProprietarioBarbearia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proprietario_barbearia")
    private Long idProprietarioBarbearia;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_barbearia", nullable = false)
    private Barbearia barbearia;

    @Column(name = "data_vinculo", nullable = false)
    private LocalDate dataVinculo;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    public ProprietarioBarbearia() {
    }

    public Long getIdProprietarioBarbearia() {
        return idProprietarioBarbearia;
    }

    public void setIdProprietarioBarbearia(Long idProprietarioBarbearia) {
        this.idProprietarioBarbearia = idProprietarioBarbearia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Barbearia getBarbearia() {
        return barbearia;
    }

    public void setBarbearia(Barbearia barbearia) {
        this.barbearia = barbearia;
    }

    public LocalDate getDataVinculo() {
        return dataVinculo;
    }

    public void setDataVinculo(LocalDate dataVinculo) {
        this.dataVinculo = dataVinculo;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
    
    
}