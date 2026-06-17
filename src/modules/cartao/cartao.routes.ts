
import { FastifyInstance } from 'fastify';
import { CartaoController} from '../cartao/cartao.controller';
import { CategoriaService } from '../category/category.service';

export function cartaoRoutes( app : FastifyInstance) {
    const controller = new CartaoController(new CategoriaService);
  app.get( '/', controller.findAll)
  app.get('/:id',controller.findById)
  app.post( '/',  controller.create)
  app.put( '/:id',  controller.update)
  app.delete('/:id',controller.delete)
}