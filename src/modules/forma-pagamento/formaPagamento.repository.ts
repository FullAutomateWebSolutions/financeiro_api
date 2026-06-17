import { BaseRepository} from '../shared/base/BaseRepository';
import { prisma } from '../../database/prisma'
export class FormaPagamentoRepository extends BaseRepository<any> {
    constructor() {
        super(prisma.formapagamento)
    }
}