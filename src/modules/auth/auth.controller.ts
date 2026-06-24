import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { RegisterDTO, LoginDTO } from './dto/auth.dto'
import jwt from 'jsonwebtoken'; 

export class AuthController {
  private service = new AuthService()

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as RegisterDTO
    try {
      const result = await this.service.register(body)
      return reply.status(201).send(result)
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  }

login = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = request.body as LoginDTO
  try {
    const user = await this.service.login(body)

    const secretKey = process.env.JWT_SECRET || 'chave_secreta_reserva';

    const token = jwt.sign(
      {
        codUsuario: user.codUsuario,
        email: user.email,
        role: user.role
      }, 
      secretKey,
      { expiresIn: '1d' }
    )

    return reply.send({ user, token })
  } catch (error: any) {
    return reply.status(401).send({ error: error.message })
  }
}
}