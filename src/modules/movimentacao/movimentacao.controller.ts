
import { FastifyReply, FastifyRequest } from 'fastify'
import { MovimentacaoService } from './movimentacao.service'
import { createMovimentacaoSchema } from './dto/create-movimentacao.dto'

export class MovimentacaoController {
    constructor(
        private service = new MovimentacaoService(),
    ) { }

    create = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const result = await this.service.create(request.body)
        return reply.status(201).send(result)
    }

    update = async (
        request: any,
        reply: FastifyReply,
    ) => {
        const data = createMovimentacaoSchema.parse(request.body)

        const result = await this.service.update(
            request.params.id,
            data,
        )

        return reply.send(result)
    }

    findAll = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const {
                page,
                size,
                sort,
                descmovimento,
                categoria,
                conta
            } = request.query as any;

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
            throw error;
        }
    }

    findById = async (
        request: any,
        reply: FastifyReply,
    ) => {
        const result = await this.service.findById(request.params.id)
        return reply.send(result)
    }

    delete = async (
        request: any,
        reply: FastifyReply,
    ) => {
        try {
            await this.service.delete(request.params.id)
            return reply.status(204).send()
        } catch (error: any) {
            if (error.message.includes('Impossível deletar')) {
                return reply.status(404).send({
                    statusCode: 404,
                    error: 'Not Found',
                    message: error.message
                })
            }


            throw error;
        }
    }

    finalizar = async (
        request: any,
        reply: FastifyReply,
    ) => {
        const result = await this.service.finalizar(request.params.id)
        return reply.send(result)
    }

    findAllView = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const result = await this.service.findAllView()
        return reply.send(result)
    }
}

