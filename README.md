# Projeto Barbearia

Plataforma web para encontrar barbearias, consultar serviços e realizar agendamentos.

Projeto acadêmico full-stack desenvolvido com Java, Spring Boot, React, TypeScript e PostgreSQL.

## Tecnologias utilizadas

- Backend: Java 25, Spring Boot 4.1.1, Spring Security e Spring Data JPA
- Frontend: React 19, TypeScript, Vite, React Router, Axios e CSS
- Banco de dados: PostgreSQL
- Testes: JUnit, Mockito e Spring Boot Test
- Versionamento: Git e GitHub

## Funcionalidades

### Clientes

- Cadastro e autenticação
- Busca de barbearias por localização
- Filtros de serviços e avaliações
- Consulta de serviços, barbeiros e horários
- Agendamento e cancelamento de atendimentos
- Avaliação de atendimentos concluídos
- Barbearias favoritas
- Consulta de promoções aplicadas ao agendamento

### Proprietários

- Painel administrativo
- Gerenciamento de serviços
- Gerenciamento de barbeiros
- Configuração de horários de funcionamento
- Gestão de agendamentos
- Cadastro de promoções
- Gerenciamento da galeria de fotos
- Consulta de avaliações

### Barbeiros

- Área autenticada
- Consulta da agenda
- Gerenciamento de atendimentos permitidos
- Configuração de disponibilidade
- Consulta de serviços e avaliações

## Principais regras de negócio

- Um barbeiro pertence a uma barbearia.
- Um proprietário pode possuir várias barbearias.
- Os serviços possuem preço e duração.
- Os barbeiros realizam somente serviços autorizados.
- Agendamentos respeitam a disponibilidade e os horários de funcionamento.
- Existe um intervalo obrigatório de 15 minutos entre atendimentos.
- O backend utiliza bloqueio transacional durante a criação dos agendamentos.
- Promoções válidas podem reduzir o preço dos serviços.
- Os valores são calculados pelo servidor.
- Fotos públicas são exibidas conforme sua ativação e ordem.
- Operações protegidas exigem autenticação e autorização.

## Estrutura do repositório

- backend/ - API Java e Spring Boot
- frontend/ - Aplicação React e TypeScript
- database/ - Scripts SQL e migrações
- docs/ - Documentação
- README.md - Apresentação do projeto

## Pré-requisitos

- JDK 25
- Maven
- Node.js e npm compatíveis com Vite 8
- PostgreSQL
- Git

## Configuração do banco de dados

O backend utiliza o banco projeto_barbearia.

O script SQL está localizado em database/projeto_barbearia.sql.

Migrações adicionais ficam em database/migrations/.

A aplicação utiliza o usuário PostgreSQL barbearia_app.

A variável de ambiente DB_PASSWORD deve conter a senha desse usuário.

Não publique credenciais reais no repositório.

## Executar o backend

Abra um terminal na pasta backend.

Configure a variável DB_PASSWORD no ambiente.

Execute:

    mvn spring-boot:run

Servidor: http://localhost:8080

## Executar o frontend

Abra outro terminal na pasta frontend.

Execute:

    npm ci
    npm run dev

Aplicação: http://localhost:5173

O Vite encaminha as chamadas /api para o backend.

## Executar os testes

Na pasta backend:

    mvn test

Na pasta frontend:

    npm run lint
    npm run build

## Imagens

As imagens locais ficam em frontend/public/imagens.

O proprietário cadastra URLs e organiza as fotografias.

A listagem e os detalhes das barbearias exibem as fotos públicas ativas.

## Segurança

A aplicação utiliza autenticação por sessão, proteção CSRF e verificações de autorização no backend.

As áreas de cliente, proprietário e barbeiro possuem rotas protegidas.

## Estado do projeto

Os principais fluxos estão implementados.

Estão pendentes testes finais de integração, concorrência real no PostgreSQL e revisão de segurança e apresentação.

## Repositório

https://github.com/Christopher-SNC/projeto-barbearia