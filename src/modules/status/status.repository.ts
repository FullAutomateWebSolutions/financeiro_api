
import {BaseRepository} from '../shared/base/BaseRepository';
import {prisma } from '../../database/prisma'

export class StatusRepository extends BaseRepository<any> {
    constructor() {
        super(prisma.status)
    }
}