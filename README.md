# Finance API

API REST desenvolvida para servir como backend de um sistema financeiro em React, com foco em arquitetura backend, organização em camadas, autenticação, validações, documentação e integração direta com banco de dados PostgreSQL.

O projeto foi construído utilizando Node.js, Express e PostgreSQL, sem o uso de ORM. Toda a comunicação com o banco de dados é realizada através de SQL puro utilizando Pool de conexões, proporcionando maior controle sobre queries, migrations e persistência de dados.

---

# Objetivo

A API tem como objetivo gerenciar usuários, transações financeiras e saldo consolidado do usuário, permitindo o controle completo de:

- receitas
- despesas
- investimentos

Além disso, o projeto busca aplicar boas práticas de desenvolvimento backend, separação de responsabilidades, autenticação JWT e padronização de respostas HTTP.

---

# Principais funcionalidades

## Usuários

- Cadastro de usuários
- Login de usuários
- Consulta de usuário por login
- Senhas criptografadas com Bcrypt

---

## Autenticação

- Autenticação com JWT
- Access Token
- Refresh Token
- Middleware de autorização para rotas privadas
- Captura automática do `userId` através do token autenticado

---

## Transações financeiras

- Criação de transações
- Atualização de transações
- Remoção de transações
- Consulta de transações por usuário
- Filtro por período:
  - `from`
  - `to`

---

## Saldo do usuário

- Consulta de saldo consolidado
- Soma de:
  - ganhos
  - gastos
  - investimentos
- Percentual financeiro por categoria
- Filtro de saldo por período
  - `from`
  - `to`

---

## Validações

- Validação de e-mail
- Validação de senha
- Validação de UUID
- Validação de datas (`YYYY-MM-DD`)
- Validação de valores monetários
- Validação de campos obrigatórios
- Validação de tipos de transação

---

## Tratamento de erros

- Respostas HTTP padronizadas
- Errors customizados
- Middleware de autenticação
- Tratamento centralizado de validações

---

## Documentação

- Swagger/OpenAPI
- Rotas documentadas
- Exemplos de request e response

---

# Arquitetura do projeto

O projeto foi organizado em camadas para separar responsabilidades e facilitar manutenção, escalabilidade e reutilização de código.

## Estrutura

- `index.js`
  - Inicializa a aplicação e define a porta do servidor.

- `app.js`
  - Centraliza middlewares globais e rotas principais.

- `routes`
  - Organiza os endpoints da aplicação.

- `middlewares`
  - Responsável pelos middlewares da aplicação, como autenticação JWT.

- `factories`
  - Responsável por instanciar controllers, use-cases, repositories, adapters e helpers.

- `controllers`
  - Recebem as requisições HTTP e fazem a primeira camada de tratamento.

- `helpers`
  - Centralizam validações, respostas padronizadas e regras reutilizáveis.

- `adapters`
  - Responsáveis por abstrair bibliotecas externas e serviços da aplicação, como:
    - JWT
    - Bcrypt
    - Crypto

- `use-cases`
  - Contêm as regras de negócio da aplicação.

- `repositories`
  - Responsáveis pela comunicação direta com o PostgreSQL.

- `database`
  - Configuração de conexão, pool e migrations SQL.

- `errors`
  - Errors customizados da aplicação.

---

# Tecnologias utilizadas

## Backend

- Node.js
- Express.js
- PostgreSQL
- SQL puro

---

## Segurança

- JWT
- Bcrypt
- Crypto

---

## Validações

- Validator

---

## Configuração

- Dotenv

---

## Documentação

- Swagger

---

## Qualidade de código

- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint

---

# Autenticação

As rotas privadas utilizam autenticação JWT através do header:

```http
Authorization: Bearer TOKEN
```
