import { FastifyInstance } from 'fastify'
import { AuthController } from './auth.controller'
import { registerSchema, loginSchema } from './dto/auth.dto'
import { validateSchema } from '../shared/schema/validate-schema'

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController()

  app.post(
    '/register',
    { preHandler: validateSchema(registerSchema) },
    controller.register
  )

  app.post(
    '/login',
    { preHandler: validateSchema(loginSchema) },
    controller.login
  )
}