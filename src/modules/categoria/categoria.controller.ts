import { FastifyReply, FastifyRequest } from 'fastify';
import {BaseController} from '../shared/base/BaseController';
import {CategoriaService} from './categoria.service';
export class CategoriaController extends BaseController
{
  constructor(
    private categoriaService = new CategoriaService(),
  ) {
    super(categoriaService)
  }

  buscarAtivas = async ( req: FastifyRequest, reply: FastifyReply ) => {
    const result = await this.categoriaService.findAll()
    return reply.send(result)
  }
}