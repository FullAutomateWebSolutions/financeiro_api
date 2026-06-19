import { z } from 'zod'

export const createMovimentacaoSchema = z
  .object({
    datamov: z.coerce.date(),

    descmovimento: z
      .string()
      .min(3, 'Descrição deve possuir no mínimo 3 caracteres')
      .max(255, 'Descrição deve possuir no máximo 255 caracteres'),

    valorunit: z.coerce
      .number({ required_error: 'Valor unitário é obrigatório' })
      .min(0, 'Valor unitário não pode ser negativo'),

    porcjuros: z.coerce
      .number()
      .min(0, 'Percentual de juros não pode ser negativo')
      .default(0)
      .optional(), 

    tipoparcelamento: z
      .number({ required_error: 'Tipo de parcelamento é obrigatório' })
      .int()
      .refine(
        (value) => [1, 2, 3].includes(value),
        {
          message:
            'Tipo parcelamento deve ser 1(Parcelado), 2(À Vista) ou 3(PIX)',
        },
      ),

    qtdparcatual: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .optional(),

    qtdparcfinal: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .optional(),

    codformpag: z.coerce
      .number()
      .int()
      .positive('Forma de pagamento inválida'),

    codconta: z.coerce
      .number()
      .int()
      .positive('Conta inválida'),

    codstatus: z.coerce
      .number()
      .int()
      .positive('Status inválido'),

    codcategoria: z.coerce
      .number()
      .int()
      .positive('Categoria inválida'),

    codcartao: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

    dataintegracao: z
      .coerce
      .date()
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const atual = data.qtdparcatual ?? 1;
      const final = data.qtdparcfinal ?? 1;
      return atual <= final;
    },
    {
      path: ['qtdparcatual'],
      message: 'Parcela atual não pode ser maior que a parcela final',
    },
  )

export type CreateMovimentacaoDTO = z.infer<typeof createMovimentacaoSchema>
export type MovimentacaoComUsuarioDTO = CreateMovimentacaoDTO & {
  codusuario: number
}