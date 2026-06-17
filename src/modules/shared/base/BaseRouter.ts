import { FastifyInstance } from 'fastify'

export class BaseRouter {
  constructor(
    private app: FastifyInstance,
    private controller: any,
  ) {}

  register() {
    this.app.get(
      '/',
      this.controller.findAll,
    )

    this.app.get(
      '/:id',
      this.controller.findById,
    )

    this.app.post(
      '/',
      this.controller.create,
    )

    this.app.put(
      '/:id',
      this.controller.update,
    )

    this.app.delete(
      '/:id',
      this.controller.delete,
    )
  }
}