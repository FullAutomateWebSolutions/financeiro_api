import { BaseController } from '../shared/base/BaseController'
import { ContaService } from './conta.service'

export class ContaController extends BaseController {
    constructor(
        private contaService = ContaService,
    ) {
        super(contaService)
    }
}