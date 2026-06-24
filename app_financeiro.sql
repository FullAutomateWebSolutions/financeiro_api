-- ==========================================================
-- BANCO DE DADOS FINANCEIRO (ATUALIZADO PARA JWT E ROLE ENUM)
-- PostgreSQL - Versão Padronizada para Prisma ORM
-- ==========================================================

BEGIN;

-- ==========================================================
-- SCHEMA
-- ==========================================================

CREATE SCHEMA IF NOT EXISTS gestao;

SET search_path TO gestao;

-- ==========================================================
-- ENUMS (Necessário para mapeamento correto com Role do Prisma)
-- ==========================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'usuario_role' AND n.nspname = 'gestao') THEN
        CREATE TYPE gestao.usuario_role AS ENUM ('ADMIN', 'USER', 'MANAGER');
    END IF;
END $$;

-- ==========================================================
-- USUÁRIO (Atualizado com o campo ROLE)
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.usuario (
    "codUsuario" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL UNIQUE,
    "senha" VARCHAR(255) NOT NULL,
    "role" gestao.usuario_role NOT NULL DEFAULT 'USER',
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.usuario ("nome", "email", "senha", "role", "indAtivo")
SELECT 'Administrador Padrao', 'admin@sistema.com', '$2b$10$cHpdXXIY5Gd0f8k2aisDE.fGzl/xRH/evZ0bZ3INDDZBUYujZ9guG', 'ADMIN', TRUE 
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.usuario WHERE "email" = 'admin@sistema.com'
);

-- ==========================================================
-- STATUS
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.status (
    "codStatus" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "descStatus" VARCHAR(100) NOT NULL,
    "descCompleta" VARCHAR(255),
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "codUsuario" INTEGER NOT NULL,
    
    CONSTRAINT fk_status_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario")
);

INSERT INTO gestao.status ("descStatus", "descCompleta", "indAtivo", "codUsuario")
SELECT 'ABERTO', 'Movimento em aberto', TRUE, (SELECT "codUsuario" FROM gestao.usuario LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.status WHERE "descStatus" = 'ABERTO'
);

-- ==========================================================
-- CONTA
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.conta (
    "codConta" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "tipoConta" TEXT NOT NULL,
    "descConta" TEXT NOT NULL,
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "codUsuario" INTEGER NOT NULL,
    
    CONSTRAINT fk_conta_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario")
);

INSERT INTO gestao.conta ("tipoConta", "descConta", "indAtivo", "codUsuario")
SELECT 'CORRENTE', 'Conta Principal', TRUE, (SELECT "codUsuario" FROM gestao.usuario LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.conta WHERE "descConta" = 'Conta Principal'
);

-- ==========================================================
-- FORMA PAGAMENTO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.formapagamento (
    "codFormPag" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "tipoFormPag" TEXT NOT NULL,
    "descFormPag" TEXT NOT NULL,
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "codUsuario" INTEGER NOT NULL,
    
    CONSTRAINT fk_formpag_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario")
);

INSERT INTO gestao.formapagamento ("tipoFormPag", "descFormPag", "indAtivo", "codUsuario")
SELECT 'PIX', 'Pagamento PIX', TRUE, (SELECT "codUsuario" FROM gestao.usuario LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.formapagamento WHERE "tipoFormPag" = 'PIX'
);

-- ==========================================================
-- CARTAO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.cartao (
    "codCartao" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "tipoCartao" TEXT NOT NULL,
    "descCartao" TEXT NOT NULL,
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "codUsuario" INTEGER NOT NULL,
    
    CONSTRAINT fk_cartao_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario")
);

INSERT INTO gestao.cartao ("tipoCartao", "descCartao", "indAtivo", "codUsuario")
SELECT 'CREDITO', 'Cartão Principal', TRUE, (SELECT "codUsuario" FROM gestao.usuario LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.cartao WHERE "descCartao" = 'Cartão Principal'
);

-- ==========================================================
-- CATEGORIA
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.categoria (
    "codCategoria" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "descCategoria" TEXT NOT NULL,
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "codUsuario" INTEGER NOT NULL,
    
    CONSTRAINT fk_categoria_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario")
);

INSERT INTO gestao.categoria ("descCategoria", "indAtivo", "codUsuario")
SELECT 'ALIMENTACAO', TRUE, (SELECT "codUsuario" FROM gestao.usuario LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.categoria WHERE "descCategoria" = 'ALIMENTACAO'
);

-- ==========================================================
-- MOVIMENTACAO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.movimentacao (
    "codMovimentacao" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "dataMov" TIMESTAMP NOT NULL,
    "descMovimento" TEXT NOT NULL,
    "valorUnit" NUMERIC(12,2) NOT NULL,
    "porcJuros" NUMERIC(12,2) DEFAULT 0,
    "valorJuros" NUMERIC(12,2) DEFAULT 0,
    "tipoParcelamento" INTEGER,
    "qtdParcAtual" INTEGER,
    "qtdParcFinal" INTEGER,
    "qtdParcPendente" INTEGER,
    "valorTotalPendente" NUMERIC(12,2),
    "dataFimMov" TIMESTAMP,
    "codFormPag" INTEGER NOT NULL,
    "codConta" INTEGER NOT NULL,
    "codStatus" INTEGER NOT NULL,
    "codCategoria" INTEGER NOT NULL,
    "codCartao" INTEGER,
    "codUsuario" INTEGER NOT NULL, 
    "indAtivo" BOOLEAN DEFAULT TRUE,
    "dataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dataIntegracao" TIMESTAMP,
    "dataFechamento" TIMESTAMP,

    CONSTRAINT fk_mov_formapag FOREIGN KEY ("codFormPag") REFERENCES gestao.formapagamento("codFormPag"),
    CONSTRAINT fk_mov_conta FOREIGN KEY ("codConta") REFERENCES gestao.conta("codConta"),
    CONSTRAINT fk_mov_status FOREIGN KEY ("codStatus") REFERENCES gestao.status("codStatus"),
    CONSTRAINT fk_mov_categoria FOREIGN KEY ("codCategoria") REFERENCES gestao.categoria("codCategoria"),
    CONSTRAINT fk_mov_cartao FOREIGN KEY ("codCartao") REFERENCES gestao.cartao("codCartao"),
    CONSTRAINT fk_mov_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario") 
);

-- ==========================================================
-- MOVIMENTACAO HISTORICO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.movimentacaohist (
    "codMovimentacaoHist" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "codMovimentacao" BIGINT,
    "dataMov" TIMESTAMP,
    "descMovimento" TEXT,
    "valorUnit" NUMERIC(12,2),
    "tipoParcelamento" INTEGER,
    "qtdParcAtual" INTEGER,
    "qtdParcFinal" INTEGER,
    "qtdParcPendente" INTEGER,
    "valorTotalPendente" NUMERIC(12,2),
    "dataFimMov" TIMESTAMP,
    "codFormPag" INTEGER,
    "codConta" INTEGER,
    "codStatus" INTEGER,
    "codCategoria" INTEGER,
    "codCartao" INTEGER,
    "codUsuario" INTEGER, 
    "indAtivo" BOOLEAN,
    "dataCriacao" TIMESTAMP,
    "dataAtualizacao" TIMESTAMP,
    "dataIntegracao" TIMESTAMP,
    "dataFechamento" TIMESTAMP,
    "dataHistorico" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_mov FOREIGN KEY ("codMovimentacao") REFERENCES gestao.movimentacao("codMovimentacao") ON DELETE SET NULL,
    CONSTRAINT fk_hist_formapag FOREIGN KEY ("codFormPag") REFERENCES gestao.formapagamento("codFormPag"),
    CONSTRAINT fk_hist_conta FOREIGN KEY ("codConta") REFERENCES gestao.conta("codConta"),
    CONSTRAINT fk_hist_status FOREIGN KEY ("codStatus") REFERENCES gestao.status("codStatus"),
    CONSTRAINT fk_hist_categoria FOREIGN KEY ("codCategoria") REFERENCES gestao.categoria("codCategoria"),
    CONSTRAINT fk_hist_cartao FOREIGN KEY ("codCartao") REFERENCES gestao.cartao("codCartao"),
    CONSTRAINT fk_hist_usuario FOREIGN KEY ("codUsuario") REFERENCES gestao.usuario("codUsuario")
);

-- ==========================================================
-- ÍNDICES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_mov_status ON gestao.movimentacao("codStatus");
CREATE INDEX IF NOT EXISTS idx_mov_conta ON gestao.movimentacao("codConta");
CREATE INDEX IF NOT EXISTS idx_mov_categoria ON gestao.movimentacao("codCategoria");
CREATE INDEX IF NOT EXISTS idx_mov_cartao ON gestao.movimentacao("codCartao");
CREATE INDEX IF NOT EXISTS idx_mov_data ON gestao.movimentacao("dataMov");
CREATE INDEX IF NOT EXISTS idx_mov_usuario ON gestao.movimentacao("codUsuario");

-- ==========================================================
-- FUNÇÕES DO BANCO DE DADOS
-- ==========================================================

CREATE OR REPLACE FUNCTION gestao.fn_data_atualizacao()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    NEW."dataAtualizacao" := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION gestao.fn_movimentacao_hist()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO gestao.movimentacaohist
    (
        "codMovimentacao", "dataMov", "descMovimento", "valorUnit",
        "tipoParcelamento", "qtdParcAtual", "qtdParcFinal", "qtdParcPendente",
        "valorTotalPendente", "dataFimMov", "codFormPag", "codConta",
        "codStatus", "codCategoria", "codCartao", "codUsuario", "indAtivo",
        "dataCriacao", "dataAtualizacao", "dataIntegracao", "dataFechamento"
    )
    VALUES
    (
        OLD."codMovimentacao", OLD."dataMov", OLD."descMovimento", OLD."valorUnit",
        OLD."tipoParcelamento", OLD."qtdParcAtual", OLD."qtdParcFinal", OLD."qtdParcPendente",
        OLD."valorTotalPendente", OLD."dataFimMov", OLD."codFormPag", OLD."codConta",
        OLD."codStatus", OLD."codCategoria", OLD."codCartao", OLD."codUsuario", OLD."indAtivo",
        OLD."dataCriacao", OLD."dataAtualizacao", OLD."dataIntegracao", OLD."dataFechamento"
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$;

-- ==========================================================
-- GATILHOS (TRIGGERS)
-- ==========================================================

DROP TRIGGER IF EXISTS trg_data_atualizacao_mov ON gestao.movimentacao;
CREATE TRIGGER trg_data_atualizacao_mov
BEFORE UPDATE
ON gestao.movimentacao
FOR EACH ROW
EXECUTE FUNCTION gestao.fn_data_atualizacao();

DROP TRIGGER IF EXISTS trg_movimentacao_hist_delete ON gestao.movimentacao;
CREATE TRIGGER trg_movimentacao_hist_delete
BEFORE DELETE
ON gestao.movimentacao
FOR EACH ROW
EXECUTE FUNCTION gestao.fn_movimentacao_hist();

DROP TRIGGER IF EXISTS trg_movimentacao_hist ON gestao.movimentacao;
CREATE TRIGGER trg_movimentacao_hist
BEFORE UPDATE
ON gestao.movimentacao
FOR EACH ROW
EXECUTE FUNCTION gestao.fn_movimentacao_hist();

-- ==========================================================
-- VIEWS
-- ==========================================================

DROP VIEW IF EXISTS gestao.vw_resumo_financeiro;
CREATE VIEW gestao.vw_resumo_financeiro AS
SELECT
    c."descCategoria",
    SUM(m."valorUnit") AS valor_total,
    COUNT(*) AS quantidade
FROM gestao.movimentacao m
INNER JOIN gestao.categoria c ON c."codCategoria" = m."codCategoria"
GROUP BY c."descCategoria";

-- ==========================================================
-- DADOS TESTE MOVIMENTAÇÃO
-- ==========================================================

INSERT INTO gestao.movimentacao
(
    "dataMov", "descMovimento", "valorUnit", "porcJuros", "valorJuros",
    "tipoParcelamento", "qtdParcAtual", "qtdParcFinal", "qtdParcPendente",
    "valorTotalPendente", "dataFimMov", "codFormPag", "codConta",
    "codStatus", "codCategoria", "codCartao", "codUsuario", "indAtivo"
)
SELECT
    CURRENT_TIMESTAMP, 'Compra Mercado', 100.00, 5.00, 5.00,
    1, 1, 10, 9, 945.00, CURRENT_TIMESTAMP + INTERVAL '9 month',
    (SELECT "codFormPag" FROM gestao.formapagamento LIMIT 1),
    (SELECT "codConta" FROM gestao.conta LIMIT 1),
    (SELECT "codStatus" FROM gestao.status LIMIT 1),
    (SELECT "codCategoria" FROM gestao.categoria LIMIT 1),
    (SELECT "codCartao" FROM gestao.cartao LIMIT 1),
    (SELECT "codUsuario" FROM gestao.usuario LIMIT 1), 
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.movimentacao WHERE "descMovimento" = 'Compra Mercado'
);

COMMIT;

-- ==========================================================
-- VALIDAÇÃO FINAL E CONTROLE DE ACESSO
-- ==========================================================

SELECT 'USUARIO' AS tabela, COUNT(*) registros FROM gestao.usuario
UNION ALL
SELECT 'STATUS', COUNT(*) FROM gestao.status
UNION ALL
SELECT 'CONTA', COUNT(*) FROM gestao.conta
UNION ALL
SELECT 'FORMA_PAGAMENTO', COUNT(*) FROM gestao.formapagamento
UNION ALL
SELECT 'CARTAO', COUNT(*) FROM gestao.cartao
UNION ALL
SELECT 'CATEGORIA', COUNT(*) FROM gestao.categoria
UNION ALL
SELECT 'MOVIMENTACAO', COUNT(*) FROM gestao.movimentacao
UNION ALL
SELECT 'MOVIMENTACAO_HIST', COUNT(*) FROM gestao.movimentacaohist;

-- 1. Cria o usuário do banco se ele não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_financeiro') THEN
        CREATE USER app_financeiro WITH PASSWORD 'h5PY1MI6krfwr_p115';
    END IF;
END $$;

-- 2. Garante conexão ao banco (ajuste 'appdb' se o nome do banco for diferente)
-- GRANT CONNECT ON DATABASE appdb TO app_financeiro;

-- 3. Permissão para criar objetos (necessário para migrations)
-- GRANT CREATE ON DATABASE appdb TO app_financeiro;

-- 4. Remove permissões públicas do schema
REVOKE ALL ON SCHEMA gestao FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA gestao FROM PUBLIC;

-- 5. Permissão de uso e criação no schema
GRANT USAGE ON SCHEMA gestao TO app_financeiro;
GRANT CREATE ON SCHEMA gestao TO app_financeiro;

-- 6. Permissões CRUD nas tabelas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA gestao TO app_financeiro;

-- 7. Permissões nas sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA gestao TO app_financeiro;

-- 8. Permissões futuras (tabelas novas)
ALTER DEFAULT PRIVILEGES IN SCHEMA gestao
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_financeiro;

ALTER DEFAULT PRIVILEGES IN SCHEMA gestao
GRANT USAGE, SELECT ON SEQUENCES TO app_financeiro;

-- 9. IMPORTANTE: tornar o usuário dono do schema
ALTER SCHEMA gestao OWNER TO app_financeiro;

-- 10. Transferir ownership das tabelas existentes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'gestao'
    LOOP
        EXECUTE format(
            'ALTER TABLE gestao.%I OWNER TO app_financeiro',
            r.tablename
        );
    END LOOP;
END $$;

-- 11. Transferir ownership das sequences existentes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT sequencename
        FROM pg_sequences
        WHERE schemaname = 'gestao'
    LOOP
        EXECUTE format(
            'ALTER SEQUENCE gestao.%I OWNER TO app_financeiro',
            r.sequencename
        );
    END LOOP;
END $$;