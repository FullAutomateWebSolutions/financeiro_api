
import { FastifyReply, FastifyRequest } from 'fastify';
import {BaseController} from '../shared/base/BaseController';
import { CartaoService } from './cartao.service';
import { created } from './cartao.schema';

export class CartaoController extends  BaseController {
    
  constructor(
    private cartaoService: CartaoService,
  ) {
    super(cartaoService)
  }

   criar = async ( req: FastifyRequest, reply: FastifyReply ) => {
     const body = created.parse(req.body);
      // const body = z.array(updateLocationSchema).parse(request.body);
    const result = await this.cartaoService.create(body)
    return reply.send(result)
  }
  
}