import { FastifyReply, FastifyRequest } from 'fastify'
import { UsuarioService } from './usuario.service'
import { usuario_role } from '@prisma/client'
import { BaseController } from '../shared/base/BaseController';
import jwt from 'jsonwebtoken'; 

export class UsuarioController extends BaseController {
  constructor(
    private usuarioService = new UsuarioService(),
  ) {
    super(usuarioService)
  }
  
  private verificarAdmin(request: FastifyRequest, reply: FastifyReply): boolean {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            reply.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Token não fornecido ou inválido.'
            });
            return false;
        }

        const token = authHeader.split(' ')[1];
        
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
        }

        const decoded = jwt.verify(token, secretKey) as { role: string; codUsuario: number; email: string };

        if (decoded.role !== 'ADMIN') {
            reply.status(403).send({ 
                statusCode: 403, 
                error: 'Forbidden', 
                message: 'Apenas administradores podem gerenciar usuários.' 
            });
            return false;
        }
        
        return true;

    } catch (error) {
        reply.status(401).send({
            statusCode: 401,
            error: 'Unauthorized',
            message: 'Token inválido ou expirado.'
        });
        return false;
    }
  }

  findAllUser = async (request: FastifyRequest, reply: FastifyReply) => {

    if (!this.verificarAdmin(request, reply)) return;

    const result = await this.usuarioService.listAllUsers();
    return reply.send(result);
  }

  updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!this.verificarAdmin(request, reply)) return;

    const { id } = request.params as { id: string };
    const body = request.body as { nome?: string; email?: string; role?: usuario_role; indativo?: boolean };

    const result = await this.usuarioService.updateUser(Number(id), body);
    return reply.send(result);
  }

  deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!this.verificarAdmin(request, reply)) return;

    const { id } = request.params as { id: string };
    await this.usuarioService.deleteUser(Number(id));
    return reply.status(204).send();
  }
}