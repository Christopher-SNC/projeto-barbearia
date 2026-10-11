package br.com.projetobarbearia.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.ServicoRepository;
import br.com.projetobarbearia.service.PrecoPromocionalService;

@RestController
@RequestMapping("/api/servicos")
public class PrecoServicoController {

    private final ServicoRepository servicoRepository;
    private final PrecoPromocionalService precoPromocionalService;

    public PrecoServicoController(
            ServicoRepository servicoRepository,
            PrecoPromocionalService precoPromocionalService) {
        this.servicoRepository = servicoRepository;
        this.precoPromocionalService = precoPromocionalService;
    }

    @GetMapping("/{id}/preco")
    public ResponseEntity<PrecoPromocionalService.ResultadoPreco>
            consultarPreco(
                    @PathVariable Long id,
                    @RequestParam
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate data) {

        return servicoRepository.findById(id)
                .filter(Servico::isAtivo)
                .filter(servico -> servico.getBarbearia() != null
                        && servico.getBarbearia().isAtiva())
                .map(servico -> ResponseEntity.ok(
                        precoPromocionalService.calcular(
                                servico, data)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}