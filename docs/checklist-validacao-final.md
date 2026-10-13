# Checklist de validação final — Projeto Barbearia

Este documento separa **verificações já confirmadas** de **testes finais ainda pendentes**. Não marque um cenário como aprovado somente porque a tela existe.

## Evidências confirmadas até 12/10/2026 (70 testes)

- [x] Banco PostgreSQL e backend funcionando no ambiente isolado de testes (`8081` / `projeto_barbearia_teste`).
- [x] Suíte Java regular: **70 testes aprovados, 0 falhas**, em 12/10/2026, apontando para `projeto_barbearia_teste`.
- [x] ESLint e build de produção do frontend aprovados após a correção mobile da Home (12/10/2026).
- [x] Fluxo demonstrado: cliente agenda, proprietário/barbeiro visualizam, conclusão, avaliação, cancelamento e ausência.
- [x] Funcionário barbeiro sem área de cliente ou proprietário; rota de cadastro redireciona ao painel do barbeiro.
- [x] Proprietário que também é barbeiro com acesso às três áreas.
- [x] Cadastro de segunda barbearia fictícia no banco de testes.
- [x] Alternância administrativa entre unidades sem misturar serviços e agendamentos.
- [x] Unidade selecionada mantida após atualizar a página.
- [x] Home com destaque dinâmico de barbearia ativa, avaliação da API e navegação para os detalhes; unidade inativa fora dos destaques.
- [x] Código das funcionalidades recentes publicado na branch `main` e árvore Git limpa, conforme logs compartilhados.
- [x] Revisão visual mobile (390 px): Home, listagem de barbearias, detalhes, dashboard do cliente, dashboard do proprietário e dashboard do barbeiro. A captura completa da Home confirmou que os textos não estavam cortados.
- [x] Teste de leitura de `/api/favoritos`: a conta de barbeiro funcionário recebeu acesso negado e o proprietário com perfil de cliente recebeu uma lista vazia. Os códigos HTTP devem ser conferidos separadamente se necessários como evidência.
- [x] Regras de cliente da API reforçadas (agendamentos, favoritos e avaliações), com quatro novos testes aprovados.
- [x] Tela de login em celular (390 px), campos e link visíveis; Tab e Shift+Tab funcionam. Tentativa de senha incorreta recusada com 401 e mensagem apropriada.
- [x] Segunda unidade ativada no banco de testes; agendamento #6 confirmado e isolado da primeira unidade.
- [x] Nove capturas adicionadas ao README, sem senhas, tokens ou e-mails visíveis; painel do cliente recortado.

- [x] Limpeza parcial controlada de 17 registros da segunda unidade fictícia (ID 4), somente em `projeto_barbearia_teste`; unidades #2 e #3 preservadas.
- [x] Novo backup local antes da limpeza e verificações de integridade aprovadas; restauração integral do backup ainda não testada.
- [x] Conferência pós-limpeza na interface: listagem pública e painel administrativo da Barbearia Demonstração E2E preservados.
## Verificações pendentes antes de encerrar a versão acadêmica

- [ ] Fazer uma última navegação de regressão no desktop depois dos commits finais.
- [ ] Conferir foco e textos de outros formulários essenciais.
- [ ] Reexecutar, se necessário, o teste de concorrência PostgreSQL em separado e arquivar o resultado final.
- [ ] Confirmar estados de carregamento, vazio e erro da Home e da busca pública.
- [ ] Confirmar em testes HTTP finais os códigos 401/403/200 e os bloqueios administrativos entre contas, sem realizar gravações no banco principal.
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
