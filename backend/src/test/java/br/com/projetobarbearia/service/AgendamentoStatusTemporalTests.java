package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.ItemAgendamento;
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
class AgendamentoStatusTemporalTests {

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

    private Agendamento prepararAgendamento(LocalDateTime inicio) {
        Agendamento agendamento = new Agendamento();

        agendamento.setIdAgendamento(77L);
        agendamento.setDataHoraInicio(inicio);
        agendamento.setStatus(StatusAgendamento.CONFIRMADO);

        when(agendamentoRepository.findById(77L))
                .thenReturn(Optional.of(agendamento));

        return agendamento;
    }

    private void configurarDuracao(int minutos) {
        ItemAgendamento item = new ItemAgendamento();
        item.setDuracaoMinutos(minutos);

        when(itemAgendamentoRepository
                .findByAgendamento_IdAgendamento(77L))
                .thenReturn(List.of(item));
    }

    @Test
    void naoPermiteConcluirAntesDoInicio() {
        Agendamento agendamento =
                prepararAgendamento(LocalDateTime.now().plusDays(1));

        configurarDuracao(30);

        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> service.concluir(77L));

        assertTrue(erro.getMessage().contains("antes do término"));
        assertEquals(StatusAgendamento.CONFIRMADO,
                agendamento.getStatus());

        verify(agendamentoRepository, never()).save(any());
    }

    @Test
    void naoPermiteConcluirDuranteAtendimento() {
        Agendamento agendamento =
                prepararAgendamento(LocalDateTime.now().minusMinutes(10));

        configurarDuracao(30);

        assertThrows(
                IllegalArgumentException.class,
                () -> service.concluir(77L));

        assertEquals(StatusAgendamento.CONFIRMADO,
                agendamento.getStatus());

        verify(agendamentoRepository, never()).save(any());
    }

    @Test
    void permiteConcluirDepoisDoTermino() {
        Agendamento agendamento =
                prepararAgendamento(LocalDateTime.now().minusHours(2));

        configurarDuracao(30);

        when(agendamentoRepository.save(any(Agendamento.class)))
                .thenAnswer(invocacao -> invocacao.getArgument(0));

        Agendamento resultado = service.concluir(77L);

        assertEquals(StatusAgendamento.CONCLUIDO,
                resultado.getStatus());

        verify(agendamentoRepository).save(agendamento);
    }

    @Test
    void naoPermiteConcluirSemDuracaoValida() {
        Agendamento agendamento =
                prepararAgendamento(LocalDateTime.now().minusHours(2));

        when(itemAgendamentoRepository
                .findByAgendamento_IdAgendamento(77L))
                .thenReturn(List.of());

        assertThrows(
                IllegalArgumentException.class,
                () -> service.concluir(77L));

        assertEquals(StatusAgendamento.CONFIRMADO,
                agendamento.getStatus());

        verify(agendamentoRepository, never()).save(any());
    }

    @Test
    void naoPermiteRegistrarAusenciaAntesDoInicio() {
        Agendamento agendamento =
                prepararAgendamento(LocalDateTime.now().plusHours(2));

        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> service.marcarNaoCompareceu(77L));

        assertTrue(erro.getMessage().contains("antes do início"));
        assertEquals(StatusAgendamento.CONFIRMADO,
                agendamento.getStatus());

        verify(agendamentoRepository, never()).save(any());
    }

    @Test
    void permiteRegistrarAusenciaDepoisDoInicio() {
        Agendamento agendamento =
                prepararAgendamento(LocalDateTime.now().minusMinutes(10));

        when(agendamentoRepository.save(any(Agendamento.class)))
                .thenAnswer(invocacao -> invocacao.getArgument(0));

        Agendamento resultado = service.marcarNaoCompareceu(77L);

        assertEquals(StatusAgendamento.NAO_COMPARECEU,
                resultado.getStatus());

        verify(agendamentoRepository).save(agendamento);
    }
}