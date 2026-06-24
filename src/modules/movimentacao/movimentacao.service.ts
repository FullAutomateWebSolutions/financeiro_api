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
            qtdParcPendente: pendentes,
            valorTotalPendente: Number(totalPendente.toFixed(2)),
        }
    }
    
    private calcularDataFinal(dataMov: Date, qtdParcFinal: number) {
        const data = new Date(dataMov)
        data.setMonth(data.getMonth() + (qtdParcFinal - 1))
        return data
    }
    
    async create(data: any, codUsuario: number) {
        const valorUnit = Number(data.valorUnit || 0)
        const porcJuros = Number(data.porcJuros || 0)
        const qtdParcAtual = Number(data.qtdParcAtual || 1)
        const qtdParcFinal = Number(data.qtdParcFinal || 1)

        const valorJuros = this.calcularJuros(valorUnit, porcJuros)
        const parcelas = this.calcularParcelas(valorUnit, valorJuros, qtdParcAtual, qtdParcFinal)
        const dataFimMov = this.calcularDataFinal(new Date(data.dataMov), qtdParcFinal)

        return this.repository.create({
            dataMov: new Date(data.dataMov),
            descMovimento: data.descMovimento,
            valorUnit: valorUnit,
            porcJuros: porcJuros,
            valorJuros: valorJuros,
            tipoParcelamento: data.tipoParcelamento,
            qtdParcAtual: qtdParcAtual,
            qtdParcFinal: qtdParcFinal,
            qtdParcPendente: parcelas.qtdParcPendente,
            valorTotalPendente: parcelas.valorTotalPendente,
            dataFimMov: dataFimMov,
            codFormPag: data.codFormPag,
            codConta: data.codConta,
            codStatus: data.codStatus,
            codCategoria: data.codCategoria,
            codCartao: data.codCartao,
            indAtivo: true,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
        }, codUsuario)
    }
    
    async update(
        codMovimentacao: number | string | bigint,
        codUsuario: number,
        data: any,
    ) {
        const registroAtual = await this.repository.findById(codMovimentacao, codUsuario);
        if (!registroAtual) {
            throw new Error(`Movimentação com o ID ${codMovimentacao} não foi encontrada ou não pertence a você.`);
        }

        const valorUnit = (data.valorUnit !== undefined && data.valorUnit !== null && data.valorUnit !== '')
            ? Number(data.valorUnit)
            : Number(registroAtual.valorUnit);

        const porcJuros = data.porcJuros !== undefined ? Number(data.porcJuros) : Number(registroAtual.porcJuros);
        const qtdParcAtual = data.qtdParcAtual !== undefined ? Number(data.qtdParcAtual) : Number(registroAtual.qtdParcAtual);
        const qtdParcFinal = data.qtdParcFinal !== undefined ? Number(data.qtdParcFinal) : Number(registroAtual.qtdParcFinal);

        const dataMovRaw = data.dataMov !== undefined ? data.dataMov : registroAtual.dataMov;
        const dataMov = new Date(dataMovRaw);

        const indAtivo = data.indAtivo !== undefined ? data.indAtivo : registroAtual.indAtivo;

        const valorJuros = this.calcularJuros(valorUnit, porcJuros);
        const parcelas = this.calcularParcelas(valorUnit, valorJuros, qtdParcAtual, qtdParcFinal);
        const dataFimMov = this.calcularDataFinal(dataMov, qtdParcFinal);

        const { valorUnit: _, porcJuros: __, valorJuros: ___, indAtivo: ____, ...dadosRestantes } = data;

        return this.repository.update(
            codMovimentacao,
            codUsuario,
            {
                ...dadosRestantes,
                dataMov: dataMov,
                valorUnit: valorUnit,
                porcJuros: porcJuros,
                valorJuros: valorJuros,
                qtdParcAtual: qtdParcAtual,
                qtdParcFinal: qtdParcFinal,
                qtdParcPendente: parcelas.qtdParcPendente,
                valorTotalPendente: parcelas.valorTotalPendente,
                dataFimMov: dataFimMov,
                indAtivo: indAtivo,
            },
        );
    }
    
    async finalizar(
        codMovimentacao: number | string | bigint,
        codUsuario: number,
    ) {
        return this.repository.update(
            codMovimentacao,
            codUsuario,
            {
                dataFechamento: new Date(),
                indAtivo: false,
                dataAtualizacao: new Date(),
            },
        )
    }
    
    async findById(
        codMovimentacao: number | string | bigint,
        codUsuario: number
    ) {
        return this.repository.findById(codMovimentacao, codUsuario)
    }
    
    async findAll(
        params: {
            page: number;
            size: number;
            sort?: string;
            descMovimento?: string;
            codCategoria?: number;
            codConta?: number;
            dataInicio?: string | Date;
            dataFim?: string | Date;
            codCartao?: number
        },
        codUsuario: number
    ) {
        const page = Number(params.page ?? 0);
        const size = Number(params.size ?? 10);

        return this.repository.findAll({
            ...params,
            page,
            size
        }, codUsuario);
    }
    
    async delete(
        codMovimentacao: number | string | bigint,
        codUsuario: number
    ) {
        try {
            return await this.repository.delete(codMovimentacao, codUsuario);
        } catch (error: any) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    
    async findAllView(codUsuario: number) {
        return await this.repository.findAllView(codUsuario)
    }

    async findAtivas(codUsuario: number) {
        return await this.repository.findAtivas(codUsuario);
    }
    
    async atualizarParcelasAutomaticamente() {
        const hoje = new Date();
    }
}