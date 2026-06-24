import { MovimentacaoRepository } from './movimentacao.repository'

export class MovimentacaoService {
    constructor(
        private repository = new MovimentacaoRepository(),
    ) { }
    private calcularJuros(valorUnit: number, porcJuros: number) {
        return Number((valorUnit * (porcJuros / 100)).toFixed(2))
    }
    private calcularParcelas(valorUnit: number, valorJuros: number, qtdParcAtual: number, qtdParcFinal: number) {
        const pendentes = qtdParcFinal - qtdParcAtual
        const totalPendente = pendentes * (valorUnit + valorJuros)

        return {
            qtdparcpendente: pendentes,
            valortotalpendente: Number(totalPendente.toFixed(2)),
        }
    }
    private calcularDataFinal(dataMov: Date, qtdParcFinal: number) {
        const data = new Date(dataMov)
        data.setMonth(data.getMonth() + (qtdParcFinal - 1))
        return data
    }
    async create(data: any, codusuario: number) {
        const valorUnit = Number(data.valorunit || 0)
        const porcJuros = Number(data.porcjuros || 0)
        const qtdParcAtual = Number(data.qtdparcatual || 1)
        const qtdParcFinal = Number(data.qtdparcfinal || 1)

        const valorJuros = this.calcularJuros(valorUnit, porcJuros)
        const parcelas = this.calcularParcelas(valorUnit, valorJuros, qtdParcAtual, qtdParcFinal)
        const dataFimMov = this.calcularDataFinal(new Date(data.datamov), qtdParcFinal)

        return this.repository.create({
            datamov: new Date(data.datamov),
            descmovimento: data.descmovimento,
            valorunit: valorUnit,
            porcjuros: porcJuros,
            valorjuros: valorJuros,
            tipoparcelamento: data.tipoparcelamento,
            qtdparcatual: qtdParcAtual,
            qtdparcfinal: qtdParcFinal,
            qtdparcpendente: parcelas.qtdparcpendente,
            valortotalpendente: parcelas.valortotalpendente,
            datafimmov: dataFimMov,
            codformpag: data.codformpag,
            codconta: data.codconta,
            codstatus: data.codstatus,
            codcategoria: data.codcategoria,
            codcartao: data.codcartao,
            indativo: true,
            datacriacao: new Date(),
            dataatualizacao: new Date(),
        }, codusuario)
    }
    async update(
        codMovimentacao: number | string | bigint,
        codusuario: number,
        data: any,
    ) {
        const registroAtual = await this.repository.findById(codMovimentacao, codusuario);
        if (!registroAtual) {
            throw new Error(`Movimentação com o ID ${codMovimentacao} não foi encontrada ou não pertence a você.`);
        }

        const valorUnit = (data.valorunit !== undefined && data.valorunit !== null && data.valorunit !== '')
            ? Number(data.valorunit)
            : Number(registroAtual.valorunit);

        const porcJuros = data.porcjuros !== undefined ? Number(data.porcjuros) : Number(registroAtual.porcjuros);
        const qtdParcAtual = data.qtdparcatual !== undefined ? Number(data.qtdparcatual) : Number(registroAtual.qtdparcatual);
        const qtdParcFinal = data.qtdparcfinal !== undefined ? Number(data.qtdparcfinal) : Number(registroAtual.qtdparcfinal);

        const dataMovRaw = data.datamov !== undefined ? data.datamov : registroAtual.datamov;
        const dataMov = new Date(dataMovRaw);

        const indativo = data.indativo !== undefined ? data.indativo : registroAtual.indativo;

        const valorJuros = this.calcularJuros(valorUnit, porcJuros);
        const parcelas = this.calcularParcelas(valorUnit, valorJuros, qtdParcAtual, qtdParcFinal);
        const dataFimMov = this.calcularDataFinal(dataMov, qtdParcFinal);

        const { valorunit, porcjuros, valorjuros, indativo: _, ...dadosRestantes } = data;

        return this.repository.update(
            codMovimentacao,
            codusuario,
            {
                ...dadosRestantes,
                datamov: dataMov,
                valorunit: valorUnit,
                porcjuros: porcJuros,
                valorjuros: valorJuros,
                qtdparcatual: qtdParcAtual,
                qtdparcfinal: qtdParcFinal,
                qtdparcpendente: parcelas.qtdparcpendente,
                valortotalpendente: parcelas.valortotalpendente,
                datafimmov: dataFimMov,
                indativo: indativo,
            },
        );
    }
    async finalizar(
        codMovimentacao: number | string | bigint,
        codusuario: number,
    ) {
        return this.repository.update(
            codMovimentacao,
            codusuario,
            {
                datafechamento: new Date(),
                indativo: false,
                dataatualizacao: new Date(),
            },
        )
    }
    async findById(
        codMovimentacao: number | string | bigint,
        codusuario: number
    ) {
        return this.repository.findById(codMovimentacao, codusuario)
    }
    async findAll(
        params: {
            page: number;
            size: number;
            sort?: string;
            descmovimento?: string;
            codcategoria?: number;
            codconta?: number;
            datainicio?: string | Date;
            datafim?: string | Date;
            codcartao?: number
        },
        codusuario: number
    ) {
        const page = Number(params.page ?? 0);
        const size = Number(params.size ?? 10);

        return this.repository.findAll({
            ...params,
            page,
            size
        }, codusuario);
    }
    async delete(
        codMovimentacao: number | string | bigint,
        codusuario: number
    ) {
        try {
            return await this.repository.delete(codMovimentacao, codusuario);
        } catch (error: any) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async findAllView(codusuario: number) {
        return await this.repository.findAllView(codusuario)
    }
    async atualizarParcelasAutomaticamente() {
        const movimentacoes = await this.repository.findAtivas();

        const hoje = new Date();

        for (const mov of movimentacoes) {

            const dataMov = new Date(mov.datamov);

            const mesesPassados =
                (hoje.getFullYear() - dataMov.getFullYear()) * 12 +
                (hoje.getMonth() - dataMov.getMonth());

            let qtdParcAtual = mesesPassados + 1;

            if (qtdParcAtual > mov.qtdparcfinal) {
                qtdParcAtual = mov.qtdparcfinal;
            }

            const parcelas = this.calcularParcelas(
                Number(mov.valorunit),
                Number(mov.valorjuros),
                qtdParcAtual,
                Number(mov.qtdparcfinal)
            );

            await this.repository.updateCron(mov.codmovimentacao, {
                qtdparcatual: qtdParcAtual,
                qtdparcpendente: parcelas.qtdparcpendente,
                valortotalpendente: parcelas.valortotalpendente,
                dataatualizacao: new Date(),
            });
        }
    }
}