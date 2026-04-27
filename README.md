# Finance API

API REST desenvolvida para servir como backend de um sistema financeiro em React, com foco em estudo completo de arquitetura backend, organização em camadas, validações, documentação e integração direta com banco de dados.

O projeto foi construído utilizando Node.js, Express e PostgreSQL, sem o uso de ORM. Toda a comunicação com o banco de dados é feita por SQL puro através de uma pool de conexões, proporcionando maior controle sobre as queries, migrations e fluxo de persistência dos dados.

## Objetivo

Esta API tem como objetivo gerenciar usuários, transações financeiras e saldo do usuário, permitindo o controle de receitas, despesas e investimentos.

## Principais funcionalidades

- CRUD de usuários
- CRUD de transações financeiras
- Consulta de saldo por usuário
- Classificação de transações por tipo:
  - EARNING
  - EXPENSE
  - INVESTMENT
- Validação de dados de entrada
- Tratamento padronizado de erros
- Documentação interativa com Swagger
- Conexão com PostgreSQL via Pool
- Migrations com SQL puro
- Configuração de ESLint, Prettier, Husky, lint-staged e Commitlint

## Arquitetura do projeto

O projeto foi organizado em camadas para separar responsabilidades e facilitar a manutenção:

- `index.js`: inicializa a aplicação e define a porta de execução.
- `app.js`: centraliza middlewares e rotas principais da API.
- `routes`: organiza os endpoints disponíveis.
- `factories`: instancia controllers, use cases e repositories.
- `controllers`: recebe as requisições HTTP e faz a primeira camada de tratamento.
- `helpers`: concentra validações, respostas de sucesso e erros padronizados.
- `use-cases`: contém as regras de negócio da aplicação.
- `repositories`: realiza a comunicação direta com o banco de dados PostgreSQL.
- `database`: armazena configurações de conexão, pool e migrations.

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- SQL puro
- Swagger
- Validator
- Bcrypt
- Dotenv
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint