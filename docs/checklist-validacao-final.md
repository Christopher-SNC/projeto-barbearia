# Checklist de validação final — Projeto Barbearia

Este documento separa **verificações já confirmadas** de **testes finais ainda pendentes**. Não marque um cenário como aprovado somente porque a tela existe.

## Evidências confirmadas até 12/10/2026

- [x] Banco PostgreSQL e backend funcionando no ambiente isolado de testes (`8081` / `projeto_barbearia_teste`).
- [x] Suíte Java regular: **66 testes aprovados, 0 falhas**, na execução informada em 11/10/2026.
- [x] ESLint e build de produção do frontend aprovados após a funcionalidade de destaques reais.
- [x] Fluxo demonstrado: cliente agenda, proprietário/barbeiro visualizam, conclusão, avaliação, cancelamento e ausência.
- [x] Funcionário barbeiro sem área de cliente ou proprietário; rota de cadastro redireciona ao painel do barbeiro.
- [x] Proprietário que também é barbeiro com acesso às três áreas.
- [x] Cadastro de segunda barbearia fictícia no banco de testes.
- [x] Alternância administrativa entre unidades sem misturar serviços e agendamentos.
- [x] Unidade selecionada mantida após atualizar a página.
- [x] Home com destaque dinâmico de barbearia ativa, avaliação da API e navegação para os detalhes; unidade inativa fora dos destaques.
- [x] Código das funcionalidades recentes publicado na branch `main` e árvore Git limpa, conforme logs compartilhados.

## Verificações pendentes antes de encerrar a versão acadêmica

- [ ] Executar novamente `mvn test` apontando explicitamente para `projeto_barbearia_teste` e registrar o resultado final. O teste de concorrência PostgreSQL pode ser executado separadamente se o ambiente estiver preparado.
- [ ] Executar `npm run lint` e `npm run build` na versão final e registrar as saídas.
- [ ] Conferir Home, listagem, detalhes, login e áreas de cliente, proprietário e barbeiro em largura de celular e de desktop.
- [ ] Confirmar estados de carregamento, vazio e erro da Home e da busca pública.
- [ ] Validar manualmente que usuário sem autenticação não modifica dados privados e que funcionário barbeiro não cadastra barbearia pela API.
- [ ] Validar o fluxo completo de uma nova unidade (cadastrar serviços, barbeiro, disponibilidade, horários e ativar) somente no banco de testes; cuidado para não modificar a unidade original.
- [ ] Fazer checagem de navegação com teclado e textos dos formulários essenciais.
- [ ] Capturar e selecionar imagens sem dados pessoais para documentar o portfólio/README.
- [ ] Revisar instruções de configuração a partir de um clone limpo ou ambiente separado, sem expor credenciais.

## Comandos de validação (PowerShell)

No terminal do backend, após definir `DB_PASSWORD` **sem expor a senha**:

```powershell
cd C:\Users\chris\Desktop\projeto-barbearia\backend
$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://localhost:5432/projeto_barbearia_teste'
mvn test
```

No terminal do frontend:

```powershell
cd C:\Users\chris\Desktop\projeto-barbearia\frontend
npm run lint
npm run build
```

Para confirmar o repositório:

```powershell
cd C:\Users\chris\Desktop\projeto-barbearia
git status
git log -1 --oneline
```

**Atenção:** nunca execute testes que criem, editem ou excluam registros em `projeto_barbearia`. O banco principal possui dados preservados; todos os testes funcionais com escrita devem ocorrer em `projeto_barbearia_teste`.

## Limites conhecidos

Esta checklist não equivale a auditoria de segurança, teste de carga, homologação de produção ou implantação pública. O frontend conta com lint/build e validações manuais; não há suíte automatizada de testes de interface no `package.json` atual.
