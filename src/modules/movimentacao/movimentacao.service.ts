// movimentacao.service.ts

import { MovimentacaoRepository } from './movimentacao.repository'

export class MovimentacaoService {
    constructor(
        private repository = new MovimentacaoRepository(),
    ) {}

    private calcularJuros(
        valorUnit: number,
        porcJuros: number,
    ) {
        return Number(
            (valorUnit * (porcJuros / 100)).toFixed(2),
        )
    }

    private calcularParcelas(
        valorUnit: number,
        valorJuros: number,
        qtdParcAtual: number,
        qtdParcFinal: number,
    ) {
        const pendentes = qtdParcFinal - qtdParcAtual

        const totalPendente =
            pendentes * (valorUnit + valorJuros)

        return {
            qtdparcpendente: pendentes,
            valortotalpendente: Number(
                totalPendente.toFixed(2),
            ),
        }
    }

    private calcularDataFinal(
        dataMov: Date,
        qtdParcFinal: number,
    ) {
        const data = new Date(dataMov)

        data.setMonth(
            data.getMonth() + (qtdParcFinal - 1),
        )

        return data
    }

    async create(data: any) {
        const valorUnit = Number(data.valorunit || 0)
        const porcJuros = Number(data.porcjuros || 0)
        const qtdParcAtual = Number(data.qtdparcatual || 1)
        const qtdParcFinal = Number(data.qtdparcfinal || 1)

        const valorJuros = this.calcularJuros(
            valorUnit,
            porcJuros,
        )

        const parcelas = this.calcularParcelas(
            valorUnit,
            valorJuros,
            qtdParcAtual,
            qtdParcFinal,
        )

        const dataFimMov = this.calcularDataFinal(
            new Date(data.datamov),
            qtdParcFinal,
        )

        return this.repository.create({
            datamov: new Date(data.datamov),
            descmovimento: data.descmovimento,

            valorunit: valorUnit,
            porcjuros: porcJuros,
            valorjuros: valorJuros,

            tipoparcelamento:
                data.tipoparcelamento,

            qtdparcatual: qtdParcAtual,
            qtdparcfinal: qtdParcFinal,

            qtdparcpendente:
                parcelas.qtdparcpendente,

            valortotalpendente:
                parcelas.valortotalpendente,

            datafimmov: dataFimMov,

            codformpag: data.codformpag,
            codconta: data.codconta,
            codstatus: data.codstatus,
            codcategoria: data.codcategoria,
            codcartao: data.codcartao,

            indativo: true,
            datacriacao: new Date(),
            dataatualizacao: new Date(),
        })
    }

    async update(
        codMovimentacao: number,
        data: any,
    ) {
        const valorUnit = Number(data.valorunit || 0)
        const porcJuros = Number(data.porcjuros || 0)
        const qtdParcAtual = Number(data.qtdparcatual || 1)
        const qtdParcFinal = Number(data.qtdparcfinal || 1)

        const valorJuros = this.calcularJuros(
            valorUnit,
            porcJuros,
        )

        const parcelas = this.calcularParcelas(
            valorUnit,
            valorJuros,
            qtdParcAtual,
            qtdParcFinal,
        )

        const dataFimMov = this.calcularDataFinal(
            new Date(data.datamov),
            qtdParcFinal,
        )

        return this.repository.update(
            codMovimentacao,
            {
                ...data,

                valorjuros: valorJuros,

                qtdparcpendente:
                    parcelas.qtdparcpendente,

                valortotalpendente:
                    parcelas.valortotalpendente,

                datafimmov: dataFimMov,

                dataatualizacao:
                    new Date(),
            },
        )
    }

    async finalizar(
        codMovimentacao: number,
    ) {
        return this.repository.update(
            codMovimentacao,
            {
                datafechamento: new Date(),
                indativo: false,
                dataatualizacao: new Date(),
            },
        )
    }

    async findById(
        codMovimentacao: number,
    ) {
        return this.repository.findById(
            codMovimentacao,
        )
    }

    // async findAll() {
    //     return this.repository.findAll()
    // }
// Atualizado para receber os filtros e paginação obrigatórios
    async findAll(params: { page: number; size: number; sort?: string; descmovimento?: string; codcategoria?: number; codconta?: number }) {
        // Garante valores padrão caso venham indefinidos
        const page = Number(params.page ?? 0);
        const size = Number(params.size ?? 10);

        return this.repository.findAll({
            ...params,
            page,
            size
        });
    }
    async delete(
        codMovimentacao: number,
    ) {
        return this.repository.delete(
            codMovimentacao,
        )
    }

async findAllView() {
    const result =
        await this.repository.findAllView()
  return result
    // return result.map(item => ({
    //     ...item,
    //     codmovimentacao:
    //         Number(item.desccategoria),
    // }))
}
}