import { FastifyReply, FastifyRequest } from "fastify"
import { autenticarUsuario } from "../utils/autenticarUsuario";

export class BaseController {
  constructor(
    private service: any,
  ) { }

  findAll = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await autenticarUsuario(req, reply);
    if (!usuario) return;
    const data = await this.service.findAll()
    return reply.send(data)
  }

  findById = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await autenticarUsuario(req, reply);
    if (!usuario) return;
    const { id } = req.params as { id: unknown };
    const data = await this.service.findById(Number(id))
    return reply.send(data)
  }

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await autenticarUsuario(req, reply);
    if (!usuario) return;
    const data = await this.service.create(req.body)
    return reply.send(data)
  }

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await autenticarUsuario(req, reply);
    if (!usuario) return;
    const { id } = req.params as { id: unknown };
    const data = await this.service.update(Number(id), req.body)
    return reply.send(data)
  }

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const usuario = await autenticarUsuario(req, reply);
    if (!usuario) return;
    const { id } = req.params as { id: unknown };
    await this.service.delete(Number(id))
    return reply.status(204).send()
  }
}