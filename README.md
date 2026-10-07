# Meu Financeiro

Base inicial de uma aplicação web responsiva para gestão financeira pessoal, construída com Next.js, TypeScript, App Router e Tailwind CSS.

## Requisitos

- Node.js 20.9 ou superior
- npm

## Desenvolvimento local

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## PostgreSQL e Prisma

O projeto usa Prisma ORM 7 com PostgreSQL. Para habilitar a persistência local:

1. Instale e inicie um servidor PostgreSQL local.
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` com a conexão do seu PostgreSQL.
3. Defina `DEMO_USER_ID` com um identificador estável para o usuário local. Esse identificador isola as contas, categorias e movimentações até que exista autenticação.
4. Valide o schema e gere o cliente com `npm run db:validate` e `npm run db:generate`.
5. Quando estiver pronto para criar as tabelas no banco configurado, execute `npm run db:migrate`. Esse comando aplica a migração inicial e altera o banco indicado por `DATABASE_URL`.

O arquivo `prisma/migrations/20261006000000_initial/migration.sql` contém a migração inicial. Ela foi gerada a partir do schema sem conectar a um banco; nenhum banco foi criado ou alterado durante esta etapa.

Sem `DATABASE_URL` e `DEMO_USER_ID`, o dashboard continua exibindo os dados fictícios e o cadastro informa que a persistência não está configurada. Os valores monetários são armazenados no PostgreSQL como `Decimal(14,2)`.

## Comandos disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run lint`: verifica o código com ESLint.
- `npm run build`: gera a versão de produção.
- `npm run start`: inicia o servidor de produção após `npm run build`.
