package br.com.projetobarbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetobarbearia.dto.HorarioFuncionamentoRequest;
import br.com.projetobarbearia.dto.HorarioFuncionamentoResponse;
import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.service.HorarioFuncionamentoService;

@RestController
@RequestMapping("/api/horarios-funcionamento")
public class HorarioFuncionamentoController {

    private final HorarioFuncionamentoService horarioFuncionamentoService;

    public HorarioFuncionamentoController(
            HorarioFuncionamentoService horarioFuncionamentoService) {

        this.horarioFuncionamentoService = horarioFuncionamentoService;
    }

    @GetMapping
    public ResponseEntity<List<HorarioFuncionamentoResponse>> listarTodos() {

        List<HorarioFuncionamentoResponse> horarios = horarioFuncionamentoService.listarTodos()
                .stream()
                .map(this::converterParaResponse)
                .toList();

        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioFuncionamentoResponse> buscarPorId(
            @PathVariable Long id) {

        return horarioFuncionamentoService.buscarPorId(id)
                .map(this::converterParaResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HorarioFuncionamentoResponse> cadastrar(
            @RequestBody HorarioFuncionamentoRequest request) {

        HorarioFuncionamento horario = converterParaEntidade(request);

        HorarioFuncionamento salvo = horarioFuncionamentoService.cadastrar(
                request.getIdBarbearia(),
                horario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(converterParaResponse(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioFuncionamentoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody HorarioFuncionamentoRequest request) {

        HorarioFuncionamento horario = converterParaEntidade(request);

        HorarioFuncionamento atualizado = horarioFuncionamentoService.atualizar(
                id,
                request.getIdBarbearia(),
                horario);

        return ResponseEntity.ok(
                converterParaResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        horarioFuncionamentoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private HorarioFuncionamento converterParaEntidade(
            HorarioFuncionamentoRequest request) {

        HorarioFuncionamento horario = new HorarioFuncionamento();

        horario.setDiaSemana(request.getDiaSemana());
        horario.setHoraAbertura(request.getHoraAbertura());
        horario.setHoraFechamento(request.getHoraFechamento());
        horario.setFechado(request.isFechado());

        return horario;
    }

    private HorarioFuncionamentoResponse converterParaResponse(
            HorarioFuncionamento horario) {

        return new HorarioFuncionamentoResponse(
                horario.getIdHorario(),
                horario.getBarbearia().getIdBarbearia(),
                horario.getDiaSemana(),
                horario.getHoraAbertura(),
                horario.getHoraFechamento(),
                horario.isFechado());
    }
}