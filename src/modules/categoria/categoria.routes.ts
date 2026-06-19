import { FastifyInstance } from "fastify"
import {CategoriaController} from './categoria.controller';
import {CategoriaService } from './categoria.service';
export async function categoriaRoutes(
  app: FastifyInstance,
) {
  const controller = new CategoriaController()
        app.get( '/', controller.findAll)
        app.get('/:id',controller.findById)
        app.post( '/',  controller.create)
        app.put( '/:id',  controller.update)
        app.delete('/:id',controller.delete)
}