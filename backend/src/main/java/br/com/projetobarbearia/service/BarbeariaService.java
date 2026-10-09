package br.com.projetobarbearia.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.EnderecoRepository;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.ServicoRepository;
import br.com.projetobarbearia.repository.UsuarioRepository;

@Service
public class BarbeariaService {

    private final BarbeariaRepository barbeariaRepository;
    private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;
    private final EnderecoRepository enderecoRepository;
    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    private final BarbeiroRepository barbeiroRepository;
    private final ServicoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AutorizacaoService autorizacaoService;

    public BarbeariaService(
            BarbeariaRepository barbeariaRepository,
            ProprietarioBarbeariaRepository proprietarioBarbeariaRepository,
            EnderecoRepository enderecoRepository,
            HorarioFuncionamentoRepository horarioFuncionamentoRepository,
            BarbeiroRepository barbeiroRepository,
            ServicoRepository servicoRepository,
            UsuarioRepository usuarioRepository,
            AutorizacaoService autorizacaoService) {

        this.barbeariaRepository = barbeariaRepository;
        this.proprietarioBarbeariaRepository = proprietarioBarbeariaRepository;
        this.enderecoRepository = enderecoRepository;
        this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
        this.barbeiroRepository = barbeiroRepository;
        this.servicoRepository = servicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.autorizacaoService = autorizacaoService;
    }

    public List<Barbearia> listarTodas() {
        return barbeariaRepository.findAll();
    }

    public Optional<Barbearia> buscarPorId(Long id) {
        return barbeariaRepository.findById(id);
    }

    @Transactional
    public Barbearia salvar(Barbearia barbearia) {

        boolean novaBarbearia = barbearia.getIdBarbearia() == null;

        if (!novaBarbearia) {
            autorizacaoService.exigirProprietarioDaBarbearia(
                    barbearia.getIdBarbearia());
        }

        if (barbearia.getCnpj() != null
                && !barbearia.getCnpj().isBlank()) {

            Optional<Barbearia> barbeariaComMesmoCnpj =
                    barbeariaRepository.findByCnpj(barbearia.getCnpj());

            if (barbeariaComMesmoCnpj.isPresent()
                    && !barbeariaComMesmoCnpj.get()
                            .getIdBarbearia()
                            .equals(barbearia.getIdBarbearia())) {

                throw new IllegalArgumentException(
                        "CNPJ jÃ¡ cadastrado.");
            }
        }

        if (novaBarbearia) {
            barbearia.setAtiva(false);

            Barbearia salva = barbeariaRepository.save(barbearia);

            Long idUsuarioAutenticado =
                    autorizacaoService.obterIdUsuarioAutenticado();

            Usuario usuario = usuarioRepository
                    .findById(idUsuarioAutenticado)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "UsuÃ¡rio nÃ£o encontrado."));

            ProprietarioBarbearia vinculo = new ProprietarioBarbearia();
            vinculo.setUsuario(usuario);
            vinculo.setBarbearia(salva);
            vinculo.setDataVinculo(LocalDate.now());
            vinculo.setAtivo(true);

            proprietarioBarbeariaRepository.save(vinculo);

            return salva;
        }

        Barbearia barbeariaAtual = barbeariaRepository
                .findById(barbearia.getIdBarbearia())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia nÃ£o encontrada."));

        if (!barbeariaAtual.isAtiva() && barbearia.isAtiva()) {
            throw new IllegalArgumentException(
                    "Para ativar a barbearia, utilize a operaÃ§Ã£o de ativaÃ§Ã£o.");
        }

        return barbeariaRepository.save(barbearia);
    }

    public Barbearia ativar(Long id) {
        autorizacaoService.exigirProprietarioDaBarbearia(id);

        Barbearia barbearia = barbeariaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia nÃ£o encontrada."));

        if (!proprietarioBarbeariaRepository
                .existsByBarbearia_IdBarbeariaAndAtivoTrue(id)) {
            throw new IllegalArgumentException(
                    "A barbearia precisa possuir pelo menos um proprietÃ¡rio ativo.");
        }

        if (!enderecoRepository.existsByBarbearia_IdBarbearia(id)) {
            throw new IllegalArgumentException(
                    "A barbearia precisa possuir um endereÃ§o cadastrado.");
        }

        if (!horarioFuncionamentoRepository
                .existsByBarbearia_IdBarbeariaAndFechadoFalse(id)) {
            throw new IllegalArgumentException(
                    "A barbearia precisa possuir pelo menos um horÃ¡rio de funcionamento.");
        }

        if (!barbeiroRepository
                .existsByBarbearia_IdBarbeariaAndAtivoTrue(id)) {
            throw new IllegalArgumentException(
                    "A barbearia precisa possuir pelo menos um barbeiro ativo.");
        }

        if (!servicoRepository
                .existsByBarbearia_IdBarbeariaAndAtivoTrue(id)) {
            throw new IllegalArgumentException(
                    "A barbearia precisa possuir pelo menos um serviÃ§o ativo.");
        }

        barbearia.setAtiva(true);
        return barbeariaRepository.save(barbearia);
    }

    public void excluir(Long id) {
        autorizacaoService.exigirProprietarioDaBarbearia(id);

        if (!barbeariaRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Barbearia nÃ£o encontrada.");
        }

        barbeariaRepository.deleteById(id);
    }

    public void desativarSeInvalida(Long idBarbearia) {
        Barbearia barbearia = barbeariaRepository.findById(idBarbearia)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia nÃ£o encontrada."));

        if (!barbearia.isAtiva()) {
            return;
        }

        boolean possuiProprietario = proprietarioBarbeariaRepository
                .existsByBarbearia_IdBarbeariaAndAtivoTrue(idBarbearia);
        boolean possuiEndereco = enderecoRepository
                .existsByBarbearia_IdBarbearia(idBarbearia);
        boolean possuiHorario = horarioFuncionamentoRepository
                .existsByBarbearia_IdBarbeariaAndFechadoFalse(idBarbearia);
        boolean possuiBarbeiro = barbeiroRepository
                .existsByBarbearia_IdBarbeariaAndAtivoTrue(idBarbearia);
        boolean possuiServico = servicoRepository
                .existsByBarbearia_IdBarbeariaAndAtivoTrue(idBarbearia);

        boolean continuaValida = possuiProprietario
                && possuiEndereco
                && possuiHorario
                && possuiBarbeiro
                && possuiServico;

        if (!continuaValida) {
            barbearia.setAtiva(false);
            barbeariaRepository.save(barbearia);
        }
    }

    public Barbearia desativar(Long id) {
        autorizacaoService.exigirProprietarioDaBarbearia(id);

        Barbearia barbearia = barbeariaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Barbearia nÃ£o encontrada."));

        barbearia.setAtiva(false);
        return barbeariaRepository.save(barbearia);
    }
}