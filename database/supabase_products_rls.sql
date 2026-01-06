-- ============================================
-- POLÍTICAS RLS PARA TABELA PRODUCTS
-- ============================================
-- Execute este SQL no Supabase SQL Editor

-- 1. Habilitar RLS na tabela products (se ainda não estiver habilitado)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir leitura pública de produtos" ON products;
DROP POLICY IF EXISTS "Permitir admin criar produtos" ON products;
DROP POLICY IF EXISTS "Permitir admin atualizar produtos" ON products;
DROP POLICY IF EXISTS "Permitir admin deletar produtos" ON products;

-- 3. Criar política para LEITURA PÚBLICA (todos podem ver produtos)
CREATE POLICY "Permitir leitura pública de produtos"
ON products
FOR SELECT
TO public
USING (true);

-- 4. Criar política para INSERÇÃO (apenas admins)
CREATE POLICY "Permitir admin criar produtos"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 5. Criar política para ATUALIZAÇÃO (apenas admins)
CREATE POLICY "Permitir admin atualizar produtos"
ON products
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 6. Criar política para EXCLUSÃO (apenas admins)
CREATE POLICY "Permitir admin deletar produtos"
ON products
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- VERIFICAR SE SEU USUÁRIO É ADMIN
-- ============================================
-- Execute esta query para verificar seu role:
-- SELECT id, email, role FROM profiles WHERE id = auth.uid();

-- Se você não for admin, execute:
-- UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
