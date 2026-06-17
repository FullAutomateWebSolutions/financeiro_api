import { CategoriaRepository } from "./categoria.repository"

export class CategoriaService {
  constructor(
    private repository: CategoriaRepository,
  ) {}

  async create(data: any) {
    return this.repository.create(data)
  }

  async findAll() {
    return this.repository.findAll()
  }
}