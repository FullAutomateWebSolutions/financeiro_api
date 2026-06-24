import { BaseService } from "../shared/base/BaseService";
import { FormaPagamentoRepository } from "./formaPagamento.repository";

export class FormaPagamentoService extends BaseService {
    constructor() {
      super(new FormaPagamentoRepository , 'codFormPag')  
    }
}