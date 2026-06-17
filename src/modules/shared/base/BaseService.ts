export class BaseService {
  constructor(
    protected repository: any,
    protected primaryKey: string,
  ) {}

  async findAll() {
    return this.repository.findAll()
  }

  async findById(id: number) {
    return this.repository.findById(
      id,
      this.primaryKey,
    )
  }

  async create(data: any) {
    return this.repository.create(data)
  }

  async update(
    id: number,
    data: any,
  ) {
    return this.repository.update(
      id,
      this.primaryKey,
      data,
    )
  }

  async delete(id: number) {
    return this.repository.delete(
      id,
      this.primaryKey,
    )
  }
}