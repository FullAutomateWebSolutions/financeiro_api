-- 1. Cria o usuário do banco se ele não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_imperiumnexus') THEN
        CREATE USER app_imperiumnexus WITH PASSWORD 'h5PY1MI6krfwr_p16';
    END IF;
END $$;

-- 2. Garante conexão ao banco
GRANT CONNECT ON DATABASE appdb TO app_imperiumnexus;

-- 3. Permissão para criar objetos (necessário para migrations)
GRANT CREATE ON DATABASE appdb TO app_imperiumnexus;

-- 4. Remove permissões públicas do schema
REVOKE ALL ON SCHEMA imperiumnexus FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA imperiumnexus FROM PUBLIC;

-- 5. Permissão de uso e criação no schema
GRANT USAGE ON SCHEMA imperiumnexus TO app_imperiumnexus;
GRANT CREATE ON SCHEMA imperiumnexus TO app_imperiumnexus;

-- 6. Permissões CRUD nas tabelas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA imperiumnexus TO app_imperiumnexus;

-- 7. Permissões nas sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA imperiumnexus TO app_imperiumnexus;

-- 8. Permissões futuras (tabelas novas)
ALTER DEFAULT PRIVILEGES IN SCHEMA imperiumnexus
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_imperiumnexus;

ALTER DEFAULT PRIVILEGES IN SCHEMA imperiumnexus
GRANT USAGE, SELECT ON SEQUENCES TO app_imperiumnexus;

-- 9.  IMPORTANTE: tornar o usuário dono do schema
-- (necessário para ALTER TABLE funcionar sem erro 42501)
ALTER SCHEMA imperiumnexus OWNER TO app_imperiumnexus;

-- 10.  Transferir ownership das tabelas existentes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'imperiumnexus'
    LOOP
        EXECUTE format(
            'ALTER TABLE imperiumnexus.%I OWNER TO app_imperiumnexus',
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
        WHERE schemaname = 'imperiumnexus'
    LOOP
        EXECUTE format(
            'ALTER SEQUENCE imperiumnexus.%I OWNER TO app_imperiumnexus',
            r.sequencename
        );
    END LOOP;
END $$;

---Trocar senha do admin
docker exec -it postgres psql -U admin -d appdb
ALTER USER admin WITH PASSWORD 'NovaSenhaForte123';
\du ---- comando para ver usuarios