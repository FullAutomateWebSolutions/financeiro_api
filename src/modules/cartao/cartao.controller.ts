
import { FastifyReply, FastifyRequest } from 'fastify';
import {BaseController} from '../shared/base/BaseController';
import { CartaoService } from './cartao.service';
import { created } from './cartao.schema';
import { autenticarUsuario } from '../shared/utils/autenticarUsuario';

export class CartaoController extends  BaseController {
    
  constructor(
    private cartaoService: CartaoService,
  ) {
    super(cartaoService)
  }

   criar = async ( req: FastifyRequest, reply: FastifyReply ) => {
      const body = created.parse(req.body);
       const usuario = await autenticarUsuario(req, reply);
       if (!usuario) return;
    const result = await this.cartaoService.create(body, usuario.codUsuario)
    return reply.send(result)
  }
  
}