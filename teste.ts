import { Client } from "pg";

async function consulta() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    const result = await client.query(`
        SELECT *
        FROM gestao.vw_resumo_financeiro
    `);

    await client.end();
     console.log(result.rows)
    return result.rows;
}