# LOGIN

Use essas contas para acessar o sistema após rodar o seed:

| Função        | Email            | Senha |
|---------------|------------------|-------|
| Administrador | admin@aero.com   | 123   |
| Engenheiro    | eng@aero.com     | 123   |
| Operador      | op@aero.com      | 123   |

## Como rodar :
Adicionar .env
  Exemplo:
  
    # Environment variables declared in this file are automatically made available to Prisma.
    # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema
    
    # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
    # See the documentation for all the connection string options: https://pris.ly/d/connection-strings
    
    DATABASE_URL="mysql://root:{senha}@localhost:3306/{database}"
    
## Instalar dependências:
    cd ./AV3
    npm install
    
    cd /AV3
    cd ./av3_teste
    npm install
## Como rodar o back:
    npx prisma db push
    npx prisma generate
    npm run seed
    npm run dev
## Como rodar o front (Em outro terminal):
    npm start
