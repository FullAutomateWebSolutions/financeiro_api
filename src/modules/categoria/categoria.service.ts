import { BaseService } from '../shared/base/BaseService'
import {CategoriaRepository  } from './categoria.repository'

export class CategoriaService
extends BaseService
{
  private categoriaRepository =  new CategoriaRepository();

  constructor() {
    super( new CategoriaRepository(), 'codcategoria' )
  }
}