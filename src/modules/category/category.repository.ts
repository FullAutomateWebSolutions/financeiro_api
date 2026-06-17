import { prisma } from '../../database/prisma'
import { BaseRepository } from '../shared/base/BaseRepository';

export class CategoriaRepository extends BaseRepository<any>
{
  constructor() {
    super(prisma.categoria)
  }

  async findByDescricao(
    descricao: string,
  ) {
    return this.model.findFirst({
      where: {
        descCategoria: descricao,
      },
    })
  }
}