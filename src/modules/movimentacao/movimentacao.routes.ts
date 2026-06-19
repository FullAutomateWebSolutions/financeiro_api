// movimentacao.routes.ts

import { FastifyInstance } from 'fastify'
import { MovimentacaoController } from './movimentacao.controller'
import { createMovimentacaoSchema } from './dto/create-movimentacao.dto'
import { validateSchema } from '../shared/schema/validate-schema'

export async function movimentacaoRoutes(app: FastifyInstance) {
    const controller = new MovimentacaoController()
    app.get('/', controller.findAll)
    app.get('/view', controller.findAllView)
    app.get('/:id', controller.findById)

    // Rota de Criação com Validação do Schema Zod via preHandler
    app.post(
        '/',
        {
            preHandler: validateSchema(createMovimentacaoSchema),
        },
        controller.create,
    )
    app.put('/:id', controller.update)
    app.delete('/:id', controller.delete)
    app.post(
        '/:id/finalizar',
        {
            schema: {
                tags: ['Movimentação'],
                summary: 'Finalizar uma movimentação existente',
            }
        },
        controller.finalizar,
    )
}