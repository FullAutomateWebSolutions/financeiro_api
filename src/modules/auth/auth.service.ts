import { AuthRepository } from './auth.repository'
import { RegisterDTO, LoginDTO } from './dto/auth.dto'
import bcrypt from 'bcrypt'

export class AuthService {
  constructor(private repository = new AuthRepository()) {}

  async register(data: RegisterDTO) {
    const userExists = await this.repository.findByEmail(data.email)
    if (userExists) {
      throw new Error('Este e-mail já está cadastrado.')
    }

    const hashedPassword = await bcrypt.hash(data.senha, 10)

    const newUser = await this.repository.create({
      ...data,
      senha: hashedPassword,
    })

    const { senha, ...userWithoutPassword } = newUser
    return userWithoutPassword
  }

  async login(data: LoginDTO) {
    const user = await this.repository.findByEmail(data.email)
    if (!user || !user.indAtivo) {
      throw new Error('E-mail ou senha inválidos.')
    }

    const isPasswordValid = await bcrypt.compare(data.senha, user.senha)
    if (!isPasswordValid) {
      throw new Error('E-mail ou senha inválidos.')
    }

    return {
      codUsuario: user.codUsuario,
      nome: user.nome,
      email: user.email,
      role: user.role
    }
  }
}