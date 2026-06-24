import { usuario_role } from '@prisma/client';
import { prisma } from '../../database/prisma'
import { BaseRepository } from '../shared/base/BaseRepository';


export class UsuarioRepository extends BaseRepository<usuario_role>{
      constructor() {
    super(prisma.usuario);
  }
    async findAll() {
        return prisma.usuario.findMany({
            select: {
                codUsuario: true,
                nome: true,
                email: true,
                role: true,
                indAtivo: true,
            },
            orderBy: { nome: 'asc' }
        });
    }

    async updateUser(codUsuario: number, data: { nome?: string; email?: string; role?: usuario_role; indAtivo?: boolean }) {
        return prisma.usuario.update({
            where: { codUsuario },
            data,
            select: {
                codUsuario: true,
                nome: true,
                email: true,
                role: true,
                indAtivo: true,
            }
        });
    }

    async deleteUser(codUsuario: number) {
        return prisma.usuario.delete({
            where: { codUsuario }
        });
    }
}