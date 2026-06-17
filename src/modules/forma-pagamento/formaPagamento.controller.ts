import { BaseController } from "../shared/base/BaseController";
import { FormaPagamentoService } from "./formaPagamento.service";

export class FormaPagamentoController extends BaseController {
    constructor(
        private formaPagamentoService : FormaPagamentoService
    ) {
        super(formaPagamentoService)
    }
}