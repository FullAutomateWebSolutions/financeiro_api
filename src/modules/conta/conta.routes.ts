import { FastifyInstance} from 'fastify';
import {ContaController } from '../conta/conta.controller';
export function contaRoutes(app: FastifyInstance) {
    const controller = new ContaController();
    
  app.get( '/', controller.findAll)
  app.get('/:id',controller.findById)
  app.post( '/',  controller.create)
  app.put( '/:id',  controller.update)
  app.delete('/:id',controller.delete)

}