import { prisma } from '../../database/prisma'
import { Prisma } from '@prisma/client'

export class MovimentacaoRepository {

    async create(data: any, codUsuario: number) {
        const valorUnit = data.valorUnit !== undefined && data.valorUnit !== null && data.valorUnit !== '' ? Number(data.valorUnit) : 0;
        const porcJuros = data.porcJuros !== undefined && data.porcJuros !== null && data.porcJuros !== '' ? Number(data.porcJuros) : 0;
        const valorJuros = data.valorJuros !== undefined && data.valorJuros !== null && data.valorJuros !== '' ? Number(data.valorJuros) : 0;
        const valorTotalPendente = data.valorTotalPendente !== undefined && data.valorTotalPendente !== null && data.valorTotalPendente !== '' ? Number(data.valorTotalPendente) : 0;

        return prisma.movimentacao.create({
            data: {
                dataMov: data.dataMov ? new Date(data.dataMov) : new Date(),
                descMovimento: data.descMovimento,
                
                valorUnit: valorUnit,
                porcJuros: porcJuros,
                valorJuros: valorJuros,
                valorTotalPendente: valorTotalPendente,
                
                tipoParcelamento: data.tipoParcelamento !== undefined ? Number(data.tipoParcelamento) : null,
                qtdParcAtual: data.qtdParcAtual !== undefined ? Number(data.qtdParcAtual) : null,
                qtdParcFinal: data.qtdParcFinal !== undefined ? Number(data.qtdParcFinal) : null,
                qtdParcPendente: data.qtdParcPendente !== undefined ? Number(data.qtdParcPendente) : null,
                dataFimMov: data.dataFimMov ? new Date(data.dataFimMov) : null,
                
                indAtivo: data.indAtivo !== undefined ? Boolean(data.indAtivo) : true,
                
                dataCriacao: data.dataCriacao ? new Date(data.dataCriacao) : new Date(),
                dataAtualizacao: data.dataAtualizacao ? new Date(data.dataAtualizacao) : new Date(),

                usuario: { connect: { codUsuario: codUsuario } },
                categoria: { connect: { codCategoria: Number(data.codCategoria) } },
                conta: { connect: { codConta: Number(data.codConta) } },
                status: { connect: { codStatus: Number(data.codStatus) } },
                formapagamento: { connect: { codFormPag: Number(data.codFormPag) } },

                ...(data.codCartao && {
                    cartao: { connect: { codCartao: Number(data.codCartao) } },
                }),
            },
        })
    }

    async update(
        codMovimentacao: number | string | bigint,
        codUsuario: number,
        data: any,
    ) {
        const idBigInt = BigInt(String(codMovimentacao).trim());

        const valorUnit = data.valorUnit !== undefined && data.valorUnit !== null && data.valorUnit !== '' ? Number(data.valorUnit) : undefined;
        const porcJuros = data.porcJuros !== undefined && data.porcJuros !== null && data.porcJuros !== '' ? Number(data.porcJuros) : undefined;
        const valorJuros = data.valorJuros !== undefined && data.valorJuros !== null && data.valorJuros !== '' ? Number(data.valorJuros) : undefined;
        const valorTotalPendente = data.valorTotalPendente !== undefined && data.valorTotalPendente !== null && data.valorTotalPendente !== '' ? Number(data.valorTotalPendente) : undefined;

        return prisma.movimentacao.update({
            where: {
                codMovimentacao: idBigInt,
                codUsuario: codUsuario, 
            },
            data: {
                dataMov: data.dataMov ? new Date(data.dataMov) : undefined,
                dataFimMov: data.dataFimMov ? new Date(data.dataFimMov) : undefined,
                dataFechamento: data.dataFechamento ? new Date(data.dataFechamento) : undefined,
                dataIntegracao: data.dataIntegracao ? new Date(data.dataIntegracao) : undefined,
                dataAtualizacao: new Date(),

                descMovimento: data.descMovimento !== undefined ? data.descMovimento : undefined,
                indAtivo: data.indAtivo !== undefined ? Boolean(data.indAtivo) : undefined,

                valorUnit: valorUnit,
                porcJuros: porcJuros,
                valorJuros: valorJuros,
                valorTotalPendente: valorTotalPendente,

                tipoParcelamento: data.tipoParcelamento !== undefined && data.tipoParcelamento !== '' ? Number(data.tipoParcelamento) : undefined,
                qtdParcAtual: data.qtdParcAtual !== undefined && data.qtdParcAtual !== '' ? Number(data.qtdParcAtual) : undefined,
                qtdParcFinal: data.qtdParcFinal !== undefined && data.qtdParcFinal !== '' ? Number(data.qtdParcFinal) : undefined,
                qtdParcPendente: data.qtdParcPendente !== undefined && data.qtdParcPendente !== '' ? Number(data.qtdParcPendente) : undefined,

                ...(data.codCategoria && { categoria: { connect: { codCategoria: Number(data.codCategoria) } } }),
                ...(data.codConta && { conta: { connect: { codConta: Number(data.codConta) } } }),
                ...(data.codStatus && { status: { connect: { codStatus: Number(data.codStatus) } } }),
                ...(data.codFormPag && { formapagamento: { connect: { codFormPag: Number(data.codFormPag) } } }),

                ...(data.codCartao !== undefined
                    ? data.codCartao
                        ? { cartao: { connect: { codCartao: Number(data.codCartao) } } }
                        : { cartao: { disconnect: true } }
                    : {}),
            },
        });
    }

    async delete(
        codMovimentacao: number | string | bigint,
        codUsuario: number
    ) {
        const idBigInt = BigInt(String(codMovimentacao).trim());
        
        return prisma.movimentacao.delete({
            where: {
                codMovimentacao: idBigInt,
                codUsuario: codUsuario
            },
        });
    }

    async findById(
        codMovimentacao: number | string | bigint,
        codUsuario: number
    ) {
        return prisma.movimentacao.findFirst({
            where: {
                codMovimentacao: BigInt(String(codMovimentacao).trim()),
                codUsuario: codUsuario
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
            descMovimento?: string; 
            codCategoria?: number; 
            codConta?: number;
            codCartao?: number;
            dataInicio?: string | Date; 
            dataFim?: string | Date;    
        }, 
        codUsuario: number
    ) {
        const { page, size, sort, descMovimento, codCategoria, codCartao, codConta, dataInicio, dataFim } = params;

        const where: any = {
            codUsuario: codUsuario
        };
        
        if (descMovimento && descMovimento.trim() !== "") {
            where.descMovimento = { contains: descMovimento.trim(), mode: 'insensitive' };
        }
        
        if (codCategoria !== undefined && codCategoria !== null && !isNaN(Number(codCategoria)) && Number(codCategoria) > 0) {
            where.codCategoria = Number(codCategoria);
        }
        
        if (codConta !== undefined && codConta !== null && !isNaN(Number(codConta)) && Number(codConta) > 0) {
            where.codConta = Number(codConta);
        }

        if (codCartao !== undefined && codCartao !== null && !isNaN(Number(codCartao)) && Number(codCartao) > 0) {
            where.codCartao = Number(codCartao);
        }
        
        const parseDataBR = (dataStr: any): Date | null => {
            if (!dataStr || dataStr === 'undefined' || dataStr === 'null') {
                return null;
            }
            
            if (dataStr instanceof Date) {
                return isNaN(dataStr.getTime()) ? null : dataStr;
            }

            if (typeof dataStr === 'string') {
                const partes = dataStr.split('/');
                if (partes.length === 3) {
                    const [dia, mes, ano] = partes;
                    const dataValida = new Date(`${ano}-${mes}-${dia}T00:00:00`);
                    return isNaN(dataValida.getTime()) ? null : dataValida;
                }
                
                const tentativaDireta = new Date(dataStr);
                return isNaN(tentativaDireta.getTime()) ? null : tentativaDireta;
            }

            return null;
        };

        const dateInicio = parseDataBR(dataInicio);
        const dateFim = parseDataBR(dataFim);

        if (dateInicio || dateFim) {
            const filtroData: any = {};

            if (dateInicio && !isNaN(dateInicio.getTime())) {
                dateInicio.setHours(0, 0, 0, 0);
                filtroData.gte = dateInicio;
            }

            if (dateFim && !isNaN(dateFim.getTime())) {
                dateFim.setHours(23, 59, 59, 999);
                filtroData.lte = dateFim;
            }

            if (Object.keys(filtroData).length > 0) {
                where.dataMov = filtroData;
            }
        }

        let orderBy: any = { dataMov: 'desc' };
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

    async findAllView(codUsuario: number): Promise<any[]> {
        return prisma.$queryRaw`
            SELECT 
                c."descCategoria",
                SUM(m."valorUnit") AS valor_total,
                COUNT(*) AS quantidade
            FROM gestao.movimentacao m
            INNER JOIN gestao.categoria c ON c."codCategoria" = m."codCategoria"
            WHERE m."codUsuario" = ${codUsuario}
            GROUP BY c."descCategoria"
        `
    }

    async findAtivas(codUsuario: number) {
        return prisma.movimentacao.findMany({
            where: {
                indAtivo: true,
                codUsuario: codUsuario
            }
        });
    }

    async updateCron(codMovimentacao: number | string | bigint, codUsuario: number, data: any) {
        const idBigInt = BigInt(String(codMovimentacao).trim());
        
        return prisma.movimentacao.update({
            where: {
                codMovimentacao: idBigInt,
                codUsuario: codUsuario
            },
            data
        });
    }
}