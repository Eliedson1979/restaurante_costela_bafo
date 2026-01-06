import { supabase } from '../utils/supabase';

export class CartModel {
    /**
     * Busca os itens do carrinho do usuário no banco.
     */
    static async getCart(userId) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao buscar carrinho:', error);
            return [];
        }
        return data;
    }

    /**
     * Adiciona ou atualiza um item no carrinho do banco.
     */
    static async syncItem(userId, item) {
        if (!userId) return;

        // Se for uma quentinha, o ID pode ser dinâmico no front, 
        // mas no banco precisamos salvar os detalhes separadamente.
        const { data: existing } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', userId)
            // Se for quentinha, comparamos os detalhes (JSON) para ver se é a mesma
            .eq(item.type === 'quentinha' ? 'details' : 'product_id', item.type === 'quentinha' ? item.details : item.id)
            .single();

        if (existing) {
            await supabase
                .from('cart_items')
                .update({ quantity: item.quantity })
                .eq('id', existing.id);
        } else {
            const newItem = {
                user_id: userId,
                product_id: typeof item.id === 'number' ? item.id : null,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                type: item.type || 'menu',
                details: item.details || null
            };
            await supabase.from('cart_items').insert([newItem]);
        }
    }

    /**
     * Remove um item específico do carrinho no banco.
     */
    static async removeItem(userId, item) {
        if (!userId) return;
        const query = supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (item.type === 'quentinha') {
            query.eq('details', item.details);
        } else {
            query.eq('product_id', item.id);
        }

        await query;
    }

    /**
     * Limpa todo o carrinho do usuário no banco.
     */
    static async clearCart(userId) {
        if (!userId) return { error: 'Usuário não definido' };
        console.log('🗑️ Model: Iniciando limpeza para usuário:', userId);

        try {
            const { error, count } = await supabase
                .from('cart_items')
                .delete({ count: 'exact' }) // Solicitar contagem para debug
                .eq('user_id', userId);

            if (error) {
                console.error('❌ Model: Erro ao deletar:', error);
                return { error };
            }

            console.log(`✅ Model: Limpeza concluída. Itens removidos: ${count}`);
            return { error: null, count };
        } catch (err) {
            console.error('❌ Model: Exceção:', err);
            return { error: err };
        }
    }

    /**
     * Sincroniza o carrinho local inteiro com o banco (útil no login).
     */
    static async syncFullCart(userId, localCart) {
        if (!userId || localCart.length === 0) return;

        // Estratégia simples: limpa e reinsere para garantir paridade
        await this.clearCart(userId);

        const itemsToInsert = localCart.map(item => ({
            user_id: userId,
            product_id: typeof item.id === 'number' ? item.id : null,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            type: item.type || 'menu',
            details: item.details || null
        }));

        await supabase.from('cart_items').insert(itemsToInsert);
    }
}
