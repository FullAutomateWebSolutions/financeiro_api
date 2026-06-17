import { FastifyInstance } from 'fastify';
import { FormaPagamentoController } from './formaPagamento.controller';
import { FormaPagamentoService } from './formaPagamento.service';
export function formaPagamentoRoute(app: FastifyInstance) {
    const service = new FormaPagamentoService();
    const controller = new FormaPagamentoController(service);
    app.get('/', controller.findAll)
    app.get('/:id', controller.findById)
    app.post('/', controller.create)
    app.put('/:id', controller.update)
    app.delete('/:id', controller.delete)


}