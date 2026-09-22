package br.com.projetobarbearia.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.ProprietarioBarbearia;
import br.com.projetobarbearia.entity.Usuario;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;

@Service
public class ProprietarioBarbeariaService {

    private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;
    private final UsuarioService usuarioService;
    private final BarbeariaService barbeariaService;

    public ProprietarioBarbeariaService(
            ProprietarioBarbeariaRepository proprietarioBarbeariaRepository,
            UsuarioService usuarioService,
            BarbeariaService barbeariaService) {

        this.proprietarioBarbeariaRepository = proprietarioBarbeariaRepository;
        this.usuarioService = usuarioService;
        this.barbeariaService = barbeariaService;
    }

    public List<ProprietarioBarbearia> listarTodos() {
        return proprietarioBarbeariaRepository.findAll();
    }

    public Optional<ProprietarioBarbearia> buscarPorId(Long id) {
        return proprietarioBarbeariaRepository.findById(id);
    }

    public ProprietarioBarbearia cadastrar(
            Long idUsuario,
            Long idBarbearia,
            LocalDate dataVinculo) {

        Usuario usuario = usuarioService.buscarPorId(idUsuario)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuário não encontrado."));

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        ProprietarioBarbearia proprietario = new ProprietarioBarbearia();

        proprietario.setUsuario(usuario);
        proprietario.setBarbearia(barbearia);
        proprietario.setDataVinculo(
                dataVinculo != null
                        ? dataVinculo
                        : LocalDate.now());
        proprietario.setAtivo(true);

        return proprietarioBarbeariaRepository.save(proprietario);
    }

    public ProprietarioBarbearia atualizar(
            Long id,
            Long idUsuario,
            Long idBarbearia,
            LocalDate dataVinculo) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Proprietário não encontrado."));

        Usuario usuario = usuarioService.buscarPorId(idUsuario)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuário não encontrado."));

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        Long idBarbeariaAnterior =
                proprietario.getBarbearia().getIdBarbearia();

        proprietario.setUsuario(usuario);
        proprietario.setBarbearia(barbearia);

        if (dataVinculo != null) {
            proprietario.setDataVinculo(dataVinculo);
        }

        ProprietarioBarbearia salvo =
                proprietarioBarbeariaRepository.save(proprietario);

        if (!idBarbeariaAnterior.equals(idBarbearia)) {
            barbeariaService.desativarSeInvalida(
                    idBarbeariaAnterior);
        }

        return salvo;
    }

    public ProprietarioBarbearia ativar(Long id) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Proprietário não encontrado."));

        proprietario.setAtivo(true);

        return proprietarioBarbeariaRepository.save(proprietario);
    }

    public ProprietarioBarbearia desativar(Long id) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Proprietário não encontrado."));

        proprietario.setAtivo(false);

        ProprietarioBarbearia salvo =
                proprietarioBarbeariaRepository.save(proprietario);

        barbeariaService.desativarSeInvalida(
                proprietario.getBarbearia().getIdBarbearia());

        return salvo;
    }

    @Transactional
    public void excluir(Long id) {

        ProprietarioBarbearia proprietario =
                proprietarioBarbeariaRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Proprietário não encontrado."));

        Long idBarbearia =
                proprietario.getBarbearia().getIdBarbearia();

        proprietarioBarbeariaRepository.delete(proprietario);
        proprietarioBarbeariaRepository.flush();

        barbeariaService.desativarSeInvalida(idBarbearia);
    }
}