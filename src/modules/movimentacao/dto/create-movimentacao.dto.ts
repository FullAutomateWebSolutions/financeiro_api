import { z } from 'zod'

export const createMovimentacaoSchema = z
  .object({
    dataMov: z.coerce.date(),

    descMovimento: z
      .string()
      .min(3, 'Descrição deve possuir no mínimo 3 caracteres')
      .max(255, 'Descrição deve possuir no máximo 255 caracteres'),

    valorUnit: z.coerce
      .number({ required_error: 'Valor unitário é obrigatório' })
      .min(0, 'Valor unitário não pode ser negativo'),

    porcJuros: z.coerce
      .number()
      .min(0, 'Percentual de juros não pode ser negativo')
      .default(0)
      .optional(), 

    tipoParcelamento: z
      .number({ required_error: 'Tipo de parcelamento é obrigatório' })
      .int()
      .refine(
        (value) => [1, 2, 3].includes(value),
        {
          message:
            'Tipo parcelamento deve ser 1(Parcelado), 2(À Vista) ou 3(PIX)',
        },
      ),

    qtdParcAtual: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .optional(),

    qtdParcFinal: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .optional(),

    codFormPag: z.coerce
      .number()
      .int()
      .positive('Forma de pagamento inválida'),

    codConta: z.coerce
      .number()
      .int()
      .positive('Conta inválida'),

    codStatus: z.coerce
      .number()
      .int()
      .positive('Status inválido'),

    codCategoria: z.coerce
      .number()
      .int()
      .positive('Categoria inválida'),

    codCartao: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

    dataIntegracao: z
      .coerce
      .date()
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const atual = data.qtdParcAtual ?? 1;
      const final = data.qtdParcFinal ?? 1;
      return atual <= final;
    },
    {
      path: ['qtdParcAtual'],
      message: 'Parcela atual não pode ser maior que a parcela final',
    },
  )

export type CreateMovimentacaoDTO = z.infer<typeof createMovimentacaoSchema>
export type MovimentacaoComUsuarioDTO = CreateMovimentacaoDTO & {
  codUsuario: number
}