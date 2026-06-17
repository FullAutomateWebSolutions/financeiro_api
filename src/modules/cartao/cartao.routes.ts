
import { FastifyInstance } from 'fastify';
import { CartaoController } from '../cartao/cartao.controller';
import { CartaoService } from '../cartao/cartao.service';

export function cartaoRoutes(app: FastifyInstance) {
  const service = new CartaoService()
  const controller = new CartaoController(service)

  app.get('/', controller.findAll)
  app.get('/:id', controller.findById)
  app.post('/', controller.create)
  app.put('/:id', controller.update)
  app.delete('/:id', controller.delete)
}