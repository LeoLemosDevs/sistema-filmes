# Filmes Stream - Backend API

Esta é a API do projeto Filmes Stream, construída com Node.js, Express, TypeScript e PostgreSQL.

## 1. Pré-requisitos
- **Node.js** (v18+)
- **PostgreSQL** rodando localmente.

## 2. Configuração do Banco de Dados PostgreSQL Local

1. Abra seu cliente SQL (psql, DBeaver, pgAdmin) e crie o banco de dados:
   ```sql
   CREATE DATABASE filmes_stream;
   ```
2. *(Opcional)* Você pode criar um usuário para a aplicação caso não deseje usar o usuário `postgres` padrão.

## 3. Criação das Tabelas e Dados Iniciais (Seed)

Dentro da pasta `database/`, existem scripts prontos. Rode os comandos abaixo no seu terminal (ajuste o usuário caso não seja `postgres`):

1. **Criação das Tabelas (DDL):**
   ```bash
   psql -U postgres -d filmes_stream -f database/schema.sql
   ```
2. **População de Dados Iniciais (Seed):**
   ```bash
   psql -U postgres -d filmes_stream -f database/seed.sql
   ```

## 4. Instalação e Execução da API

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` na raiz do backend baseado no arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Preencha as variáveis do banco de dados (`DB_USER`, `DB_PASSWORD`, etc) no seu `.env`.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A API estará rodando em `http://localhost:5000`. Acesse `http://localhost:5000/api/health` para validar se o servidor e o banco conectaram com sucesso!

## 5. Scripts NPM
- `npm run dev`: Executa a aplicação usando `ts-node-dev` com hot-reload.
- `npm run build`: Compila o TypeScript gerando a pasta `/dist`.
- `npm start`: Inicia o servidor a partir da build em produção (`node dist/server.js`).
