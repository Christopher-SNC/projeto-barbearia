package br.com.projetobarbearia.entity;

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
    name = "barbeiro_servico",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_barbeiro_servico",
            columnNames = {"id_barbeiro", "id_servico"}
        )
    }
)
public class BarbeiroServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_barbeiro_servico")
    private Long idBarbeiroServico;

    @ManyToOne
    @JoinColumn(name = "id_barbeiro", nullable = false)
    private Barbeiro barbeiro;

    @ManyToOne
    @JoinColumn(name = "id_servico", nullable = false)
    private Servico servico;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    public BarbeiroServico() {
    }

    public Long getIdBarbeiroServico() {
        return idBarbeiroServico;
    }

    public void setIdBarbeiroServico(Long idBarbeiroServico) {
        this.idBarbeiroServico = idBarbeiroServico;
    }

    public Barbeiro getBarbeiro() {
        return barbeiro;
    }

    public void setBarbeiro(Barbeiro barbeiro) {
        this.barbeiro = barbeiro;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    
}
