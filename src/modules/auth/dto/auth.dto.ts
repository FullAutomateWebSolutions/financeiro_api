import { z } from 'zod'

export const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').max(150),
  email: z.string().email('E-mail inválido').max(150),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').max(255),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>