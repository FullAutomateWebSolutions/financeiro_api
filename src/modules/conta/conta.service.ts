
import {BaseService} from '../shared/base/BaseService'
import { ContaRepository } from './conta.repository'
export class ContaService extends BaseService {
    private contaRepository = new ContaRepository();

    constructor() {
        super(new ContaRepository(), 'codconta');
    }

    findAllA(): Promise<any> {
        return this.contaRepository.findAllA();
    }
}