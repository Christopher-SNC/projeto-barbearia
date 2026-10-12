# Roteiro de apresentação — Projeto Barbearia

## Objetivo

Demonstrar uma plataforma full-stack para descoberta de barbearias, agendamento e administração por clientes, proprietários e profissionais, usando Java/Spring Boot, React/TypeScript e PostgreSQL.

**Duração sugerida:** 7 a 10 minutos. Use apenas dados fictícios do banco `projeto_barbearia_teste`. Não apresente senhas, tokens, variáveis de ambiente ou informações pessoais.

## Preparação

1. Verifique se o PostgreSQL está acessível na porta `5432`.
2. Confirme no log do backend que a conexão é `jdbc:postgresql://localhost:5432/projeto_barbearia_teste` e a porta é `8081`.
3. Inicie o Vite apontando `BARBEARIA_API_TARGET` para `http://localhost:8081`, na porta `5174`.
4. Separe contas fictícias autorizadas para cliente, proprietário e barbeiro; prepare as respectivas sessões sem expor credenciais na apresentação.
5. Se precisar demonstrar ações que modificam dados, utilize somente o banco de testes. Para dados que dependem do relógio, confira as datas antes da apresentação.

## 1. Página pública — cerca de 1 minuto

- Abra `http://127.0.0.1:5174/`.
- Mostre os destaques carregados da API: somente barbearias **ativas**, com localização, serviços e avaliações reais do banco.
- Clique em um cartão e apresente detalhes, horários, profissionais e serviços.
- Demonstre a pesquisa de barbearias. Não apresente o mapa ilustrativo como um mapa geográfico real.

## 2. Área do cliente — cerca de 1 a 2 minutos

- Entre com a conta fictícia de cliente.
- Mostre painel, favoritos, histórico e fluxo de agendamento.
- Explique validações: horário livre, disponibilidade do profissional, duração do serviço e intervalo de 15 minutos entre reservas.
- Se houver uma reserva futura adequada, apresente o cancelamento antes do início; evite cancelar dados preparados para outra etapa da demonstração.

## 3. Painel do proprietário — cerca de 2 a 3 minutos

- Abra `/proprietario` com uma conta de proprietário de demonstração.
- Mostre agenda, agendamentos, serviços, profissionais, promoções, fotos e ativação da barbearia.
- Use o seletor de unidades: compare uma barbearia ativa com a segunda unidade fictícia inativa.
- Mostre que os serviços e agendamentos são separados por unidade e que a seleção permanece após F5.
- Explique a regra de ativação: proprietário, endereço, funcionamento, barbeiro e serviço ativos.

## 4. Área do barbeiro — cerca de 1 minuto

- Com a conta de funcionário barbeiro, mostre agenda, serviços, disponibilidade e avaliações.
- Mostre que o funcionário não recebe os painéis de cliente e proprietário. A tentativa de abrir `/cadastrar-barbearia` redireciona para a área profissional.
- Com um proprietário também vinculado como barbeiro, mostre a possibilidade de alternar entre os três perfis.

## 5. Regras, segurança e tecnologia — cerca de 1 a 2 minutos

- Explique React + TypeScript, API Java/Spring Boot, Spring Security e persistência PostgreSQL.
- Mostre o histórico de commits no GitHub e a estrutura `backend/`, `frontend/`, `database/` e `docs/`.
- Cite a última suíte Java confirmada: **70 testes aprovados, 0 falhas**, além de lint e build frontend. O teste de concorrência é separado da suíte regular.
- Explique que o sistema usa sessões autenticadas, proteção CSRF e verificações de autorização no backend.
- Cite o teste de API: um barbeiro funcionário não consulta favoritos como cliente, enquanto um proprietário com perfil de cliente consegue consultar. Evite mostrar cookies de sessão ou senhas.

## Encerramento

A aplicação é uma demonstração local funcional para avaliação acadêmica e portfólio. Publicá-la como serviço aberto exigiria implantação, monitoramento, backups e testes adicionais de segurança/carga.

## Imagens recomendadas para o README ou portfólio

Quando for produzir as capturas, evite dados pessoais, e-mails, senhas e informações sensíveis. Sugestões de telas: Home com destaque real, detalhes da barbearia, agendamento do cliente, dashboard administrativo, seletor com duas unidades e dashboard do barbeiro. As capturas ainda precisam ser selecionadas e adicionadas ao repositório.
