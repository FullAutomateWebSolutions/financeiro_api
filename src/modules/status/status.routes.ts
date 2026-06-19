import {FastifyInstance} from 'fastify'
import { StatusController } from './status.controller'
import { StatusService } from './status.service';

export function statusRouter(app:FastifyInstance) {
    const service = new StatusService
    const controller = new StatusController(service);
        app.get( '/', controller.findAll)
        app.get('/:id',controller.findById)
        app.post( '/',  controller.create)
        app.put( '/:id',  controller.update)
        app.delete('/:id',controller.delete)
 
}