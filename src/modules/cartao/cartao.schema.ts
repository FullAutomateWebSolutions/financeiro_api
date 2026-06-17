
import { cartao } from "@prisma/client";
import { z } from "zod";
export const created = z.object({
    codcartao: z.number().optional(),
    tipocartao: z.string(),
    desccartao: z.string(),
    indativo: z.boolean().nullable(),
    datacriacao: z.date().nullable().optional(),
    dataatualizacao: z.date().nullable().optional()
});

