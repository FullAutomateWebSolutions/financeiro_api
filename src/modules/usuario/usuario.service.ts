import { BaseService } from '../shared/base/BaseService';
import { UsuarioRepository } from './usuario.repository'
import { usuario_role } from '@prisma/client'

export class UsuarioService extends BaseService {
    private usuarioRepository =  new UsuarioRepository();
  
    constructor() {
      super( new UsuarioRepository(), 'codusuario' )
    }

    async listAllUsers() {
        return this.repository.findAll();
    }

    async updateUser(codusuario: number, data: { nome?: string; email?: string; role?: usuario_role; indativo?: boolean }) {
        return this.repository.updateUser(codusuario, data);
    }

    async deleteUser(codusuario: number) {
        return this.repository.deleteUser(codusuario);
    }
}