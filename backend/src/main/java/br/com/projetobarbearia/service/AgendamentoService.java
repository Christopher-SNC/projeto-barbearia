package br.com.projetobarbearia.service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.Disponibilidade;
import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.entity.ItemAgendamento;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.enums.DiaSemana;
import br.com.projetobarbearia.enums.StatusAgendamento;
import br.com.projetobarbearia.repository.AgendamentoRepository;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.BarbeiroServicoRepository;
import br.com.projetobarbearia.repository.DisponibilidadeRepository;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;
import br.com.projetobarbearia.repository.ItemAgendamentoRepository;
import br.com.projetobarbearia.repository.ServicoRepository;

@Service
public class AgendamentoService {

    private static final int BUFFER_MINUTOS = 15;

    private final AgendamentoRepository agendamentoRepository;
    private final ItemAgendamentoRepository itemAgendamentoRepository;
    private final BarbeariaRepository barbeariaRepository;
    private final BarbeiroRepository barbeiroRepository;
    private final ServicoRepository servicoRepository;
    private final BarbeiroServicoRepository barbeiroServicoRepository;
    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    private final DisponibilidadeRepository disponibilidadeRepository;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            ItemAgendamentoRepository itemAgendamentoRepository,
            BarbeariaRepository barbeariaRepository,
            BarbeiroRepository barbeiroRepository,
            ServicoRepository servicoRepository,
            BarbeiroServicoRepository barbeiroServicoRepository,
            HorarioFuncionamentoRepository horarioFuncionamentoRepository,
            DisponibilidadeRepository disponibilidadeRepository) {

        this.agendamentoRepository = agendamentoRepository;
        this.itemAgendamentoRepository = itemAgendamentoRepository;
        this.barbeariaRepository = barbeariaRepository;
        this.barbeiroRepository = barbeiroRepository;
        this.servicoRepository = servicoRepository;
        this.barbeiroServicoRepository = barbeiroServicoRepository;
        this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
        this.disponibilidadeRepository = disponibilidadeRepository;
    }

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return agendamentoRepository.findById(id);
    }

    @Transactional
    public Agendamento criar(
            Agendamento agendamento,
            List<ItemAgendamento> itens) {

        validarDados(agendamento, itens);

        Barbearia barbearia = barbeariaRepository
                .findById(agendamento.getBarbearia().getIdBarbearia())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        if (!barbearia.isAtiva()) {
            throw new IllegalArgumentException(
                    "Não é possível agendar em uma barbearia inativa.");
        }

        Barbeiro barbeiro = barbeiroRepository
                .findById(agendamento.getBarbeiro().getIdBarbeiro())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbeiro não encontrado."));

        if (!barbeiro.isAtivo()) {
            throw new IllegalArgumentException(
                    "O barbeiro está inativo.");
        }

        if (!barbeiro.getBarbearia()
                .getIdBarbearia()
                .equals(barbearia.getIdBarbearia())) {

            throw new IllegalArgumentException(
                    "O barbeiro não pertence à barbearia selecionada.");
        }

        validarServicos(
                itens,
                barbearia.getIdBarbearia(),
                barbeiro.getIdBarbeiro());

        agendamento.setBarbearia(barbearia);
        agendamento.setBarbeiro(barbeiro);

        int duracaoTotal = calcularDuracaoTotal(itens);

        validarHorarioFuncionamento(
                agendamento,
                duracaoTotal);

        validarDisponibilidadeBarbeiro(
                agendamento,
                duracaoTotal);

        validarConflitoDeHorario(
                agendamento,
                duracaoTotal);

        BigDecimal valorTotal = itens.stream()
                .map(ItemAgendamento::getPrecoFinal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        agendamento.setStatus(StatusAgendamento.CONFIRMADO);
        agendamento.setValorTotal(valorTotal);
        agendamento.setDataCriacao(LocalDateTime.now());

        Agendamento agendamentoSalvo =
                agendamentoRepository.save(agendamento);

        for (ItemAgendamento item : itens) {
            item.setAgendamento(agendamentoSalvo);
        }

        itemAgendamentoRepository.saveAll(itens);

        return agendamentoSalvo;
    }

    @Transactional
    public Agendamento cancelar(Long id) {

        Agendamento agendamento = buscarAgendamento(id);

        validarStatusConfirmado(agendamento);

        agendamento.setStatus(StatusAgendamento.CANCELADO);

        return agendamentoRepository.save(agendamento);
    }

    @Transactional
    public Agendamento concluir(Long id) {

        Agendamento agendamento = buscarAgendamento(id);

        validarStatusConfirmado(agendamento);

        agendamento.setStatus(StatusAgendamento.CONCLUIDO);

        return agendamentoRepository.save(agendamento);
    }

    @Transactional
    public Agendamento marcarNaoCompareceu(Long id) {

        Agendamento agendamento = buscarAgendamento(id);

        validarStatusConfirmado(agendamento);

        agendamento.setStatus(
                StatusAgendamento.NAO_COMPARECEU);

        return agendamentoRepository.save(agendamento);
    }

    private Agendamento buscarAgendamento(Long id) {

        return agendamentoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Agendamento não encontrado."));
    }

    private void validarStatusConfirmado(
            Agendamento agendamento) {

        if (agendamento.getStatus()
                != StatusAgendamento.CONFIRMADO) {

            throw new IllegalArgumentException(
                    "A operação só pode ser realizada em um agendamento confirmado.");
        }
    }

    private void validarDados(
            Agendamento agendamento,
            List<ItemAgendamento> itens) {

        if (agendamento.getBarbearia() == null
                || agendamento.getBarbearia()
                        .getIdBarbearia() == null) {

            throw new IllegalArgumentException(
                    "A barbearia é obrigatória.");
        }

        if (agendamento.getBarbeiro() == null
                || agendamento.getBarbeiro()
                        .getIdBarbeiro() == null) {

            throw new IllegalArgumentException(
                    "O barbeiro é obrigatório.");
        }

        if (agendamento.getDataHoraInicio() == null) {

            throw new IllegalArgumentException(
                    "A data e hora do agendamento são obrigatórias.");
        }

        if (agendamento.getDataHoraInicio()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Não é possível criar um agendamento no passado.");
        }

        if (itens == null || itens.isEmpty()) {

            throw new IllegalArgumentException(
                    "O agendamento precisa possuir pelo menos um serviço.");
        }
    }

    private void validarServicos(
            List<ItemAgendamento> itens,
            Long idBarbearia,
            Long idBarbeiro) {

        for (ItemAgendamento item : itens) {

            if (item.getServico() == null
                    || item.getServico()
                            .getIdServico() == null) {

                throw new IllegalArgumentException(
                        "O serviço é obrigatório.");
            }

            Servico servico = servicoRepository
                    .findById(item.getServico().getIdServico())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Serviço não encontrado."));

            if (!servico.isAtivo()) {

                throw new IllegalArgumentException(
                        "O serviço está inativo.");
            }

            if (!servico.getBarbearia()
                    .getIdBarbearia()
                    .equals(idBarbearia)) {

                throw new IllegalArgumentException(
                        "O serviço não pertence à barbearia selecionada.");
            }

            if (!barbeiroServicoRepository
                    .existsByBarbeiro_IdBarbeiroAndServico_IdServicoAndAtivoTrue(
                            idBarbeiro,
                            servico.getIdServico())) {

                throw new IllegalArgumentException(
                        "O barbeiro selecionado não realiza este serviço.");
            }

            item.setServico(servico);

            item.setPrecoOriginal(servico.getPreco());
            item.setPercentualDesconto(BigDecimal.ZERO);
            item.setPrecoFinal(servico.getPreco());
            item.setDuracaoMinutos(
                    servico.getDuracaoMinutos());
        }
    }

    private int calcularDuracaoTotal(
            List<ItemAgendamento> itens) {

        return itens.stream()
                .mapToInt(
                        ItemAgendamento::getDuracaoMinutos)
                .sum();
    }

    private void validarHorarioFuncionamento(
            Agendamento agendamento,
            int duracaoTotal) {

        LocalDateTime inicio =
                agendamento.getDataHoraInicio();

        LocalDateTime fim =
                inicio.plusMinutes(duracaoTotal);

        if (!inicio.toLocalDate()
                .equals(fim.toLocalDate())) {

            throw new IllegalArgumentException(
                    "O atendimento não pode ultrapassar o mesmo dia de funcionamento.");
        }

        DiaSemana diaSemana =
                converterDiaSemana(
                        inicio.getDayOfWeek());

        List<HorarioFuncionamento> horarios =
                horarioFuncionamentoRepository
                        .findByBarbearia_IdBarbeariaAndDiaSemanaAndFechadoFalse(
                                agendamento.getBarbearia()
                                        .getIdBarbearia(),
                                diaSemana);

        boolean horarioValido = horarios.stream()
                .anyMatch(horario ->
                        horario.getHoraAbertura() != null
                        && horario.getHoraFechamento() != null
                        && !inicio.toLocalTime()
                                .isBefore(
                                        horario.getHoraAbertura())
                        && !fim.toLocalTime()
                                .isAfter(
                                        horario.getHoraFechamento()));

        if (!horarioValido) {

            throw new IllegalArgumentException(
                    "O horário escolhido está fora do horário de funcionamento da barbearia.");
        }
    }

    private void validarDisponibilidadeBarbeiro(
            Agendamento agendamento,
            int duracaoTotal) {

        LocalDateTime inicio =
                agendamento.getDataHoraInicio();

        LocalDateTime fim =
                inicio.plusMinutes(duracaoTotal);

        DiaSemana diaSemana =
                converterDiaSemana(
                        inicio.getDayOfWeek());

        List<Disponibilidade> disponibilidades =
                disponibilidadeRepository
                        .findByBarbeiro_IdBarbeiroAndDiaSemanaAndAtivoTrue(
                                agendamento.getBarbeiro()
                                        .getIdBarbeiro(),
                                diaSemana);

        boolean disponibilidadeValida =
                disponibilidades.stream()
                        .anyMatch(disponibilidade ->
                                !inicio.toLocalTime()
                                        .isBefore(
                                                disponibilidade.getHoraInicio())
                                && !fim.toLocalTime()
                                        .isAfter(
                                                disponibilidade.getHoraFim()));

        if (!disponibilidadeValida) {

            throw new IllegalArgumentException(
                    "O barbeiro não está disponível no horário escolhido.");
        }
    }

    private void validarConflitoDeHorario(
            Agendamento novoAgendamento,
            int duracaoNovoAgendamento) {

        LocalDateTime novoInicio =
                novoAgendamento.getDataHoraInicio();

        LocalDateTime novoFimComBuffer =
                novoInicio.plusMinutes(
                        duracaoNovoAgendamento
                                + BUFFER_MINUTOS);

        LocalDateTime inicioDia =
                novoInicio.toLocalDate()
                        .atStartOfDay();

        LocalDateTime fimDia =
                inicioDia.plusDays(1);

        Long idBarbeiro =
                novoAgendamento.getBarbeiro()
                        .getIdBarbeiro();

        List<Agendamento> agendamentosExistentes =
                agendamentoRepository
                        .findByBarbeiro_IdBarbeiroAndStatusAndDataHoraInicioGreaterThanEqualAndDataHoraInicioLessThan(
                                idBarbeiro,
                                StatusAgendamento.CONFIRMADO,
                                inicioDia,
                                fimDia);

        for (Agendamento existente
                : agendamentosExistentes) {

            if (novoAgendamento.getIdAgendamento() != null
                    && novoAgendamento
                            .getIdAgendamento()
                            .equals(
                                    existente.getIdAgendamento())) {

                continue;
            }

            List<ItemAgendamento> itensExistentes =
                    itemAgendamentoRepository
                            .findByAgendamento_IdAgendamento(
                                    existente.getIdAgendamento());

            int duracaoExistente =
                    calcularDuracaoTotal(
                            itensExistentes);

            LocalDateTime inicioExistente =
                    existente.getDataHoraInicio();

            LocalDateTime fimExistenteComBuffer =
                    inicioExistente.plusMinutes(
                            duracaoExistente
                                    + BUFFER_MINUTOS);

            boolean existeConflito =
                    novoInicio.isBefore(
                            fimExistenteComBuffer)
                    && novoFimComBuffer.isAfter(
                            inicioExistente);

            if (existeConflito) {

                throw new IllegalArgumentException(
                        "O barbeiro já possui um agendamento nesse período.");
            }
        }
    }

    private DiaSemana converterDiaSemana(
            DayOfWeek dia) {

        return switch (dia) {
            case MONDAY -> DiaSemana.SEGUNDA;
            case TUESDAY -> DiaSemana.TERCA;
            case WEDNESDAY -> DiaSemana.QUARTA;
            case THURSDAY -> DiaSemana.QUINTA;
            case FRIDAY -> DiaSemana.SEXTA;
            case SATURDAY -> DiaSemana.SABADO;
            case SUNDAY -> DiaSemana.DOMINGO;
        };
    }
}