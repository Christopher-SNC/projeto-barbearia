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
    name = "promocao_servico",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_promocao_servico",
            columnNames = {"id_promocao", "id_servico"}
        )
    }
)
public class PromocaoServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocao_servico")
    private Long idPromocaoServico;

    @ManyToOne
    @JoinColumn(name = "id_promocao", nullable = false)
    private Promocao promocao;

    @ManyToOne
    @JoinColumn(name = "id_servico", nullable = false)
    private Servico servico;

    public PromocaoServico() {

    }

    public Long getIdPromocaoServico() {
        return idPromocaoServico;
    }

    public void setIdPromocaoServico(Long idPromocaoServico) {
        this.idPromocaoServico = idPromocaoServico;
    }

    public Promocao getPromocao() {
        return promocao;
    }

    public void setPromocao(Promocao promocao) {
        this.promocao = promocao;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    
    
}