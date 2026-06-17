
import {BaseController} from '../shared/base/BaseController';
import { CartaoService } from './cartao.service';

export class CartaoController extends  BaseController {
    
  constructor(
    private cartaoService: CartaoService,
  ) {
    super(cartaoService)
  }

  
}