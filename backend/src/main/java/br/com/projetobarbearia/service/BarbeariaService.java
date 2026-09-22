package br.com.projetobarbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.projetobarbearia.entity.Barbearia;
import br.com.projetobarbearia.repository.BarbeariaRepository;
import br.com.projetobarbearia.repository.BarbeiroRepository;
import br.com.projetobarbearia.repository.EnderecoRepository;
import br.com.projetobarbearia.repository.HorarioFuncionamentoRepository;
import br.com.projetobarbearia.repository.ProprietarioBarbeariaRepository;
import br.com.projetobarbearia.repository.ServicoRepository;

@Service
public class BarbeariaService {

        private final BarbeariaRepository barbeariaRepository;
        private final ProprietarioBarbeariaRepository proprietarioBarbeariaRepository;
        private final EnderecoRepository enderecoRepository;
        private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
        private final BarbeiroRepository barbeiroRepository;
        private final ServicoRepository servicoRepository;

        public BarbeariaService(
                        BarbeariaRepository barbeariaRepository,
                        ProprietarioBarbeariaRepository proprietarioBarbeariaRepository,
                        EnderecoRepository enderecoRepository,
                        HorarioFuncionamentoRepository horarioFuncionamentoRepository,
                        BarbeiroRepository barbeiroRepository,
                        ServicoRepository servicoRepository) {

                this.barbeariaRepository = barbeariaRepository;
                this.proprietarioBarbeariaRepository = proprietarioBarbeariaRepository;
                this.enderecoRepository = enderecoRepository;
                this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
                this.barbeiroRepository = barbeiroRepository;
                this.servicoRepository = servicoRepository;
        }

        public List<Barbearia> listarTodas() {
                return barbeariaRepository.findAll();
        }

        public Optional<Barbearia> buscarPorId(Long id) {
                return barbeariaRepository.findById(id);
        }

        public Barbearia salvar(Barbearia barbearia) {

                if (barbearia.getCnpj() != null
                                && !barbearia.getCnpj().isBlank()) {

                        Optional<Barbearia> barbeariaComMesmoCnpj = barbeariaRepository.findByCnpj(
                                        barbearia.getCnpj());

                        if (barbeariaComMesmoCnpj.isPresent()
                                        && !barbeariaComMesmoCnpj.get()
                                                        .getIdBarbearia()
                                                        .equals(barbearia.getIdBarbearia())) {

                                throw new IllegalArgumentException(
                                                "CNPJ já cadastrado.");
                        }
                }

                // Nova barbearia sempre começa inativa
                if (barbearia.getIdBarbearia() == null) {
                        barbearia.setAtiva(false);
                        return barbeariaRepository.save(barbearia);
                }

                Barbearia barbeariaAtual = barbeariaRepository
                                .findById(barbearia.getIdBarbearia())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbearia não encontrada."));

                // Impede ativação direta pelo método salvar()
                if (!barbeariaAtual.isAtiva()
                                && barbearia.isAtiva()) {

                        throw new IllegalArgumentException(
                                        "Para ativar a barbearia, utilize a operação de ativação.");
                }

                return barbeariaRepository.save(barbearia);
        }

        public Barbearia ativar(Long id) {

                Barbearia barbearia = barbeariaRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Barbearia não encontrada."));

                if (!proprietarioBarbeariaRepository
                                .existsByBarbearia_IdBarbeariaAndAtivoTrue(id)) {
                        throw new IllegalArgumentException(
                                        "A barbearia precisa possuir pelo menos um proprietário ativo.");
                }

                if (!enderecoRepository.existsByBarbearia_IdBarbearia(id)) {
                        throw new IllegalArgumentException(
                                        "A barbearia precisa possuir um endereço cadastrado.");
                }

                if (!horarioFuncionamentoRepository
                                .existsByBarbearia_IdBarbeariaAndFechadoFalse(id)) {
                        throw new IllegalArgumentException(
                                        "A barbearia precisa possuir pelo menos um horário de funcionamento.");
                }

                if (!barbeiroRepository
                                .existsByBarbearia_IdBarbeariaAndAtivoTrue(id)) {
                        throw new IllegalArgumentException(
                                        "A barbearia precisa possuir pelo menos um barbeiro ativo.");
                }

                if (!servicoRepository
                                .existsByBarbearia_IdBarbeariaAndAtivoTrue(id)) {
                        throw new IllegalArgumentException(
                                        "A barbearia precisa possuir pelo menos um serviço ativo.");
                }

                barbearia.setAtiva(true);

                return barbeariaRepository.save(barbearia);
        }

        public void excluir(Long id) {

                if (!barbeariaRepository.existsById(id)) {
                        throw new IllegalArgumentException("Barbearia não encontrada.");
                }

                barbeariaRepository.deleteById(id);
        }

        public void desativarSeInvalida(Long idBarbearia) {

                Barbearia barbearia = barbeariaRepository.findById(idBarbearia)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbearia não encontrada."));

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

                Barbearia barbearia = barbeariaRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Barbearia não encontrada."));

                barbearia.setAtiva(false);

                return barbeariaRepository.save(barbearia);
        }
}