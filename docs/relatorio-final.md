# Relatório final — Projeto Barbearia

- **Tipo:** registro técnico da versão acadêmica e de portfólio
- **Data de referência:** 12 de outubro de 2026
- **Repositório:** [Christopher-SNC/projeto-barbearia](https://github.com/Christopher-SNC/projeto-barbearia)
**Situação:** aplicação funcional para demonstração local; verificações complementares ainda pendentes.

## 1. Resumo executivo

O Projeto Barbearia é uma plataforma web full-stack para localizar barbearias, consultar profissionais, serviços e preços e agendar atendimentos. Também oferece áreas autenticadas para clientes, proprietários e barbeiros, com permissões e regras de negócio executadas no servidor.

A versão acadêmica reúne frontend React/TypeScript, API Java/Spring Boot e banco PostgreSQL. Os principais fluxos foram implementados, testados em ambiente local isolado e documentados no GitHub, incluindo capturas de telas desktop e mobile. **A aplicação não foi homologada para uso público em produção.**

## 2. Objetivos atendidos

- Disponibilizar pesquisa e visualização pública de barbearias, serviços, profissionais, preços, horários, fotos e avaliações.
- Permitir cadastro, login, gerenciamento de sessão, favoritos e agendamentos pelo cliente.
- Permitir ao proprietário administrar barbearias, equipes, serviços, horários, promoções, fotos e reservas.
- Oferecer agenda e ferramentas de atendimento ao barbeiro, respeitando suas permissões.
- Impedir reservas conflitantes e proteger recursos conforme os vínculos dos usuários.
- Permitir que um proprietário administre mais de uma unidade sem misturar dados entre estabelecimentos.

## 3. Tecnologias e arquitetura

| Camada | Tecnologias verificadas |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, React Router 7, Axios, CSS |
| Backend | Java 25, Spring Boot 4.1.1, Spring Web MVC |
| Segurança | Spring Security, autenticação por sessão, proteção CSRF e autorização no backend |
| Persistência | Spring Data JPA / Hibernate |
| Banco de dados | PostgreSQL, modelo relacional com 16 tabelas |
| Testes | JUnit, Mockito, Spring Boot Test, MockMvc, integração PostgreSQL, ESLint e build TypeScript/Vite |
| Ferramentas | Maven, npm, Git, GitHub e VS Code |

O frontend consome endpoints REST da API. O backend aplica as regras, verifica autorizações e persiste informações no PostgreSQL. O projeto está organizado em `backend/`, `frontend/`, `database/` e `docs/`.

## 4. Funcionalidades implementadas

### Área pública e cliente

- Página inicial com barbearias **ativas** carregadas da API, sem dados inventados de avaliações.
- Busca textual e filtros de serviços e avaliações; páginas de detalhes, horários e profissionais.
- Cadastro, login e sessão autenticada.
- Criação e cancelamento de agendamentos, consulta do histórico e de reservas futuras.
- Cadastro de favoritos e avaliações vinculadas a atendimentos concluídos.
- Visualização de promoções elegíveis e dos dados do serviço.

### Área do proprietário

- Painel de indicadores, agenda e gerenciamento de agendamentos.
- Cadastro e manutenção de barbearias, serviços, barbeiros, disponibilidade, horários e fotos.
- Consulta de avaliações e gerenciamento de promoções.
- Múltiplas unidades por proprietário, com seletor, persistência da seleção e isolamento de serviços e reservas.
- Ativação condicionada a proprietário ativo, endereço, funcionamento, barbeiro ativo e serviço ativo.

### Área do barbeiro

- Painel profissional, agenda, histórico, disponibilidade, serviços vinculados e avaliações.
- Conclusão de atendimentos e marcação de não comparecimento quando permitidas pelas regras de tempo.
- Separação de permissões: funcionário barbeiro sem acesso às ações exclusivas de clientes e proprietários; proprietário também barbeiro pode acumular perfis.

## 5. Regras de negócio relevantes

- Verificação de funcionamento da barbearia, disponibilidade do profissional e associação do barbeiro ao serviço.
- Intervalo obrigatório de **15 minutos** entre atendimentos.
- Bloqueio pessimista/transações para impedir a confirmação simultânea de horários conflitantes.
- Cálculo de valores e descontos pelo servidor, com proibição de agendar no passado.
- Estados `CONFIRMADO`, `CONCLUIDO`, `CANCELADO` e `NAO_COMPARECEU`.
- Cancelamento apenas antes do início; conclusão após o término previsto; ausência após 15 minutos do início.
- Avaliação permitida ao cliente associado a um agendamento concluído.
- Autorizações checadas no backend, e não apenas por ocultação de controles na interface.

## 6. Evidências de validação

| Evidência | Resultado registrado |
| --- | --- |
| Suíte Java regular | **70 testes aprovados, 0 falhas**, em 12/10/2026, com banco de testes isolado |
| Teste específico de concorrência PostgreSQL | Aprovado em execução anterior e separado; **não incluído nos 70** |
| Frontend | `npm run lint` e `npm run build` aprovados na última validação |
| Fluxo de reserva | Cliente agenda; proprietário e barbeiro visualizam; conclusão, cancelamento, ausência e avaliação conferidos |
| Controles de acesso | Restrições de barbeiro funcionário e acesso combinado de proprietário/barbeiro verificados; testes automatizados de autorização aprovados |
| Múltiplas unidades | Cadastro, ativação, alternância e isolamento de serviços/agendamentos verificados no banco de testes |
| Responsividade | Home, listagem, detalhes, cliente, proprietário, barbeiro e login revisados em largura de 390 px |
| Login inválido | API retornou `401 Unauthorized`; a interface exibiu mensagem compreensível e permaneceu na tela |
| Teclado | `Tab` e `Shift+Tab` funcionaram na tela de login |
| Material de apresentação | Nove capturas de interface adicionadas ao README, com dados fictícios e sem credenciais visíveis |
| Limpeza de testes | **17 registros** da segunda unidade removidos com transação protegida; unidades #2 e #3 preservadas |
| Conferência pós-limpeza | Listagem pública e painel da Barbearia Demonstração E2E continuaram funcionando |

As verificações são evidências do comportamento observado no ambiente local; **não equivalem a cobertura integral de cenários, auditoria independente ou homologação de produção**.

## 7. Ambiente de testes e preservação de dados

- Banco principal: `projeto_barbearia` — mantido separado dos testes funcionais com gravação.
- Banco isolado: `projeto_barbearia_teste` — usado para os testes e a limpeza controlada.
- Backend de testes na porta `8081` e frontend de testes na porta `5174`.
- Antes da exclusão da segunda unidade fictícia, foram criados backups locais fora do GitHub. O backup final foi verificado quanto ao formato; **uma restauração completa não foi executada**.
- Após a limpeza, permaneceram a **Barbearia Demonstração E2E** (ID 2, ativa) e a **Barba Alfa** (ID 3, inativa).
- A segunda unidade fictícia (ID 4), seu barbeiro e a reserva #6 foram usados para comprovar os fluxos e posteriormente removidos do banco isolado; as capturas e registros documentais dos testes permanecem no repositório.

## 8. Limitações e validações ainda pendentes

- Reproduzir a instalação e a inicialização integral do projeto a partir de um **clone limpo** em ambiente separado.
- Completar a regressão final de navegação desktop e verificar foco/identificação dos demais formulários essenciais.
- Verificar outros estados de carregamento, lista vazia e erro da Home e da pesquisa.
- Confirmar cenários HTTP complementares `401/403/200` e isolamento entre contas distintas em testes dirigidos.
- Se necessário, repetir o teste separado de concorrência e arquivar sua saída após todas as alterações.
- Não existe suíte automatizada de interface frontend configurada no `package.json` atual.
- Não foi realizada auditoria de segurança, teste de carga, implantação pública com TLS/monitoramento ou teste completo de restauração de backup.

**Esses itens não impedem uma apresentação acadêmica local do sistema já validado, mas precisam ser tratados antes de alegar prontidão para produção.**

## 9. Próximos passos sugeridos

1. Concluir o teste de instalação em ambiente limpo e corrigir eventuais lacunas de documentação.
2. Executar as verificações complementares listadas no checklist, priorizando casos de erro e autorização.
3. Opcionalmente adicionar testes automatizados de frontend e execução dos testes em integração contínua.
4. Antes de disponibilização pública, definir hospedagem, HTTPS, gestão de segredos, monitoramento, políticas de backup e restauração, testes de segurança e carga.
5. Utilizar as capturas e o README como material de apresentação no GitHub/portfólio.

## 10. Referências no repositório

- [README principal](../README.md)
- [Checklist de validação final](checklist-validacao-final.md)
- [Roteiro de apresentação](roteiro-apresentacao.md)
- [Capturas de tela](imagens/screenshots/)
- [Scripts e migrações de banco](../database/)

**Conclusão:** a versão acadêmica do Projeto Barbearia está funcional para demonstração local e devidamente documentada. As limitações remanescentes estão registradas para evolução futura; não se declara o produto pronto para operação pública.
