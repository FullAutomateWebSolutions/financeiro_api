import { prisma } from '../../database/prisma'
import { Prisma } from '@prisma/client'

export class MovimentacaoRepository {

    async create(data: any, codusuario: number) {
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

                usuario: { connect: { codusuario: codusuario } },
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
        codusuario: number,
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
                codusuario: codusuario, 
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
        codusuario: number
    ) {
        const idBigInt = BigInt(String(codmovimentacao).trim());
        
        return prisma.movimentacao.delete({
            where: {
                codmovimentacao: idBigInt,
                codusuario: codusuario
            },
        });
    }

    async findById(
        codmovimentacao: number | string | bigint,
        codusuario: number
    ) {
        return prisma.movimentacao.findFirst({
            where: {
                codmovimentacao: BigInt(String(codmovimentacao).trim()),
                codusuario: codusuario
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

async findAll(
    params: { 
        page: number; 
        size: number; 
        sort?: string; 
        descmovimento?: string; 
        codcategoria?: number; 
        codconta?: number;
        codcartao?: number;
        datainicio?: string | Date; 
        datafim?: string | Date;    
    }, 
    codusuario: number
) {
    const { page, size, sort, descmovimento, codcategoria,codcartao, codconta, datainicio, datafim } = params;


    const where: any = {
        codusuario: codusuario
    };
    
    if (descmovimento && descmovimento.trim() !== "") {
        where.descmovimento = { contains: descmovimento.trim(), mode: 'insensitive' };
    }
    
    if (codcategoria !== undefined && codcategoria !== null && !isNaN(Number(codcategoria)) && Number(codcategoria) > 0) {
        where.codcategoria = Number(codcategoria);
    }
    
    if (codconta !== undefined && codconta !== null && !isNaN(Number(codconta)) && Number(codconta) > 0) {
        where.codconta = Number(codconta);
    }

   if (codcartao !== undefined && codcartao !== null && !isNaN(Number(codcartao)) && Number(codcartao) > 0) {
        where.codcartao = Number(codcartao);
    }
    
    const parseDataBR = (dataStr: any): Date | null => {
        if (!dataStr || typeof dataStr !== 'string' || dataStr.includes('undefined') || dataStr.includes('null')) {
            return dataStr instanceof Date ? dataStr : null;
        }
        
        const partes = dataStr.split('/');
        if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            // Cria no formato ISO: AAAA-MM-DD
            const dataValida = new Date(`${ano}-${mes}-${dia}T00:00:00`);
            return isNaN(dataValida.getTime()) ? null : dataValida;
        }
        
        const tentativaDireta = new Date(dataStr);
        return isNaN(tentativaDireta.getTime()) ? null : tentativaDireta;
    };
    const dateInicio = parseDataBR(datainicio);
    const dateFim = parseDataBR(datafim);

    if (dateInicio || dateFim) {
        where.datamov = {};

        if (dateInicio) {
            dateInicio.setHours(0, 0, 0, 0);
            where.datamov.gte = dateInicio;
        }

        if (dateFim) {
            dateFim.setHours(23, 59, 59, 999);
            where.datamov.lte = dateFim;
        }
    }

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

    async findAllView(codusuario: number): Promise<any[]> {
        return prisma.$queryRaw`
            SELECT 
                c.desccategoria,
                SUM(m.valorunit) AS valor_total,
                COUNT(*) AS quantidade
            FROM gestao.movimentacao m
            INNER JOIN gestao.categoria c ON c.codcategoria = m.codcategoria
            WHERE m.codusuario = ${codusuario}
            GROUP BY c.desccategoria
        `
    }

    async findAtivas() {
    return prisma.movimentacao.findMany({
        where: {
            indativo: true
        }
    });
    }
async updateCron(codmovimentacao: number, data: any) {
    return prisma.movimentacao.update({
        where: {
            codmovimentacao
        },
        data
    });
}
}