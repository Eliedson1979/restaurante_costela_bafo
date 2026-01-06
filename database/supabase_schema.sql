-- Tabela de Perfis (Cadastro Público)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Função para criar perfil automaticamente ao cadastrar novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para chamar a função após o cadastro no Auth
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabela de Produtos (Cardápio)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_best_seller BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  total DECIMAL(10,2) NOT NULL,
  address TEXT, -- Adicionado para entrega
  status TEXT DEFAULT 'pendente',
  payment_method TEXT DEFAULT 'pix',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  observation TEXT -- Adicionado para detalhes de quentinhas
);

-- Tabela de Quentinhas (Funcionários)
CREATE TABLE quentinhas (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE, -- Relacionamento com o pedido
  rice BOOLEAN DEFAULT true,
  rice_type TEXT, -- branco, carioca
  beans BOOLEAN DEFAULT true,
  bean_type TEXT, -- preto, mulato, macassa
  pasta BOOLEAN DEFAULT true,
  salad BOOLEAN DEFAULT true,
  protein TEXT NOT NULL,
  employee_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserindo itens iniciais no Cardápio
INSERT INTO products (name, description, price, category, is_best_seller, image_url) VALUES
('Costela no Bafo Tradicional', 'Nossa especialidade: costela bovina assada lentamente por 12 horas, desmanchando na boca. Acompanha arroz, feijão tropeiro e mandioca.', 5.00, 'Prato Principal', true, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'),
('Picanha na Chapa', 'Cortes selecionados de picanha grelhada com alho e manteiga. Acompanha batata frita e vinagrete.', 59.90, 'Premium', true, 'https://images.unsplash.com/photo-1558039948-40cf39dfba50?auto=format&fit=crop&q=80&w=800'),
('Frango Assado com Ervas', 'Frango suculento marinado em ervas finas e assado no ponto certo. Acompanha arroz branco e salada russa.', 32.00, 'Custo-benefício', false, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=800'),
('Quentinha Econômica', 'A opção ideal para o dia a dia. Escolha sua base e proteína.', 18.00, 'Quentinhas', false, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800');

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quentinhas ENABLE ROW LEVEL SECURITY;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para perfis
CREATE POLICY "Perfis são visíveis publicamente" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas de acesso público para leitura de produtos
CREATE POLICY "Produtos são visíveis para todos" ON products FOR SELECT USING (true);

-- Políticas de acesso para pedidos (apenas o dono pode ver)
CREATE POLICY "Usuários podem ver seus próprios pedidos" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar seus próprios pedidos" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas de acesso para itens do pedido
CREATE POLICY "Usuários podem ver itens de seus pedidos" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Qualquer pessoa pode criar itens do pedido" ON order_items FOR INSERT WITH CHECK (true);

-- Políticas de acesso para quentinhas
CREATE POLICY "Usuários podem ver suas próprias quentinhas" ON quentinhas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar suas próprias quentinhas" ON quentinhas FOR INSERT WITH CHECK (auth.uid() = user_id);
