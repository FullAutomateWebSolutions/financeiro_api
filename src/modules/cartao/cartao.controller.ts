import { CategoriaService } from '../category/category.service';
import {BaseController} from '../shared/base/BaseController';

export class CartaoController extends  BaseController {
    
  constructor(
    private categoriaService: CategoriaService,
  ) {
    super(categoriaService)
  }

  
}