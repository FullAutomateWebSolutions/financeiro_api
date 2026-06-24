import { prisma } from '../../database/prisma'
import { RegisterDTO } from './dto/auth.dto'

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    })
  }

  async create(data: RegisterDTO) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha, 
        indAtivo: true,
      },
    })
  }
}