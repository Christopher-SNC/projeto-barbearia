-- Projeto Barbearia
-- Garante um favorito por usuario e barbearia.
-- Executar uma unica vez no banco projeto_barbearia.

BEGIN;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.favorito
        GROUP BY id_usuario, id_barbearia
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Existem favoritos duplicados. Corrija-os antes da migracao.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.favorito'::regclass
          AND conname = 'uq_favorito_usuario_barbearia'
    ) THEN
        ALTER TABLE public.favorito
            ADD CONSTRAINT uq_favorito_usuario_barbearia
            UNIQUE (id_usuario, id_barbearia);
    END IF;
END
$$;

COMMIT;