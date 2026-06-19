import { FastifyInstance} from 'fastify';
import {ContaController } from '../conta/conta.controller';
import { ContaService } from './conta.service';
export function contaRoutes(app: FastifyInstance) {
    const service = new ContaService();
    const controller = new ContaController(service);
    
  app.get( '/', controller.findAll)
  // app.get( '/', controller.findAllAS)
  app.get('/:id',controller.findById)
  app.post( '/',  controller.create)
  app.put( '/:id',  controller.update)
  app.delete('/:id',controller.delete)

}