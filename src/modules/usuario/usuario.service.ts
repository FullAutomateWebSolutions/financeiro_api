import { BaseService } from '../shared/base/BaseService';
import { UsuarioRepository } from './usuario.repository'
import { usuario_role } from '@prisma/client'

export class UsuarioService extends BaseService {
    private usuarioRepository =  new UsuarioRepository();
  
    constructor() {
      super( new UsuarioRepository(), 'codUsuario' )
    }

    async listAllUsers() {
        return this.repository.findAll();
    }

    async updateUser(codUsuario: number, data: { nome?: string; email?: string; role?: usuario_role; indAtivo?: boolean }) {
        return this.repository.updateUser(codUsuario, data);
    }

    async deleteUser(codUsuario: number) {
        return this.repository.deleteUser(codUsuario);
    }
}