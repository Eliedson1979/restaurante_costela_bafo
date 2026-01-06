-- 1. Adicionar coluna 'role' na tabela profiles se não existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Atualizar políticas da tabela ORDERS
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pedidos" ON orders;
CREATE POLICY "Usuários veem seus pedidos e Admin vê todos" ON orders
    FOR SELECT USING (
        auth.uid() = user_id 
        OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. Atualizar políticas da tabela ORDER_ITEMS
DROP POLICY IF EXISTS "Usuários podem ver itens de seus pedidos" ON order_items;
CREATE POLICY "Usuários veem seus itens e Admin vê todos" ON order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 4. Atualizar políticas da tabela QUENTINHAS
DROP POLICY IF EXISTS "Usuários podem ver suas próprias quentinhas" ON quentinhas;
CREATE POLICY "Usuários veem suas quentinhas e Admin vê todas" ON quentinhas
    FOR SELECT USING (
        auth.uid() = user_id 
        OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Atualizar políticas da tabela PROFILES (para permitir ver roles)
DROP POLICY IF EXISTS "Perfis são visíveis publicamente" ON profiles;
CREATE POLICY "Perfis visíveis para todos" ON profiles FOR SELECT USING (true);
