import fastify from "fastify";
import cors from "@fastify/cors"; // 1. IMPORTAR O PLUGIN
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { ZodError } from "zod";

import { categoriaRoutes } from "./modules/categoria/categoria.routes";
import { cartaoRoutes } from "./modules/cartao/cartao.routes";
import { contaRoutes } from "./modules/conta/conta.routes";
import { formaPagamentoRoute } from "./modules/forma-pagamento/formaPagamento.routes";
import { movimentacaoRoutes } from "./modules/movimentacao/movimentacao.routes";

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
    // 2. REGISTRAR O CORS LOGO NO INÍCIO DO START
    await app.register(cors, {
      origin: "*", // Em desenvolvimento você pode usar '*', mas em produção mude para a URL do seu front
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });

    await app.register(swagger, {
      openapi: {
        info: {
          title: "FAWS - Financeiro Simples",
          description: "API de Gestão Financeira",
          version: "1.0.0",
        },
      },
    });

    await app.register(swaggerUI, {
      routePrefix: "/docs",
    });

    app.get("/health", async () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }));

    await app.register(categoriaRoutes, {
      prefix: "/categoria",
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