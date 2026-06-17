import fastify from "fastify";
// import cors from "@fastify/cors";
// import fastifyCookie from "@fastify/cookie";
// import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import path from "path";
import fastifyStatic from "@fastify/static";
import { categoriaRoutes } from "./modules/categoria/categoria.routes";
import { categoryRoutes } from "./modules/category/categoryRouter";
import { cartaoRoutes } from "./modules/cartao/cartao.routes";
import { contaRoutes } from "./modules/conta/conta.routes";
import { formaPagamentoRoute } from "./modules/forma-pagamento/formaPagamento.routes";
// import multipart from "@fastify/multipart"
/**npm install @fastify/swagger @fastify/swagger-ui */
// import { startCrons } from "../src/modules/ecommerce/cron/index";
// import { ILPNConsumer } from "./modules/ilpn/ilpn.consumer";
// import { rabbitmq } from './lib/rabbitmq'
// import sensible from '@fastify/sensible';


const port = parseInt(process.env.PORT || "3001", 10);

const app = fastify({
  logger: true,
  bodyLimit: 1048576,
  pluginTimeout: 120000,
});

// app.register(multipart, {
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB
//   }
// })
// app.register(sensible);

const start = async () => {
  try {
    // await app.register(cors);
    // await app.register(fastifyCookie);
    // await app.register(fastifyMultipart);
    // app.register(jwt, {
    //   secret: process.env.JWT_SECRET as string,
    // });

    /* ================= SWAGGER ================= */

    await app.register(swagger, {
      swagger: {
        info: {
          title:
            "FAWS - Financeiro Simples",
          description: "API gestão financeira simples dia a dia",
          version: "1.0.0",
        },
        consumes: ["application/json"],
        produces: ["application/json"],
      },
    });

    await app.register(swaggerUI, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false,
      },
    });

    //       app.register(fastifyStatic, {
    //     root: path.join(process.cwd(), "uploads"),
    //     prefix: "/uploads/"
    //   });

    /* ================= ROTAS SEM AUTH ================= */
//   app.addHook("onRequest", async (request, reply) => {
//   if (
    
//     // request.routerPath === "/payment/webhook" ||
//     // request.routerPath === "/auth/login" ||
//     // request.routerPath === "/empresas" ||
//     // request.routerPath === "/centro" ||
//     // request.routerPath === "/parceiro" ||
//     // request.routerPath === "/vendaCanal" ||
//     // request.routerPath === "/ilpn" ||
//     // request.routerPath?.startsWith("/docs")||
//     // request.routerPath?.startsWith("/centro")||
//     // request.routerPath?.startsWith("/parceiro")||
//     // request.routerPath?.startsWith("/vendaCanal")||
//     // request.routerPath?.startsWith("/empresas")||
//     // request.routerPath?.startsWith("/uploads/")||
//     // request.routerPath?.startsWith("/products/")||
//     // request.routerPath?.startsWith("/products")||
//     // request.routerPath?.startsWith("/banners")||
//     // request.routerPath?.startsWith("/promotion-products")||
//     // request.routerPath?.startsWith("/ilpn")||

//     // request.routerPath?.startsWith("/workarea")||
//     // request.routerPath?.startsWith("/pathwaytype")||
//     // request.routerPath?.startsWith("/warehouse")||
//     // request.routerPath?.startsWith("/workgroup")||
//     // request.routerPath?.startsWith("/locations")||
//     // request.routerPath?.startsWith("/location-masks")
//   ) {
//     return;
//   }

// //   await request.jwtVerify();
// });
   
    /* ================= ROTAS COM AUTH ================= */

    // app.register(empresaRoutes, { prefix: "/empresas" });
    // app.register(centroRoutes, { prefix: "/centro" });
    // app.register(parceiroRoutes, { prefix: "/parceiro" });
    // app.register(vendaCanalRoutes, { prefix: "/vendaCanal" });
    // app.register(productRoutes, { prefix: "/products" });
    // app.register(bannerRoutes, { prefix: "/banners" });
    // app.register(promotionsRoutes, { prefix: "/promotion-products" });
    // app.register(ilpnRoutes);
    // /**======================= WMS ROTAS================ */

    app.register(categoriaRoutes, { prefix: "/categoria" });
    app.register(cartaoRoutes, { prefix: "/cartao" });
    app.register(contaRoutes, { prefix: "/conta" });
    app.register(formaPagamentoRoute, { prefix: "/formaPagamento" });
    
    
    // app.register(pathwayTypeRoutes, { prefix: "/pathwaytype"});
    // app.register(warehouseRoutes, { prefix: "/warehouse" });
    // app.register(WorkgroupRoutes, { prefix: "/workgroup" });
    // app.register(locationRoutes, { prefix: "/locations" });
    // app.register(locationMaskRoutes, { prefix: "/location-masks" });

    // app.register(authRoutes, { prefix: "/auth" });
    // app.register(productRoutes, { prefix: "/products" });
    // app.register(orderRoutes, { prefix: "/orders" });
    // app.register(paymentRoutes, { prefix: "/payment" });
    app.get("/health", async () => {
      return { status: "ok" };
    });
    //  startCrons();
  

    // await rabbitmq.connect();
    // const consumer = new ILPNConsumer(rabbitmq);
    // await consumer.start();

    await app.listen({ port, host: "0.0.0.0" });
    await app.ready();
    // https://abc123.ngrok.io/payment/webhook
    ///ngrok http 3001

    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger available at http://localhost:${port}/docs`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
