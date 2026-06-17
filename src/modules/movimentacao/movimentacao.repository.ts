// movimentacao.repository.ts

import { prisma } from '../../database/prisma'
import { Client } from "pg";
export class MovimentacaoRepository {

    async create(data: any) {
  return prisma.movimentacao.create({
    data: {
      datamov: data.datamov,
      descmovimento: data.descmovimento,
      valorunit: data.valorunit,
      porcjuros: data.porcjuros,
      valorjuros: data.valorjuros,
      tipoparcelamento: data.tipoparcelamento,
      qtdparcatual: data.qtdparcatual,
      qtdparcfinal: data.qtdparcfinal,
      qtdparcpendente: data.qtdparcpendente,
      valortotalpendente: data.valortotalpendente,
      datafimmov: data.datafimmov,
      indativo: data.indativo,
      datacriacao: data.datacriacao,
      dataatualizacao: data.dataatualizacao,

      categoria: {
        connect: {
          codcategoria: data.codcategoria,
        },
      },

      conta: {
        connect: {
          codconta: data.codconta,
        },
      },

      status: {
        connect: {
          codstatus: data.codstatus,
        },
      },

      formapagamento: {
        connect: {
          codformpag: data.codformpag,
        },
      },

      ...(data.codcartao && {
        cartao: {
          connect: {
            codcartao: data.codcartao,
          },
        },
      }),
    },
  })
}

  async update(
  codmovimentacao: number,
  data: any,
) {
  return prisma.movimentacao.update({
    where: {
      codmovimentacao,
    },
    data: {
      datamov: data.datamov,
      descmovimento: data.descmovimento,
      valorunit: data.valorunit,
      porcjuros: data.porcjuros,
      valorjuros: data.valorjuros,
      tipoparcelamento: data.tipoparcelamento,
      qtdparcatual: data.qtdparcatual,
      qtdparcfinal: data.qtdparcfinal,
      qtdparcpendente: data.qtdparcpendente,
      valortotalpendente: data.valortotalpendente,
      datafimmov: data.datafimmov,
      indativo: data.indativo,
      dataatualizacao: new Date(),

      categoria: {
        connect: {
          codcategoria: data.codcategoria,
        },
      },

      conta: {
        connect: {
          codconta: data.codconta,
        },
      },

      status: {
        connect: {
          codstatus: data.codstatus,
        },
      },

      formapagamento: {
        connect: {
          codformpag: data.codformpag,
        },
      },

      ...(data.codcartao
        ? {
            cartao: {
              connect: {
                codcartao: data.codcartao,
              },
            },
          }
        : {
            cartao: {
              disconnect: true,
            },
          }),
    },
  })
}
    async delete(
        codmovimentacao: number,
    ) {
        return prisma.movimentacao.delete({
            where: {
                codmovimentacao,
            },
        })
    }

    async findById(
        codmovimentacao: number,
    ) {
        return prisma.movimentacao.findUnique({
            where: {
                codmovimentacao,
            },
            include: {
                categoria: true,
                conta: true,
                cartao: true,
                status: true,
                formapagamento: true,
            },
        })
    }

    async findAll(params: { page: number; size: number; sort?: string; descmovimento?: string; codcategoria?: number; codconta?: number }) {
    const { page, size, sort, descmovimento, codcategoria, codconta } = params;

    // 1. Monta as condições de filtro (where) se existirem
    const where: any = {};
    if (descmovimento) {
      where.descmovimento = { contains: descmovimento, mode: 'insensitive' };
    }
    if (codcategoria) where.codcategoria = codcategoria;
    if (codconta) where.codconta = codconta;

    // 2. Monta a ordenação baseada na string "campo,asc" ou "campo,desc"
    let orderBy: any = { datamov: 'desc' }; // Padrão
    if (sort) {
      const [field, order] = sort.split(',');
      orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
    }

    // 3. Executa a busca paginada e a contagem total concorrentemente
    const [content, totalElements] = await prisma.$transaction([
      prisma.movimentacao.findMany({
        where,
        include: {
          categoria: true,
          conta: true,
          cartao: true,
          status: true,
          formapagamento: true,
        },
        orderBy,
        skip: page * size, // Pula os registros das páginas anteriores
        take: size,        // Limita a quantidade de registros retornados
      }),
      prisma.movimentacao.count({ where })
    ]);

    // Retorna a estrutura necessária calculando as páginas
    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
      firstPage: page === 0,
      lastPage: page >= totalPages - 1 || totalPages === 0
    };
  }
    // async findAll() {
    //     return prisma.movimentacao.findMany({
    //         include: {
    //             categoria: true,
    //             conta: true,
    //             cartao: true,
    //             status: true,
    //             formapagamento: true,
    //         },
    //         orderBy: {
    //             datamov: 'desc',
    //         },
    //     })
    // }

async findAllView(): Promise<MovimentacaoView[]> {
    return prisma.$queryRaw<MovimentacaoView[]>`
        SELECT *
        FROM gestao.vw_resumo_financeiro
    `
}

}
// desccategoria	valor_total	quantidade
export interface MovimentacaoView {
    // codmovimentacao: bigint
    // descmovimento: string
    // valorunit: number
    valor_total: number
    quantidade: number
    desccategoria: string
    // descstatus: string
}