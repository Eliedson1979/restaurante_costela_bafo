-- Tabela para persistir o carrinho de compras
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    type TEXT, -- 'menu' ou 'quentinha'
    details JSONB, -- Para armazenar escolhas de acompanhamentos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver seu próprio carrinho" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir no próprio carrinho" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio carrinho" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar do próprio carrinho" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);
