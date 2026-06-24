import { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken'; 

interface Decoded {
  role: string;
  codUsuario: number;
  email: string;
}

export class BaseController {
  constructor(
    private service: any,
  ) { }

  private autenticarUsuario = async (request: FastifyRequest, reply: FastifyReply): Promise<Decoded | null> => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Token não fornecido ou inválido.'
        });
        return null;
      }

      const token = authHeader.split(' ')[1];
      const secretKey = process.env.JWT_SECRET || 'chave_secreta_reserva';

      const decoded = jwt.verify(token, secretKey) as Decoded;
      return decoded;

    } catch (error) {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Token inválido ou expirado.'
      });
      return null;
    }
  }


  findAll = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await this.autenticarUsuario(req, reply);
    if (!usuario) return; 
    
    const data = await this.service.findAll(usuario.codUsuario);
    return reply.send(data);
  }

  findById = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await this.autenticarUsuario(req, reply);
    if (!usuario) return;
    
    const { id } = req.params as { id: unknown };
    const data = await this.service.findById(Number(id), usuario.codUsuario);
    return reply.send(data);
  }

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await this.autenticarUsuario(req, reply);
    if (!usuario) return;
    
    const data = await this.service.create(req.body, usuario.codUsuario);
    return reply.send(data);
  }

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await this.autenticarUsuario(req, reply);
    if (!usuario) return;
    
    const { id } = req.params as { id: unknown };
    const data = await this.service.update(Number(id), req.body, usuario.codUsuario);
    return reply.send(data);
  }

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await this.autenticarUsuario(req, reply);
    if (!usuario) return;
    
    const { id } = req.params as { id: unknown };
    await this.service.delete(Number(id), usuario.codUsuario);
    return reply.status(204).send();
  }
}