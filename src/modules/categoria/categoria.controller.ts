import { CategoriaService } from "./categoria.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class CategoriaController {
    constructor(
        private service: CategoriaService,
    ) { }

    async create(
        req: FastifyRequest, reply: FastifyReply
    ) {
        const result = await this.service.create(req.body)

        return reply.send(result)
    }

    async findAll(request: FastifyRequest<{ Body: CategoriaService }>,
        reply: FastifyReply,
    ) {
        const result = await this.service.findAll()

        return reply.send(result)
    }
}