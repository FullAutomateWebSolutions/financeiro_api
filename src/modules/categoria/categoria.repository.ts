import { prisma } from '../../database/prisma';

export class CategoriaRepository {
  async findAll() {
    return prisma.categoria.findMany()
  }

  async findById(id: number) {
    return prisma.categoria.findUnique({
      where: {
        codCategoria: id,
      },
    })
  }

  async create(data: any) {
    return prisma.categoria.create({
      data,
    })
  }

  async update(id: number, data: any) {
    return prisma.categoria.update({
      where: {
        codCategoria: id,
      },
      data,
    })
  }

  async delete(id: number) {
    return prisma.categoria.delete({
      where: {
        codCategoria: id,
      },
    })
  }
}