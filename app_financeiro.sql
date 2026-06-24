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
    codusuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role gestao.usuario_role NOT NULL DEFAULT 'USER',
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.usuario (nome, email, senha, role, indativo)
SELECT 'Administrador Padrao', 'admin@sistema.com', '$2b$10$cHpdXXIY5Gd0f8k2aisDE.fGzl/xRH/evZ0bZ3INDDZBUYujZ9guG', 'ADMIN', TRUE 
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.usuario WHERE email = 'admin@sistema.com'
);

-- ==========================================================
-- STATUS
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.status (
    codstatus INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descstatus VARCHAR(100) NOT NULL,
    desccompleta VARCHAR(255),
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.status (descstatus, desccompleta, indativo)
SELECT 'ABERTO', 'Movimento em aberto', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.status WHERE descstatus = 'ABERTO'
);

-- ==========================================================
-- CONTA
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.conta (
    codconta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipoconta TEXT NOT NULL,
    descconta TEXT NOT NULL,
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.conta (tipoconta, descconta, indativo)
SELECT 'CORRENTE', 'Conta Principal', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.conta WHERE descconta = 'Conta Principal'
);

-- ==========================================================
-- FORMA PAGAMENTO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.formapagamento (
    codformpag INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipoformpag TEXT NOT NULL,
    descformpag TEXT NOT NULL,
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.formapagamento (tipoformpag, descformpag, indativo)
SELECT 'PIX', 'Pagamento PIX', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.formapagamento WHERE tipoformpag = 'PIX'
);

-- ==========================================================
-- CARTAO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.cartao (
    codcartao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipocartao TEXT NOT NULL,
    desccartao TEXT NOT NULL,
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.cartao (tipocartao, desccartao, indativo)
SELECT 'CREDITO', 'Cartão Principal', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.cartao WHERE desccartao = 'Cartão Principal'
);

-- ==========================================================
-- CATEGORIA
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.categoria (
    codcategoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    desccategoria TEXT NOT NULL,
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gestao.categoria (desccategoria, indativo)
SELECT 'ALIMENTACAO', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.categoria WHERE desccategoria = 'ALIMENTACAO'
);

-- ==========================================================
-- MOVIMENTACAO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.movimentacao (
    codmovimentacao BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    datamov TIMESTAMP NOT NULL,
    descmovimento TEXT NOT NULL,
    valorunit NUMERIC(12,2) NOT NULL,
    porcjuros NUMERIC(12,2) DEFAULT 0,
    valorjuros NUMERIC(12,2) DEFAULT 0,
    tipoparcelamento INTEGER,
    qtdparcatual INTEGER,
    qtdparcfinal INTEGER,
    qtdparcpendente INTEGER,
    valortotalpendente NUMERIC(12,2),
    datafimmov TIMESTAMP,
    codformpag INTEGER NOT NULL,
    codconta INTEGER NOT NULL,
    codstatus INTEGER NOT NULL,
    codcategoria INTEGER NOT NULL,
    codcartao INTEGER,
    codusuario INTEGER NOT NULL, 
    indativo BOOLEAN DEFAULT TRUE,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataatualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataintegracao TIMESTAMP,
    datafechamento TIMESTAMP,

    CONSTRAINT fk_mov_formapag FOREIGN KEY (codformpag) REFERENCES gestao.formapagamento(codformpag),
    CONSTRAINT fk_mov_conta FOREIGN KEY (codconta) REFERENCES gestao.conta(codconta),
    CONSTRAINT fk_mov_status FOREIGN KEY (codstatus) REFERENCES gestao.status(codstatus),
    CONSTRAINT fk_mov_categoria FOREIGN KEY (codcategoria) REFERENCES gestao.categoria(codcategoria),
    CONSTRAINT fk_mov_cartao FOREIGN KEY (codcartao) REFERENCES gestao.cartao(codcartao),
    CONSTRAINT fk_mov_usuario FOREIGN KEY (codusuario) REFERENCES gestao.usuario(codusuario) 
);

-- ==========================================================
-- MOVIMENTACAO HISTORICO
-- ==========================================================

CREATE TABLE IF NOT EXISTS gestao.movimentacaohist (
    codmovimentacaohist BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codmovimentacao BIGINT,
    datamov TIMESTAMP,
    descmovimento TEXT,
    valorunit NUMERIC(12,2),
    tipoparcelamento INTEGER,
    qtdparcatual INTEGER,
    qtdparcfinal INTEGER,
    qtdparcpendente INTEGER,
    valortotalpendente NUMERIC(12,2),
    datafimmov TIMESTAMP,
    codformpag INTEGER,
    codconta INTEGER,
    codstatus INTEGER,
    codcategoria INTEGER,
    codcartao INTEGER,
    codusuario INTEGER, 
    indativo BOOLEAN,
    datacriacao TIMESTAMP,
    dataatualizacao TIMESTAMP,
    dataintegracao TIMESTAMP,
    datafechamento TIMESTAMP,
    datahistorico TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_mov FOREIGN KEY (codmovimentacao) REFERENCES gestao.movimentacao(codmovimentacao) ON DELETE SET NULL,
    CONSTRAINT fk_hist_formapag FOREIGN KEY (codformpag) REFERENCES gestao.formapagamento(codformpag),
    CONSTRAINT fk_hist_conta FOREIGN KEY (codconta) REFERENCES gestao.conta(codconta),
    CONSTRAINT fk_hist_status FOREIGN KEY (codstatus) REFERENCES gestao.status(codstatus),
    CONSTRAINT fk_hist_categoria FOREIGN KEY (codcategoria) REFERENCES gestao.categoria(codcategoria),
    CONSTRAINT fk_hist_cartao FOREIGN KEY (codcartao) REFERENCES gestao.cartao(codcartao),
    CONSTRAINT fk_hist_usuario FOREIGN KEY (codusuario) REFERENCES gestao.usuario(codusuario)
);

-- ==========================================================
-- ÍNDICES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_mov_status ON gestao.movimentacao(codstatus);
CREATE INDEX IF NOT EXISTS idx_mov_conta ON gestao.movimentacao(codconta);
CREATE INDEX IF NOT EXISTS idx_mov_categoria ON gestao.movimentacao(codcategoria);
CREATE INDEX IF NOT EXISTS idx_mov_cartao ON gestao.movimentacao(codcartao);
CREATE INDEX IF NOT EXISTS idx_mov_data ON gestao.movimentacao(datamov);
CREATE INDEX IF NOT EXISTS idx_mov_usuario ON gestao.movimentacao(codusuario);

-- ==========================================================
-- FUNÇÕES DO BANCO DE DADOS
-- ==========================================================

CREATE OR REPLACE FUNCTION gestao.fn_data_atualizacao()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    NEW.dataatualizacao := CURRENT_TIMESTAMP;
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
        codmovimentacao, datamov, descmovimento, valorunit,
        tipoparcelamento, qtdparcatual, qtdparcfinal, qtdparcpendente,
        valortotalpendente, datafimmov, codformpag, codconta,
        codstatus, codcategoria, codcartao, codusuario, indativo,
        datacriacao, dataatualizacao, dataintegracao, datafechamento
    )
    VALUES
    (
        OLD.codmovimentacao, OLD.datamov, OLD.descmovimento, OLD.valorunit,
        OLD.tipoparcelamento, OLD.qtdparcatual, OLD.qtdparcfinal, OLD.qtdparcpendente,
        OLD.valortotalpendente, OLD.datafimmov, OLD.codformpag, OLD.codconta,
        OLD.codstatus, OLD.codcategoria, OLD.codcartao, OLD.codusuario, OLD.indativo,
        OLD.datacriacao, OLD.dataatualizacao, OLD.dataintegracao, OLD.datafechamento
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
    c.desccategoria,
    SUM(m.valorunit) AS valor_total,
    COUNT(*) AS quantidade
FROM gestao.movimentacao m
INNER JOIN gestao.categoria c ON c.codcategoria = m.codcategoria
GROUP BY c.desccategoria;

-- ==========================================================
-- DADOS TESTE MOVIMENTAÇÃO
-- ==========================================================

INSERT INTO gestao.movimentacao
(
    datamov, descmovimento, valorunit, porcjuros, valorjuros,
    tipoparcelamento, qtdparcatual, qtdparcfinal, qtdparcpendente,
    valortotalpendente, datafimmov, codformpag, codconta,
    codstatus, codcategoria, codcartao, codusuario, indativo
)
SELECT
    CURRENT_TIMESTAMP, 'Compra Mercado', 100.00, 5.00, 5.00,
    1, 1, 10, 9, 945.00, CURRENT_TIMESTAMP + INTERVAL '9 month',
    (SELECT codformpag FROM gestao.formapagamento LIMIT 1),
    (SELECT codconta FROM gestao.conta LIMIT 1),
    (SELECT codstatus FROM gestao.status LIMIT 1),
    (SELECT codcategoria FROM gestao.categoria LIMIT 1),
    (SELECT codcartao FROM gestao.cartao LIMIT 1),
    (SELECT codusuario FROM gestao.usuario LIMIT 1), 
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM gestao.movimentacao WHERE descmovimento = 'Compra Mercado'
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

-- 2. Garante conexão ao banco
GRANT CONNECT ON DATABASE appdb TO app_financeiro;

-- 3. Permissão para criar objetos (necessário para migrations)
GRANT CREATE ON DATABASE appdb TO app_financeiro;

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

-- 9.  IMPORTANTE: tornar o usuário dono do schema
-- (necessário para ALTER TABLE funcionar sem erro 42501)
ALTER SCHEMA gestao OWNER TO app_financeiro;

-- 10.  Transferir ownership das tabelas existentes
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

-- 11.  Transferir ownership das sequences existentes
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

