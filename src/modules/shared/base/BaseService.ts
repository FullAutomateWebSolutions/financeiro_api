export class BaseService {
  constructor(
    protected repository: any,
    protected primaryKey: string,
  ) {}

  async findAll(codUsuario: number) {
    return this.repository.findAll(codUsuario)
  }

  async findById(id: number, codUsuario: number) {
    return this.repository.findById(
      id,
      this.primaryKey,
      codUsuario,
    )
  }

  async create(data: any, codUsuario: number) {
    return this.repository.create(data, codUsuario)
  }

  async update(
    id: number,
    data: any,
    codUsuario: number,
  ) {
    return this.repository.update(
      id,
      this.primaryKey,
      data,
      codUsuario,
    )
  }

  async delete(id: number, codUsuario: number) {
    return this.repository.delete(
      id,
      this.primaryKey,
      codUsuario,
    )
  }
}