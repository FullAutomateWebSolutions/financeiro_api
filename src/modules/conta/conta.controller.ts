import { FastifyRequest, FastifyReply } from 'fastify'
import { BaseController } from '../shared/base/BaseController'
import { ContaService } from './conta.service'

export class ContaController extends BaseController {
    constructor(
        private contaService : ContaService,
    ) {
        super(contaService)
    }
 
findAllAS = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const result = await this.contaService.findAllA();

    return reply.status(200).send(result);
}
}