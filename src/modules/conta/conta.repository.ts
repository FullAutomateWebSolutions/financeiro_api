import { prisma } from '../../database/prisma';
import {BaseRepository} from '../shared/base/BaseRepository';

export class ContaRepository  extends BaseRepository<any>{
    constructor() {
        super(new BaseRepository(prisma.conta))
    }
}