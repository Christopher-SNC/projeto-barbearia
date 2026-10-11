package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.Disponibilidade;
import br.com.projetobarbearia.entity.HorarioFuncionamento;
import br.com.projetobarbearia.entity.ItemAgendamento;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.enums.DiaSemana;
import br.com.projetobarbearia.enums.StatusAgendamento;
import br.com.projetobarbearia.repository.AgendamentoRepository;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.BarbeiroServicoRepository;
import br.com.projetobarbearia.repository.DisponibilidadeRepository;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;
import br.com.projetobarbearia.repository.ItemAgendamentoRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.ServicoRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class AgendamentoConflitoTests {

    @Mock
    private AgendamentoRepository agendamentoRepository;

    @Mock
    private ItemAgendamentoRepository itemAgendamentoRepository;

    @Mock
    private BarbeariaRepository barbeariaRepository;

    @Mock
    private BarbeiroRepository barbeiroRepository;

    @Mock
    private ServicoRepository servicoRepository;

    @Mock
    private BarbeiroServicoRepository barbeiroServicoRepository;

    @Mock
    private HorarioFuncionamentoRepository horarioFuncionamentoRepository;

    @Mock
    private DisponibilidadeRepository disponibilidadeRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;

    @Mock
    private AutorizacaoService autorizacaoService;

    @Mock
    private PrecoPromocionalService precoPromocionalService;

    @InjectMocks
    private AgendamentoService service;

    private LocalDate data;
    private Barbearia barbearia;
    private Barbeiro barbeiro;
    private Servico servico;
    private Usuario cliente;

    @BeforeEach
    void preparar() {
        data = LocalDate.now()
                .plusWeeks(1)
                .with(TemporalAdjusters.nextOrSame(
                        DayOfWeek.MONDAY));

        cliente = new Usuario();
        cliente.setIdUsuario(10L);
        cliente.setAtivo(true);

        barbearia = new Barbearia();
        barbearia.setIdBarbearia(20L);
        barbearia.setAtiva(true);

        barbeiro = new Barbeiro();
        barbeiro.setIdBarbeiro(30L);
        barbeiro.setBarbearia(barbearia);
        barbeiro.setAtivo(true);

        servico = new Servico();
        servico.setIdServico(40L);
        servico.setBarbearia(barbearia);
        servico.setAtivo(true);
        servico.setPreco(new BigDecimal("50.00"));
        servico.setDuracaoMinutos(30);

        HorarioFuncionamento horario =
                new HorarioFuncionamento();
        horario.setHoraAbertura(LocalTime.of(9, 0));
        horario.setHoraFechamento(LocalTime.of(18, 0));

        Disponibilidade disponibilidade =
                new Disponibilidade();
        disponibilidade.setHoraInicio(LocalTime.of(9, 0));
        disponibilidade.setHoraFim(LocalTime.of(18, 0));

        Agendamento existente = new Agendamento();
        existente.setIdAgendamento(99L);
        existente.setDataHoraInicio(data.atTime(14, 0));

        ItemAgendamento itemExistente =
                new ItemAgendamento();
        itemExistente.setDuracaoMinutos(30);

        when(usuarioRepository.findById(10L))
                .thenReturn(Optional.of(cliente));

        when(barbeariaRepository.findById(20L))
                .thenReturn(Optional.of(barbearia));

        when(barbeiroRepository.buscarParaAgendamentoComLock(30L))
                .thenReturn(Optional.of(barbeiro));

        when(servicoRepository.findById(40L))
                .thenReturn(Optional.of(servico));

        when(barbeiroServicoRepository
                .existsByBarbeiro_IdBarbeiroAndServico_IdServicoAndAtivoTrue(
                        30L, 40L))
                .thenReturn(true);

        when(precoPromocionalService.calcular(servico, data))
                .thenReturn(
                        new PrecoPromocionalService.ResultadoPreco(
                                new BigDecimal("50.00"),
                                new BigDecimal("0.00"),
                                new BigDecimal("50.00")));

        when(horarioFuncionamentoRepository
                .findByBarbearia_IdBarbeariaAndDiaSemanaAndFechadoFalse(
                        20L, DiaSemana.SEGUNDA))
                .thenReturn(List.of(horario));

        when(disponibilidadeRepository
                .findByBarbeiro_IdBarbeiroAndDiaSemanaAndAtivoTrue(
                        30L, DiaSemana.SEGUNDA))
                .thenReturn(List.of(disponibilidade));

        when(agendamentoRepository
                .findByBarbeiro_IdBarbeiroAndStatusAndDataHoraInicioGreaterThanEqualAndDataHoraInicioLessThan(
                        org.mockito.ArgumentMatchers.eq(30L),
                        org.mockito.ArgumentMatchers.eq(
                                StatusAgendamento.CONFIRMADO),
                        any(LocalDateTime.class),
                        any(LocalDateTime.class)))
                .thenReturn(List.of(existente));

        when(itemAgendamentoRepository
                .findByAgendamento_IdAgendamento(99L))
                .thenReturn(List.of(itemExistente));
    }

    private Agendamento novoAgendamento(int hora, int minuto) {
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbearia(barbearia);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setDataHoraInicio(
                data.atTime(hora, minuto));

        return agendamento;
    }

    private List<ItemAgendamento> itens() {
        ItemAgendamento item = new ItemAgendamento();
        item.setServico(servico);
        return List.of(item);
    }

    @Test
    void rejeitaHorarioDentroDoBufferDoAnterior() {
        var erro = assertThrows(
                IllegalArgumentException.class,
                () -> service.criar(
                        novoAgendamento(14, 15),
                        itens()));

        assertTrue(erro.getMessage().contains(
                "já possui um agendamento"));

        verify(barbeiroRepository)
                .buscarParaAgendamentoComLock(30L);

        verify(agendamentoRepository, never())
                .save(any(Agendamento.class));
    }

    @Test
    void rejeitaAgendamentoQueInvadeHorarioExistente() {
        assertThrows(
                IllegalArgumentException.class,
                () -> service.criar(
                        novoAgendamento(13, 30),
                        itens()));

        verify(agendamentoRepository, never())
                .save(any(Agendamento.class));
    }

    @Test
    void permiteHorarioAposOsQuinzeMinutos() {
        when(agendamentoRepository.save(any(Agendamento.class)))
                .thenAnswer(invocacao ->
                        invocacao.getArgument(0));

        Agendamento salvo = service.criar(
                novoAgendamento(14, 45),
                itens());

        assertEquals(
                data.atTime(14, 45),
                salvo.getDataHoraInicio());

        assertEquals(
                new BigDecimal("50.00"),
                salvo.getValorTotal());

        verify(barbeiroRepository)
                .buscarParaAgendamentoComLock(30L);

        verify(agendamentoRepository)
                .save(any(Agendamento.class));
    }
}