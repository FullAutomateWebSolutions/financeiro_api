import { prisma } from '../../database/prisma'
import { Prisma } from '@prisma/client'

export class MovimentacaoRepository {

    async create(data: any) {
        const valorunit = data.valorunit !== undefined && data.valorunit !== null && data.valorunit !== '' ? Number(data.valorunit) : 0;
        const porcjuros = data.porcjuros !== undefined && data.porcjuros !== null && data.porcjuros !== '' ? Number(data.porcjuros) : 0;
        const valorjuros = data.valorjuros !== undefined && data.valorjuros !== null && data.valorjuros !== '' ? Number(data.valorjuros) : 0;
        const valortotalpendente = data.valortotalpendente !== undefined && data.valortotalpendente !== null && data.valortotalpendente !== '' ? Number(data.valortotalpendente) : 0;

        return prisma.movimentacao.create({
            data: {
                datamov: data.datamov ? new Date(data.datamov) : new Date(),
                descmovimento: data.descmovimento,
                
                valorunit: valorunit,
                porcjuros: porcjuros,
                valorjuros: valorjuros,
                valortotalpendente: valortotalpendente,
                
                tipoparcelamento: data.tipoparcelamento !== undefined ? Number(data.tipoparcelamento) : null,
                qtdparcatual: data.qtdparcatual !== undefined ? Number(data.qtdparcatual) : null,
                qtdparcfinal: data.qtdparcfinal !== undefined ? Number(data.qtdparcfinal) : null,
                qtdparcpendente: data.qtdparcpendente !== undefined ? Number(data.qtdparcpendente) : null,
                datafimmov: data.datafimmov ? new Date(data.datafimmov) : null,
                
                indativo: data.indativo !== undefined ? Boolean(data.indativo) : true,
                
                datacriacao: data.datacriacao ? new Date(data.datacriacao) : new Date(),
                dataatualizacao: data.dataatualizacao ? new Date(data.dataatualizacao) : new Date(),

                categoria: { connect: { codcategoria: Number(data.codcategoria) } },
                conta: { connect: { codconta: Number(data.codconta) } },
                status: { connect: { codstatus: Number(data.codstatus) } },
                formapagamento: { connect: { codformpag: Number(data.codformpag) } },

                ...(data.codcartao && {
                    cartao: { connect: { codcartao: Number(data.codcartao) } },
                }),
            },
        })
    }

    async update(
        codmovimentacao: number | string | bigint,
        data: any,
    ) {
        const idBigInt = BigInt(String(codmovimentacao).trim());

        const valorunit = data.valorunit !== undefined && data.valorunit !== null && data.valorunit !== '' ? Number(data.valorunit) : undefined;
        const porcjuros = data.porcjuros !== undefined && data.porcjuros !== null && data.porcjuros !== '' ? Number(data.porcjuros) : undefined;
        const valorjuros = data.valorjuros !== undefined && data.valorjuros !== null && data.valorjuros !== '' ? Number(data.valorjuros) : undefined;
        const valortotalpendente = data.valortotalpendente !== undefined && data.valortotalpendente !== null && data.valortotalpendente !== '' ? Number(data.valortotalpendente) : undefined;

        return prisma.movimentacao.update({
            where: {
                codmovimentacao: idBigInt,
            },
            data: {
                datamov: data.datamov ? new Date(data.datamov) : undefined,
                datafimmov: data.datafimmov ? new Date(data.datafimmov) : undefined,
                datafechamento: data.datafechamento ? new Date(data.datafechamento) : undefined,
                dataintegracao: data.dataintegracao ? new Date(data.dataintegracao) : undefined,
                dataatualizacao: new Date(),

                descmovimento: data.descmovimento !== undefined ? data.descmovimento : undefined,
                indativo: data.indativo !== undefined ? Boolean(data.indativo) : undefined,

                valorunit: valorunit,
                porcjuros: porcjuros,
                valorjuros: valorjuros,
                valortotalpendente: valortotalpendente,

                tipoparcelamento: data.tipoparcelamento !== undefined && data.tipoparcelamento !== '' ? Number(data.tipoparcelamento) : undefined,
                qtdparcatual: data.qtdparcatual !== undefined && data.qtdparcatual !== '' ? Number(data.qtdparcatual) : undefined,
                qtdparcfinal: data.qtdparcfinal !== undefined && data.qtdparcfinal !== '' ? Number(data.qtdparcfinal) : undefined,
                qtdparcpendente: data.qtdparcpendente !== undefined && data.qtdparcpendente !== '' ? Number(data.qtdparcpendente) : undefined,

                ...(data.codcategoria && { categoria: { connect: { codcategoria: Number(data.codcategoria) } } }),
                ...(data.codconta && { conta: { connect: { codconta: Number(data.codconta) } } }),
                ...(data.codstatus && { status: { connect: { codstatus: Number(data.codstatus) } } }),
                ...(data.codformpag && { formapagamento: { connect: { codformpag: Number(data.codformpag) } } }),

                ...(data.codcartao !== undefined
                    ? data.codcartao
                        ? { cartao: { connect: { codcartao: Number(data.codcartao) } } }
                        : { cartao: { disconnect: true } }
                    : {}),
            },
        });
    }

    async delete(
        codmovimentacao: number | string | bigint,
    ) {
        const idBigInt = BigInt(String(codmovimentacao).trim());
        return prisma.movimentacao.delete({
            where: {
                codmovimentacao: idBigInt,
            },
        });
    }

    async findById(
        codmovimentacao: number | string | bigint,
    ) {
        return prisma.movimentacao.findUnique({
            where: {
                codmovimentacao: BigInt(String(codmovimentacao).trim()),
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

        const where: any = {};
        if (descmovimento) {
            where.descmovimento = { contains: descmovimento, mode: 'insensitive' };
        }
        if (codcategoria) where.codcategoria = Number(codcategoria);
        if (codconta) where.codconta = Number(codconta);

        let orderBy: any = { datamov: 'desc' };
        if (sort) {
            const [field, order] = sort.split(',');
            orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }

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
                skip: page * size,
                take: size,
            }),
            prisma.movimentacao.count({ where })
        ]);

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

    async findAllView(): Promise<any[]> {
        return prisma.$queryRaw`
            SELECT *
            FROM gestao.vw_resumo_financeiro
        `
    }
}