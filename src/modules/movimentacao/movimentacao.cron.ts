import cron from "node-cron";
import { MovimentacaoService } from "./movimentacao.service";

export function startMovimentacaoCron() {
    console.log("Cron de movimentação iniciado");

    const service = new MovimentacaoService();

    cron.schedule("0 12 * * *", async () => {
        console.log("Executando atualização automática de parcelas");

        await service.atualizarParcelasAutomaticamente();
    });
}