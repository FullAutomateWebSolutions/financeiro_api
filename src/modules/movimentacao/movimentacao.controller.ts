// movimentacao.controller.ts

import {
    FastifyReply,
    FastifyRequest,
} from 'fastify'

import { MovimentacaoService } from './movimentacao.service'

import {
    createMovimentacaoSchema,
} from './dto/create-movimentacao.dto'
import { validate } from '../shared/schema/validation'

export class MovimentacaoController {
    constructor(
        private service =
            new MovimentacaoService(),
    ) { }

    create = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const result = await this.service.create(
            request.body,
        )

        return reply.status(201).send(result)
    }

    //    create = async (
    //   request: FastifyRequest,
    //   reply: FastifyReply,
    // ) => {
    //   const validation = validate(
    //     createMovimentacaoSchema,
    //     request.body,
    //   )

    //   if (!validation.success) {
    //     return reply.status(400).send({
    //       message: 'Dados inválidos',
    //       errors: validation.errors,
    //     })
    //   }

    //   const result = await this.service.create(
    //     validation.data,
    //   )

    //   return reply.status(201).send(result)
    // }
    update = async (
        request: any,
        reply: FastifyReply,
    ) => {
        const data =
            createMovimentacaoSchema.parse(
                request.body,
            )

        const result =
            await this.service.update(
                Number(request.params.id),
                data,
            )

        return reply.send(result)
    }

 findAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Captura os parâmetros da URL do Postman ou Front-end
      const { 
        page, 
        size, 
        sort, 
        descmovimento, 
        categoria, 
        conta 
      } = request.query as any;

      // 2. Passa os filtros convertendo para número o que for ID
      const result = await this.service.findAll({
        page: page ? Number(page) : 0,
        size: size ? Number(size) : 10,
        sort: sort,
        descmovimento: descmovimento,
        codcategoria: categoria ? Number(categoria) : undefined,
        codconta: conta ? Number(conta) : undefined,
      });

      return reply.status(200).send(result);
    } catch (error) {
      // Repassa para o seu Error Handler global do Fastify
      throw error; 
    }
  }

    findById = async (
        request: any,
        reply: FastifyReply,
    ) => {
        const result =
            await this.service.findById(
                Number(request.params.id),
            )

        return reply.send(result)
    }

    delete = async (
        request: any,
        reply: FastifyReply,
    ) => {
        await this.service.delete(
            Number(request.params.id),
        )

        return reply
            .status(204)
            .send()
    }

    finalizar = async (
        request: any,
        reply: FastifyReply,
    ) => {
        const result =
            await this.service.finalizar(
                Number(request.params.id),
            )

        return reply.send(result)
    }
    findAllView = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const result =
        await this.service.findAllView()
 return result
    // return reply.send(
    //     result.map((item: any) => ({
    //         ...item,
    //         codmovimentacao:
    //             item.codmovimentacao?.toString(),
    //     })),
    // )
}
}