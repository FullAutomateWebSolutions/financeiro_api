import { FastifyInstance } from 'fastify'


export async function registerRoutes(
  app: FastifyInstance,
) {
  app.register(categoriaRoutes, {
    prefix: '/categoria',
  })

  app.register(contaRoutes, {
    prefix: '/conta',
  })

  app.register(cartaoRoutes, {
    prefix: '/cartao',
  })

  app.register(formaPagamentoRoutes, {
    prefix: '/forma-pagamento',
  })

  app.register(statusRoutes, {
    prefix: '/status',
  })

  app.register(movimentacaoRoutes, {
    prefix: '/movimentacao',
  })
}