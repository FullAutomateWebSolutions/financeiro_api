
import {BaseService} from '../shared/base/BaseService'
import { ContaRepository } from './conta.repository'
export class ContaService extends BaseService {
    constructor() {
        super(new ContaRepository() , 'codconta')
    }
}