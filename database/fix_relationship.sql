-- Corrigir relacionamento para permitir que Orders acesse Profiles diretamente
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Recarregar schema cache (opcional, mas o supabase faz auto geralmente)
NOTIFY pgrst, 'reload schema';
