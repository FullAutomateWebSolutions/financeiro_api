import { CartaoRepository } from "./cartao.repository";
import {BaseService} from '../shared/base/BaseService';
export class CartaoService extends BaseService  {
    constructor() {
        super(new CartaoRepository(),'codcartao')
    }

}