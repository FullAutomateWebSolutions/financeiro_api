
import {BaseService} from '../shared/base/BaseService';
import {StatusRepository } from './status.repository';

export class StatusService extends BaseService {
    constructor() {
        super(new StatusRepository(), 'codStatus')
    }
}