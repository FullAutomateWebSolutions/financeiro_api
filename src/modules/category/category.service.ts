import { BaseService } from '../shared/base/BaseService'
import {CategoriaRepository  } from './category.repository'

export class CategoriaService
extends BaseService
{
  private categoriaRepository =
    new CategoriaRepository()

  constructor() {
    super( new CategoriaRepository(), 'codCategoria', )
  }

  async create(data: any) {
    const existe = await this.categoriaRepository .findByDescricao( data.descCategoria )
    if (existe) {
      throw new Error(
        'Categoria já existe',
      )
    }

    return super.create(data)
  }
}