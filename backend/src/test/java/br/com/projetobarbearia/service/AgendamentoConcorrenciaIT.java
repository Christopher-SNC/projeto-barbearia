package br.com.projetobarbearia.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import br.com.projetobarbearia.entity.Agendamento;
import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Barbeiro;
import br.com.projetobarbearia.entity.ItemAgendamento;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.entity.Usuario;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/projeto_barbearia_teste",
    "spring.jpa.hibernate.ddl-auto=validate"
})
class AgendamentoConcorrenciaIT {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private Long idBarbearia;
    private Long idBarbeiro;
    private Long idUsuarioBarbeiro;
    private Long idCliente1;
    private Long idCliente2;
    private Long idServico;

    private LocalDateTime horarioTeste;

    @BeforeEach
    void prepararDados() {
        String banco = jdbc.queryForObject(
                "SELECT current_database()",
                String.class
        );

        assertEquals(
                "projeto_barbearia_teste",
                banco,
                "PROTECAO: o teste nao pode usar o banco principal!"
        );

        String identificador = UUID.randomUUID()
                .toString()
                .replace("-", "");

        idCliente1 = inserirUsuario(
                "Cliente Concorrencia 1",
                "cliente1-" + identificador + "@example.invalid"
        );

        idCliente2 = inserirUsuario(
                "Cliente Concorrencia 2",
                "cliente2-" + identificador + "@example.invalid"
        );

        idUsuarioBarbeiro = inserirUsuario(
                "Barbeiro Concorrencia",
                "barbeiro-" + identificador + "@example.invalid"
        );

        idBarbearia = jdbc.queryForObject(
                """
                INSERT INTO public.barbearia
                    (nome, ativa)
                VALUES
                    ('Barbearia Teste Concorrencia', true)
                RETURNING id_barbearia
                """,
                Long.class
        );

        idBarbeiro = jdbc.queryForObject(
                """
                INSERT INTO public.barbeiro
                    (id_usuario, id_barbearia, ativo)
                VALUES (?, ?, true)
                RETURNING id_barbeiro
                """,
                Long.class,
                idUsuarioBarbeiro,
                idBarbearia
        );

        idServico = jdbc.queryForObject(
                """
                INSERT INTO public.servico
                    (id_barbearia, nome, preco,
                     duracao_minutos, ativo)
                VALUES (?, 'Corte Concorrencia',
                        40.00, 30, true)
                RETURNING id_servico
                """,
                Long.class,
                idBarbearia
        );

        jdbc.update(
                """
                INSERT INTO public.barbeiro_servico
                    (id_barbeiro, id_servico, ativo)
                VALUES (?, ?, true)
                """,
                idBarbeiro,
                idServico
        );

        jdbc.update(
                """
                INSERT INTO public.horario_funcionamento
                    (id_barbearia, dia_semana,
                     hora_abertura, hora_fechamento,
                     fechado)
                VALUES (?, 'SEGUNDA',
                        '09:00', '18:00', false)
                """,
                idBarbearia
        );

        jdbc.update(
                """
                INSERT INTO public.disponibilidade
                    (id_barbeiro, dia_semana,
                     hora_inicio, hora_fim, ativo)
                VALUES (?, 'SEGUNDA',
                        '09:00', '18:00', true)
                """,
                idBarbeiro
        );

        LocalDate data = LocalDate.now()
                .plusWeeks(2)
                .with(TemporalAdjusters.nextOrSame(
                        DayOfWeek.MONDAY));

        horarioTeste = data.atTime(14, 0);
    }

    private Long inserirUsuario(
            String nome,
            String email) {

        return jdbc.queryForObject(
                """
                INSERT INTO public.usuario
                    (nome, email, senha_hash, ativo)
                VALUES (?, ?, 'teste-isolado', true)
                RETURNING id_usuario
                """,
                Long.class,
                nome,
                email
        );
    }

    private String tentarAgendar(Long idCliente) {
        Usuario cliente = new Usuario();
        cliente.setIdUsuario(idCliente);

        Barbearia barbearia = new Barbearia();
        barbearia.setIdBarbearia(idBarbearia);

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setIdBarbeiro(idBarbeiro);

        Servico servico = new Servico();
        servico.setIdServico(idServico);

        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbearia(barbearia);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setDataHoraInicio(horarioTeste);

        ItemAgendamento item = new ItemAgendamento();
        item.setServico(servico);

        try {
            agendamentoService.criar(
                    agendamento,
                    List.of(item)
            );

            return "CONFIRMADO";

        } catch (IllegalArgumentException exception) {
            return "REJEITADO: " + exception.getMessage();
        }
    }

    @Test
    void duasReservasSimultaneasPermitemApenasUma()
            throws Exception {

        ExecutorService executor =
                Executors.newFixedThreadPool(2);

        CountDownLatch largada = new CountDownLatch(1);

        try {
            Future<String> tentativa1 = executor.submit(() -> {
                if (!largada.await(10, TimeUnit.SECONDS)) {
                    throw new IllegalStateException(
                            "Tempo de espera esgotado.");
                }

                return tentarAgendar(idCliente1);
            });

            Future<String> tentativa2 = executor.submit(() -> {
                if (!largada.await(10, TimeUnit.SECONDS)) {
                    throw new IllegalStateException(
                            "Tempo de espera esgotado.");
                }

                return tentarAgendar(idCliente2);
            });

            TransactionTemplate transacao =
                    new TransactionTemplate(transactionManager);

            // Segura temporariamente o registro do barbeiro.
            // As duas tentativas precisam aguardar o mesmo lock.
            transacao.executeWithoutResult(status -> {
                jdbc.queryForObject(
                        """
                        SELECT id_barbeiro
                        FROM public.barbeiro
                        WHERE id_barbeiro = ?
                        FOR UPDATE
                        """,
                        Long.class,
                        idBarbeiro
                );

                largada.countDown();

                try {
                    Thread.sleep(500);
                } catch (InterruptedException exception) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException(exception);
                }
            });

            String resultado1 =
                    tentativa1.get(20, TimeUnit.SECONDS);

            String resultado2 =
                    tentativa2.get(20, TimeUnit.SECONDS);

            System.out.println(
                    "RESULTADO CLIENTE 1: " + resultado1);

            System.out.println(
                    "RESULTADO CLIENTE 2: " + resultado2);

            long confirmados =
                    List.of(resultado1, resultado2)
                            .stream()
                            .filter("CONFIRMADO"::equals)
                            .count();

            long rejeitados =
                    List.of(resultado1, resultado2)
                            .stream()
                            .filter(resultado ->
                                    resultado.contains(
                                            "já possui um agendamento"))
                            .count();

            Long reservasNoBanco = jdbc.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM public.agendamento
                    WHERE id_barbeiro = ?
                      AND status = 'CONFIRMADO'
                    """,
                    Long.class,
                    idBarbeiro
            );

            assertEquals(
                    1L, confirmados,
                    "Somente uma tentativa deve ser aceita.");

            assertEquals(
                    1L, rejeitados,
                    "A segunda tentativa deve ser rejeitada.");

            assertEquals(
                    1L, reservasNoBanco.longValue(),
                    "O banco deve conter somente uma reserva.");

            System.out.println(
                    "TESTE DE CONCORRENCIA APROVADO");

        } finally {
            largada.countDown();
            executor.shutdownNow();
            executor.awaitTermination(
                    10, TimeUnit.SECONDS);
        }
    }

    @AfterEach
    void limparDados() {
        if (idBarbeiro != null) {
            jdbc.update(
                    """
                    DELETE FROM public.item_agendamento
                    WHERE id_agendamento IN (
                        SELECT id_agendamento
                        FROM public.agendamento
                        WHERE id_barbeiro = ?
                    )
                    """,
                    idBarbeiro
            );

            jdbc.update(
                    "DELETE FROM public.agendamento WHERE id_barbeiro = ?",
                    idBarbeiro
            );

            jdbc.update(
                    "DELETE FROM public.barbeiro_servico WHERE id_barbeiro = ?",
                    idBarbeiro
            );

            jdbc.update(
                    "DELETE FROM public.disponibilidade WHERE id_barbeiro = ?",
                    idBarbeiro
            );
        }

        if (idBarbearia != null) {
            jdbc.update(
                    "DELETE FROM public.horario_funcionamento WHERE id_barbearia = ?",
                    idBarbearia
            );

            jdbc.update(
                    "DELETE FROM public.servico WHERE id_barbearia = ?",
                    idBarbearia
            );
        }

        if (idBarbeiro != null) {
            jdbc.update(
                    "DELETE FROM public.barbeiro WHERE id_barbeiro = ?",
                    idBarbeiro
            );
        }

        if (idBarbearia != null) {
            jdbc.update(
                    "DELETE FROM public.barbearia WHERE id_barbearia = ?",
                    idBarbearia
            );
        }

        for (Long id : new Long[] {
                idCliente1, idCliente2, idUsuarioBarbeiro
        }) {
            if (id != null) {
                jdbc.update(
                        "DELETE FROM public.usuario WHERE id_usuario = ?",
                        id
                );
            }
        }
    }
}