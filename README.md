Dependências
npm install fastify
npm install @prisma/client
npm install zod
npm install dotenv

Dependências desenvolvimento
npm install -D typescript
npm install -D ts-node
npm install -D tsx
npm install -D prisma
npm install -D @types/node

Inicializar Typescript
npx tsc --init

Prisma
npx prisma init

.env

Prisma
npx prisma db pull
/* 
mudar o schema.prisma
para
generator client {
  provider = "prisma-client-js"
}

*/


e gerar o schema.
npx prisma generate

npm install @prisma/client @prisma/adapter-pg

/* --- PRISMA.TS
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from '../../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
/*/
-- npm install --save-dev prisma dotenv

mkdir src
cd src

ni server.ts -ItemType File

mkdir database
cd database
ni prisma.ts -ItemType File
cd ..

mkdir modules
cd modules

mkdir categoria
cd categoria
ni categoria.controller.ts -ItemType File
ni categoria.service.ts -ItemType File
ni categoria.repository.ts -ItemType File
ni categoria.routes.ts -ItemType File
ni categoria.schema.ts -ItemType File
cd ..

mkdir conta
mkdir cartao
mkdir forma-pagamento
mkdir movimentacao
mkdir shared

cd shared

mkdir base
cd base
ni BaseRepository.ts -ItemType File
ni BaseService.ts -ItemType File
ni BaseController.ts -ItemType File
cd ..

mkdir errors
mkdir middlewares
mkdir utils
mkdir routes

cd routes
ni index.ts -ItemType File
cd ..


/*
tsConfig.json 

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",

    "strict": true,
    "skipLibCheck": true,

    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  }
}

*/


npm install @fastify/swagger
npm install @fastify/swagger-ui


npx prisma db pull
npx prisma generate

npx prisma db pull --print

npm install zod-to-json-schema
npm install fastify-type-provider-zod
npm i @fastify/cors


npm install @fastify/jwt bcryptjs
npm install -D @types/bcryptjs
npm install @fastify/jwt

mkdir status
cd status
ni status.controller.ts -ItemType File
ni status.service.ts -ItemType File
ni status.repository.ts -ItemType File
ni status.routes.ts -ItemType File
ni status.schema.ts -ItemType File
cd ..

npm install bcryptjs
npm install --save-dev @types/bcryptjs
npm install bcrypt
npm i --save-dev @types/bcrypt
npm cache clean --force
npm install bcrypt --legacy-peer-deps

Faça uma requisição POST para http://localhost:3001/auth/register enviando nome, email e senha para criar seu usuário.
Faça uma requisição POST para http://localhost:3001/auth/login enviando o email e senha. A API irá te devolver um objeto contendo a propriedade token.
Copie esse texto do token. Quando for testar a listagem ou criação de movimentações, adicione o cabeçalho HTTP: Authorization: Bearer COLE_O_TOKEN_AQUI.

 npm i --save-dev @types/jsonwebtoken
 npm install dotenv

 ┌──────── minuto (0)
│ ┌────── hora (12)
│ │ ┌──── dia do mês (*)
│ │ │ ┌── mês (*)
│ │ │ │ ┌ dia da semana (*)
│ │ │ │ │
0 12 * * *