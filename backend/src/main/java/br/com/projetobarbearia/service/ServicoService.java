package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.entity.Servico;
import br.com.projetobarbearia.repository.ServicoRepository;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final BarbeariaService barbeariaService;

    public ServicoService(
            ServicoRepository servicoRepository,
            BarbeariaService barbeariaService) {

        this.servicoRepository = servicoRepository;
        this.barbeariaService = barbeariaService;
    }

    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscarPorId(Long id) {
        return servicoRepository.findById(id);
    }

    public Servico cadastrar(
            Long idBarbearia,
            Servico servico) {

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        validarServico(servico);

        servico.setBarbearia(barbearia);
        servico.setAtivo(true);

        return servicoRepository.save(servico);
    }

    public Servico atualizar(
            Long id,
            Long idBarbearia,
            Servico novosDados) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        Barbearia barbearia = barbeariaService.buscarPorId(idBarbearia)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Barbearia não encontrada."));

        validarServico(novosDados);

        Long idBarbeariaAnterior =
                servico.getBarbearia().getIdBarbearia();

        servico.setBarbearia(barbearia);
        servico.setNome(novosDados.getNome());
        servico.setDescricao(novosDados.getDescricao());
        servico.setPreco(novosDados.getPreco());
        servico.setDuracaoMinutos(
                novosDados.getDuracaoMinutos());

        Servico salvo = servicoRepository.save(servico);

        if (!idBarbeariaAnterior.equals(idBarbearia)) {
            barbeariaService.desativarSeInvalida(
                    idBarbeariaAnterior);
        }

        return salvo;
    }

    public Servico ativar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        servico.setAtivo(true);

        return servicoRepository.save(servico);
    }

    public Servico desativar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        servico.setAtivo(false);

        Servico salvo = servicoRepository.save(servico);

        barbeariaService.desativarSeInvalida(
                servico.getBarbearia().getIdBarbearia());

        return salvo;
    }

    @Transactional
    public void excluir(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado."));

        Long idBarbearia =
                servico.getBarbearia().getIdBarbearia();

        servicoRepository.delete(servico);
        servicoRepository.flush();

        barbeariaService.desativarSeInvalida(idBarbearia);
    }

    private void validarServico(Servico servico) {

        if (servico.getNome() == null
                || servico.getNome().isBlank()) {

            throw new IllegalArgumentException(
                    "O nome do serviço é obrigatório.");
        }

        if (servico.getPreco() == null
                || servico.getPreco().signum() < 0) {

            throw new IllegalArgumentException(
                    "O preço do serviço não pode ser negativo.");
        }

        if (servico.getDuracaoMinutos() <= 0) {
            throw new IllegalArgumentException(
                    "A duração do serviço deve ser maior que zero.");
        }
    }
}