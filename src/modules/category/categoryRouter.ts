import { FastifyInstance } from "fastify"
import {CategoriaController} from './category.controller';
import {CategoriaService } from './category.service';
export async function categoryRoutes(
  app: FastifyInstance,
) {
const controller = new CategoriaController(new CategoriaService())
app.get(
  '/ativas',
  controller.buscarAtivas,
)
}