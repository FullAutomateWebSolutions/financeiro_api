export class BaseRepository<T> {
  constructor(
    protected model: any,
  ) {}

  async findAll(codUsuario: number) {
    return this.model.findMany({
      where: {
        codUsuario,
      },
    })
  }

  async findById(id: number, field: string, codUsuario: number) {
    return this.model.findFirst({
      where: {
        [field]: id,
        codUsuario,
      },
    })
  }

  async create(data: T, codUsuario: number) {
    return this.model.create({
      data: {
        ...data,
        codUsuario,
      },
    })
  }

  async update(
    id: number,
    field: string,
    data: Partial<T>,
    codUsuario: number,
  ) {
    return this.model.updateMany({
      where: {
        [field]: id,
        codUsuario,
      },
      data,
    })
  }

  async delete(id: number, field: string, codUsuario: number) {
    return this.model.deleteMany({
      where: {
        [field]: id,
        codUsuario,
      },
    })
  }
}