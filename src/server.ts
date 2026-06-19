import 'dotenv/config';
import fastify from "fastify";
import cors from "@fastify/cors"; 
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { ZodError } from "zod";
import fastifyJwt from '@fastify/jwt';
import { categoriaRoutes } from "./modules/categoria/categoria.routes";
import { cartaoRoutes } from "./modules/cartao/cartao.routes";
import { contaRoutes } from "./modules/conta/conta.routes";
import { formaPagamentoRoute } from "./modules/forma-pagamento/formaPagamento.routes";
import { movimentacaoRoutes } from "./modules/movimentacao/movimentacao.routes";
import { statusRouter } from "./modules/status/status.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { usuarioRoutes } from "./modules/usuario/usuarioRoutes";

const app = fastify({
  logger: true,
  bodyLimit: 1024 * 1024,
  pluginTimeout: 120000,
});

const port = Number(process.env.PORT || 3001);

/* ==========================================
    GLOBAL ERROR HANDLER
========================================== */
app.setErrorHandler(
  async (error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        timestamp: new Date().toISOString(),
        status: 400,
        message: "Dados inválidos",
        path: request.url,
        errors: error.issues.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join(".") : null,
          message: issue.message,
          global: issue.path.length === 0,
        })),
      });
    }

    if (error.statusCode === 401) {
      return reply.status(401).send({
        timestamp: new Date().toISOString(),
        status: 401,
        message: error.message || "Não autorizado",
        path: request.url,
        errors: [],
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      timestamp: new Date().toISOString(),
      status: 500,
      message: error instanceof Error ? error.message : "Erro interno do servidor",
      path: request.url,
      errors: [],
    });
  }
);

async function start() {
  try {
    // 1. REGISTRAR O CORS PRIMEIRO (Evita bloqueios no navegador)
    await app.register(cors, {
      origin: "*", 
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });

    // 2. CONFIGURAR O @FASTIFY/JWT ( ESSENCIAL: DEVE VIR ANTES DAS ROTAS!)
    await app.register(fastifyJwt, {
      secret: process.env.JWT_SECRET || 'chave_secreta_reserva'
    });

    // 3. SWAGGER
    await app.register(swagger, {
      openapi: {
        info: {
          title: "FAWS - Financeiro Simples",
          description: "API de Gestão Financeira com isolamento por usuário (JWT)",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Insira o token JWT retornado no login para acessar as rotas protegidas.",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    });

    await app.register(swaggerUI, {
      routePrefix: "/docs",
    });

    app.get("/health", async () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }));

    /* ==========================================
        REGISTRO DAS ROTAS DO SISTEMA
    ========================================== */
    // Mudei o auth para cá, agora ele já enxerga o plugin do JWT carregado acima!
    await app.register(authRoutes, {
      prefix: "/auth",
    });
    
    await app.register(categoriaRoutes, {
      prefix: "/categoria",
    });

    await app.register(usuarioRoutes, {
      prefix: "/usuario",
    });

    await app.register(statusRouter, {
      prefix: "/status",
    });

    await app.register(cartaoRoutes, {
      prefix: "/cartao",
    });

    await app.register(contaRoutes, {
      prefix: "/conta",
    });

    await app.register(formaPagamentoRoute, {
      prefix: "/formaPagamento",
    });

    await app.register(movimentacaoRoutes, {
      prefix: "/movimentacao",
    });

    await app.listen({
      host: "0.0.0.0",
      port,
    });

    console.log(` Server running on http://localhost:${port}`);
    console.log(` Swagger available at http://localhost:${port}/docs`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();