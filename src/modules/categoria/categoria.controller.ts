import { FastifyReply, FastifyRequest } from 'fastify';
import {BaseController} from '../shared/base/BaseController';
import {CategoriaService} from './categoria.service';
import { autenticarUsuario } from '../shared/utils/autenticarUsuario';
export class CategoriaController extends BaseController
{
  constructor(
    private categoriaService = new CategoriaService(),
  ) {
    super(categoriaService)
  }

  buscarAtivas = async ( req: FastifyRequest, reply: FastifyReply ) => {
          // const body = created.parse(req.body);
    const usuario = await autenticarUsuario(req, reply);
    const result = await this.categoriaService.findAll(usuario?.codUsuario as number)
    return reply.send(result)
  }
}