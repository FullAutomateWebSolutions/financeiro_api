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




cd cartao
ni cartao.controller.ts -ItemType File
ni cartao.service.ts -ItemType File
ni cartao.repository.ts -ItemType File
ni cartao.routes.ts -ItemType File
ni cartao.schema.ts -ItemType File
cd ..
