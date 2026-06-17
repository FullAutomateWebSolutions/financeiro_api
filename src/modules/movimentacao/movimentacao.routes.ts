
import { FastifyInstance } from 'fastify'
import { MovimentacaoController } from './movimentacao.controller'
import { createMovimentacaoSchema } from './dto/create-movimentacao.dto'
import { validateSchema } from '../shared/schema/validate-schema'
import { zodToJsonSchema } from 'zod-to-json-schema'

export async function movimentacaoRoutes(app: FastifyInstance) {
    const controller = new MovimentacaoController()

    app.get('/', controller.findAll)
    app.get('/:id', controller.findById)
    app.put(
        '/:id',
        controller.update,
    )

    app.delete(
        '/:id',
        controller.delete,
    )

    app.post(
        '/:id/finalizar',
        {
            schema: {
                tags: ['Movimentação'],
                 summary: 'Criar movimentação',
            }
        },
        controller.finalizar,
    )
app.get(
  "/view",
  controller.findAllView
);

    app.post(
        '/',
        {
            // schema: {
            //     tags: ['Movimentação'],
            //     summary: 'Criar movimentação',

            //     body: {
            //         type: 'object',
            //         required: [
            //             'datamov',
            //             'descmovimento',
            //             'valorunit',
            //             'codformpag',
            //             'codconta',
            //             'codstatus',
            //             'codcategoria',
            //         ],
            //         properties: {
            //             datamov: {
            //                 type: 'string',
            //                 format: 'date-time',
            //             },
            //             descmovimento: {
            //                 type: 'string',
            //             },
            //             valorunit: {
            //                 type: 'number',
            //             },
            //             porcjuros: {
            //                 type: 'number',
            //             },
            //             tipoparcelamento: {
            //                 type: 'integer',
            //             },
            //             qtdparcatual: {
            //                 type: 'integer',
            //             },
            //             qtdparcfinal: {
            //                 type: 'integer',
            //             },
            //             codformpag: {
            //                 type: 'integer',
            //             },
            //             codconta: {
            //                 type: 'integer',
            //             },
            //             codstatus: {
            //                 type: 'integer',
            //             },
            //             codcategoria: {
            //                 type: 'integer',
            //             },
            //             codcartao: {
            //                 type: 'integer',
            //             },
            //         },
            //     },

            //     response: {
            //         201: {
            //             type: 'object',
            //         },
            //     },
            // },

            preHandler: validateSchema(
                createMovimentacaoSchema,
            ),
        },
        controller.create,
    )
}
