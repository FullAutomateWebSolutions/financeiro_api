
export class BaseRepository<T> {
  constructor(
    protected model: any,
  ) {}

  async findAll() {
    return this.model.findMany()
  }

  async findById(id: number, field: string) {
    return this.model.findUnique({
      where: {
        [field]: id,
      },
    })
  }

  async create(data: T) {
    return this.model.create({
      data,
    })
  }

  async update(
    id: number,
    field: string,
    data: Partial<T>,
  ) {
    return this.model.update({
      where: {
        [field]: id,
      },
      data,
    })
  }

  async delete(id: number, field: string) {
    return this.model.delete({
      where: {
        [field]: id,
      },
    })
  }
}