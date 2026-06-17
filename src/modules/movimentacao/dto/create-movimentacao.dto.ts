import { z } from 'zod'

export const createMovimentacaoSchema = z
  .object({
    datamov: z.coerce.date(),

    descmovimento: z
      .string()
      .min(3, 'Descrição deve possuir no mínimo 3 caracteres')
      .max(255, 'Descrição deve possuir no máximo 255 caracteres'),

    // valorunit: z
    //   .number()
    //   .positive('Valor unitário deve ser maior que zero'),

    // porcjuros: z
    //   .number()
    //   .min(0, 'Percentual de juros não pode ser negativo')
    //   .default(0),

    tipoparcelamento: z
      .number()
      .int()
      .refine(
        (value) => [1, 2, 3].includes(value),
        {
          message:
            'Tipo parcelamento deve ser 1(Parcelado), 2(À Vista) ou 3(PIX)',
        },
      ),

    qtdparcatual: z
      .number()
      .int()
      .min(1)
      .default(1),

    qtdparcfinal: z
      .number()
      .int()
      .min(1)
      .default(1),

    codformpag: z
      .number()
      .int()
      .positive(),

    codconta: z
      .number()
      .int()
      .positive(),

    codstatus: z
      .number()
      .int()
      .positive(),

    codcategoria: z
      .number()
      .int()
      .positive(),

    codcartao: z
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
    (data) =>
      data.qtdparcatual <=
      data.qtdparcfinal,
    {
      path: ['qtdparcatual'],
      message:
        'Parcela atual não pode ser maior que a parcela final',
    },
  )

export type CreateMovimentacaoDTO =
  z.infer<typeof createMovimentacaoSchema>