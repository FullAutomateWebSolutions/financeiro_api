-- ==========================================================
-- BANCO DE DADOS FINANCEIRO
-- PostgreSQL
-- Script Único
-- Criação de tabelas + relacionamentos + dados de teste
-- ==========================================================

BEGIN;

-- ==========================================================
-- SCHEMA
-- ==========================================================

CREATE SCHEMA IF NOT EXISTS gestao;

SET search_path TO gestao;

-- ==========================================================
-- STATUS
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.status (
    codStatus INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descStatus VARCHAR(100) NOT NULL,
    descCompleta VARCHAR(255),
    indAtivo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO status
(descStatus, descCompleta, indAtivo)
SELECT
    'ABERTO',
    'Movimento em aberto',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM gestao.status
    WHERE descStatus = 'ABERTO'
);

-- ==========================================================
-- CONTA
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.conta (
    codConta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipoConta TEXT NOT NULL,
    descConta TEXT NOT NULL,
    indAtivo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.conta
(tipoConta, descConta, indAtivo)
SELECT
    'CORRENTE',
    'Conta Principal',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM gestao.conta
    WHERE descConta = 'Conta Principal'
);

-- ==========================================================
-- FORMA PAGAMENTO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.formaPagamento (
    codFormPag INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipoFormPag TEXT NOT NULL,
    descFormPag TEXT NOT NULL,
    indAtivo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.formaPagamento
(tipoFormPag, descFormPag, indAtivo)
SELECT
    'PIX',
    'Pagamento PIX',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM gestao.formaPagamento
    WHERE tipoFormPag = 'PIX'
);

-- ==========================================================
-- CARTAO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.cartao (
    codCartao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipoCartao TEXT NOT NULL,
    descCartao TEXT NOT NULL,
    indAtivo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.cartao
(tipoCartao, descCartao, indAtivo)
SELECT
    'CREDITO',
    'Cartão Principal',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM gestao.cartao
    WHERE descCartao = 'Cartão Principal'
);

-- ==========================================================
-- CATEGORIA
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.categoria (
    codCategoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descCategoria TEXT NOT NULL,
    indAtivo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.categoria
(descCategoria, indAtivo)
SELECT
    'ALIMENTACAO',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM gestao.categoria
    WHERE descCategoria = 'ALIMENTACAO'
);

-- ==========================================================
-- MOVIMENTACAO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.movimentacao (
    codMovimentacao BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    dataMov TIMESTAMP NOT NULL,

    descMovimento TEXT NOT NULL,

    valorUnit NUMERIC(12,2) NOT NULL,

    porcJuros NUMERIC(12,2) DEFAULT 0,

    valorJuros NUMERIC(12,2) DEFAULT 0,

    tipoParcelamento INTEGER,

    qtdParcAtual INTEGER,

    qtdParcFinal INTEGER,

    qtdParcPendente INTEGER,

    valorTotalPendente NUMERIC(12,2),

    dataFimMov TIMESTAMP,

    codFormPag INTEGER NOT NULL,

    codConta INTEGER NOT NULL,

    codStatus INTEGER NOT NULL,

    codCategoria INTEGER NOT NULL,

    codCartao INTEGER,

    indAtivo BOOLEAN DEFAULT TRUE,

    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    dataIntegracao TIMESTAMP,

    dataFechamento TIMESTAMP,

    CONSTRAINT fk_mov_formapag
        FOREIGN KEY (codFormPag)
        REFERENCES gestao.formaPagamento(codFormPag),

    CONSTRAINT fk_mov_conta
        FOREIGN KEY (codConta)
        REFERENCES gestao.conta(codConta),

    CONSTRAINT fk_mov_status
        FOREIGN KEY (codStatus)
        REFERENCES gestao.status(codStatus),

    CONSTRAINT fk_mov_categoria
        FOREIGN KEY (codCategoria)
        REFERENCES gestao.categoria(codCategoria),

    CONSTRAINT fk_mov_cartao
        FOREIGN KEY (codCartao)
        REFERENCES gestao.cartao(codCartao)
);

-- ==========================================================
-- MOVIMENTACAO HISTORICO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.movimentacaoHist (
    codMovimentacaoHist BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    codMovimentacao BIGINT,

    dataMov TIMESTAMP,

    descMovimento TEXT,

    valorUnit NUMERIC(12,2),

    tipoParcelamento INTEGER,

    qtdParcAtual INTEGER,

    qtdParcFinal INTEGER,

    qtdParcPendente INTEGER,

    valorTotalPendente NUMERIC(12,2),

    dataFimMov TIMESTAMP,

    codFormPag INTEGER,

    codConta INTEGER,

    codStatus INTEGER,

    codCategoria INTEGER,

    codCartao INTEGER,

    indAtivo BOOLEAN,

    dataCriacao TIMESTAMP,

    dataAtualizacao TIMESTAMP,

    dataIntegracao TIMESTAMP,

    dataFechamento TIMESTAMP,

    dataHistorico TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_mov
        FOREIGN KEY (codMovimentacao)
        REFERENCES gestao.movimentacao(codMovimentacao),

    CONSTRAINT fk_hist_formapag
        FOREIGN KEY (codFormPag)
        REFERENCES gestao.formaPagamento(codFormPag),

    CONSTRAINT fk_hist_conta
        FOREIGN KEY (codConta)
        REFERENCES gestao.conta(codConta),

    CONSTRAINT fk_hist_status
        FOREIGN KEY (codStatus)
        REFERENCES gestao.status(codStatus),

    CONSTRAINT fk_hist_categoria
        FOREIGN KEY (codCategoria)
        REFERENCES gestao.categoria(codCategoria),

    CONSTRAINT fk_hist_cartao
        FOREIGN KEY (codCartao)
        REFERENCES gestao.cartao(codCartao)
);

-- ==========================================================
-- ÍNDICES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_mov_status
ON gestao.movimentacao(codStatus);

CREATE INDEX IF NOT EXISTS idx_mov_conta
ON gestao.movimentacao(codConta);

CREATE INDEX IF NOT EXISTS idx_mov_categoria
ON gestao.movimentacao(codCategoria);

CREATE INDEX IF NOT EXISTS idx_mov_cartao
ON gestao.movimentacao(codCartao);

CREATE INDEX IF NOT EXISTS idx_mov_data
ON gestao.movimentacao(dataMov);

-- ==========================================================
-- TRIGGER HISTÓRICO
-- ==========================================================

CREATE OR REPLACE FUNCTION gestao.fn_data_atualizacao()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    NEW.dataAtualizacao := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_data_atualizacao_mov
BEFORE UPDATE
ON gestao.movimentacao
FOR EACH ROW
EXECUTE FUNCTION gestao.fn_data_atualizacao();

----Se alguém apagar uma movimentação, o histórico é perdido.
CREATE TRIGGER trg_movimentacao_hist_delete
BEFORE DELETE
ON gestao.movimentacao
FOR EACH ROW
EXECUTE FUNCTION gestao.fn_movimentacao_hist();


--Views para dashboard
CREATE VIEW gestao.vw_resumo_financeiro AS
SELECT
    c.desccategoria,
    SUM(m.valorunit) valor_total,
    COUNT(*) quantidade
FROM gestao.movimentacao m
INNER JOIN gestao.categoria c
    ON c.codcategoria = m.codcategoria
GROUP BY c.desccategoria;


CREATE OR REPLACE FUNCTION fn_movimentacao_hist()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    INSERT INTO gestao.movimentacaoHist
    (
        codMovimentacao,
        dataMov,
        descMovimento,
        valorUnit,
        tipoParcelamento,
        qtdParcAtual,
        qtdParcFinal,
        qtdParcPendente,
        valorTotalPendente,
        dataFimMov,
        codFormPag,
        codConta,
        codStatus,
        codCategoria,
        codCartao,
        indAtivo,
        dataCriacao,
        dataAtualizacao,
        dataIntegracao,
        dataFechamento
    )
    VALUES
    (
        OLD.codMovimentacao,
        OLD.dataMov,
        OLD.descMovimento,
        OLD.valorUnit,
        OLD.tipoParcelamento,
        OLD.qtdParcAtual,
        OLD.qtdParcFinal,
        OLD.qtdParcPendente,
        OLD.valorTotalPendente,
        OLD.dataFimMov,
        OLD.codFormPag,
        OLD.codConta,
        OLD.codStatus,
        OLD.codCategoria,
        OLD.codCartao,
        OLD.indAtivo,
        OLD.dataCriacao,
        OLD.dataAtualizacao,
        OLD.dataIntegracao,
        OLD.dataFechamento
    );

    RETURN NEW;

END;
$$;

DROP TRIGGER IF EXISTS trg_movimentacao_hist
ON gestao.movimentacao;

CREATE TRIGGER trg_movimentacao_hist
BEFORE UPDATE
ON gestao.movimentacao
FOR EACH ROW
EXECUTE FUNCTION fn_movimentacao_hist();

-- ==========================================================
-- DADOS TESTE MOVIMENTAÇÃO
-- ==========================================================

INSERT INTO gestao.movimentacao
(
    dataMov,
    descMovimento,
    valorUnit,
    porcJuros,
    valorJuros,
    tipoParcelamento,
    qtdParcAtual,
    qtdParcFinal,
    qtdParcPendente,
    valorTotalPendente,
    dataFimMov,
    codFormPag,
    codConta,
    codStatus,
    codCategoria,
    codCartao,
    indAtivo
)
SELECT
    CURRENT_TIMESTAMP,
    'Compra Mercado',
    100.00,
    5.00,
    5.00,
    1,
    1,
    10,
    9,
    945.00,
    CURRENT_TIMESTAMP + INTERVAL '9 month',
    (SELECT codFormPag FROM gestao.formaPagamento LIMIT 1),
    (SELECT codConta FROM gestao.conta LIMIT 1),
    (SELECT codStatus FROM gestao.status LIMIT 1),
    (SELECT codCategoria FROM gestao.categoria LIMIT 1),
    (SELECT codCartao FROM gestao.cartao LIMIT 1),
    TRUE
WHERE NOT EXISTS
(
    SELECT 1
    FROM gestao.movimentacao
    WHERE descMovimento = 'Compra Mercado'
);

COMMIT;

-- ==========================================================
-- VALIDAÇÃO FINAL
-- ==========================================================

SELECT 'STATUS' AS tabela, COUNT(*) registros FROM gestao.status
UNION ALL
SELECT 'CONTA', COUNT(*) FROM conta
UNION ALL
SELECT 'FORMA_PAGAMENTO', COUNT(*) FROM gestao.formaPagamento
UNION ALL
SELECT 'CARTAO', COUNT(*) FROM gestao.cartao
UNION ALL
SELECT 'CATEGORIA', COUNT(*) FROM gestao.categoria
UNION ALL
SELECT 'MOVIMENTACAO', COUNT(*) FROM gestao.movimentacao
UNION ALL
SELECT 'MOVIMENTACAO_HIST', COUNT(*) FROM gestao.movimentacaoHist;



