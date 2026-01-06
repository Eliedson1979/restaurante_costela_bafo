-- ============================================
-- ADICIONAR COLUNA 'image' NA TABELA PRODUCTS
-- ============================================
-- Execute este SQL no Supabase SQL Editor

-- Adicionar a coluna 'image' (caso não exista)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Copiar dados de image_url para image (se houver dados)
UPDATE products 
SET image = image_url 
WHERE image IS NULL AND image_url IS NOT NULL;

-- Opcional: Se quiser usar apenas 'image' e remover 'image_url'
-- ALTER TABLE products DROP COLUMN image_url;

-- Verificar a estrutura da tabela
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'products';
