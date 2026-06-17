import { FastifyInstance } from "fastify"
import { CategoriaController } from "./categoria.controller"
import { CategoriaRepository } from "./categoria.repository"
import { CategoriaService } from "./categoria.service"

export async function categoriaRoutes(app : FastifyInstance) {
  const repository = new CategoriaRepository()
  const service = new CategoriaService(repository)
  const controller = new CategoriaController(service)

  app.get('/', controller.findAll.bind(controller))
  app.post('/', controller.create.bind(controller))
}