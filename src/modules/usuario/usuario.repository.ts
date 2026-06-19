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
                codusuario: true,
                nome: true,
                email: true,
                role: true,
                indativo: true,
            },
            orderBy: { nome: 'asc' }
        });
    }

    async updateUser(codusuario: number, data: { nome?: string; email?: string; role?: usuario_role; indativo?: boolean }) {
        return prisma.usuario.update({
            where: { codusuario },
            data,
            select: {
                codusuario: true,
                nome: true,
                email: true,
                role: true,
                indativo: true,
            }
        });
    }

    async deleteUser(codusuario: number) {
        return prisma.usuario.delete({
            where: { codusuario }
        });
    }
}