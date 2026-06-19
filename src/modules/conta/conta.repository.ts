import { prisma } from '../../database/prisma';
import {BaseRepository} from '../shared/base/BaseRepository';

export class ContaRepository  extends BaseRepository<any>{
    constructor() {
          super(prisma.conta)
    }
    findAllA(): Promise<any> {
        return prisma.conta.findMany()
    }
}