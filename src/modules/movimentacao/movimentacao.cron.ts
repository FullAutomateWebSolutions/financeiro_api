import cron from "node-cron";
import { MovimentacaoService } from "./movimentacao.service";
import pino from "pino"; 

const log = pino({
    level: 'info'
});

export function startMovimentacaoCron() { 
    log.info("Cron de movimentação iniciado");
    
    const service = new MovimentacaoService();

    cron.schedule("0 14 * * *", async () => {
        log.info("Iniciando execução da atualização automática de parcelas");
        
        try {
            await service.atualizarParcelasAutomaticamente();
            log.info("Atualização automática de parcelas concluída com sucesso");
        } catch (error) {
            log.error({ err: error }, "Erro ao executar atualização automática de parcelas");
        }
    });
}