import { supabase } from '../utils/supabase';

export class OrderModel {
    /**
     * Cria um novo pedido e seus itens associados.
     * @param {Object} orderData - Dados básicos do pedido (user_id, total, address, payment_method)
     * @param {Array} items - Lista de itens do carrinho
     */
    static async createOrder(orderData, items) {
        console.log('DEBUG: Criando pedido com dados:', orderData);
        console.log('DEBUG: Itens do pedido:', items);
        try {
            // 1. Inserir o pedido na tabela 'orders'
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: orderData.user_id,
                    total: orderData.total,
                    address: orderData.address,
                    payment_method: orderData.payment_method || 'pix',
                    status: 'pendente'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Preparar os itens do pedido
            const orderItems = items.map(item => {
                let productId;
                if (typeof item.id === 'string' && item.id.startsWith('quentinha')) {
                    productId = 4; // ID fixo para quentinhas no schema.sql
                } else {
                    productId = parseInt(item.id);
                }

                return {
                    order_id: order.id,
                    product_id: productId,
                    quantity: item.quantity,
                    price_at_time: item.price,
                    observation: item.description || ''
                };
            });

            // 3. Inserir os itens na tabela 'order_items'
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 4. Sincronizar detalhes na tabela 'quentinhas'
            const quentinhasDetails = items
                .filter(item => item.type === 'quentinha' && item.details)
                .map(item => ({
                    order_id: order.id,
                    user_id: orderData.user_id,
                    rice: item.details.rice,
                    rice_type: item.details.riceType,
                    beans: item.details.beans,
                    bean_type: item.details.beanType,
                    pasta: item.details.pasta,
                    salad: item.details.salad,
                    protein: item.details.protein,
                    employee_count: item.quantity
                }));

            if (quentinhasDetails.length > 0) {
                const { error: qtError } = await supabase
                    .from('quentinhas')
                    .insert(quentinhasDetails);

                if (qtError) {
                    console.error('Erro ao sincronizar tabela quentinhas:', qtError);
                    // Não travamos o pedido principal se o detalhe técnico der erro,
                    // mas logamos para análise.
                }
            }

            return { data: order, error: null };
        } catch (error) {
            console.error('ERRO CRÍTICO NO SUPABASE:', error);
            // Verifica se o erro é por coluna inexistente
            if (error.code === '42703') {
                console.error('DETALHE: Coluna inexistente detectada. Verifique se o banco possui as colunas "address" em "orders" e "observation" em "order_items".');
            }
            return { data: null, error };
        }
    }

    /**
     * Busca o último pedido pendente do usuário.
     * @param {string} userId - ID do usuário
     */
    static async getPendingOrder(userId) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'pendente')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignora erro se não encontrar nenhum
            console.error('Erro ao buscar pedido pendente:', error);
            return null;
        }

        return data;
    }

    /**
     * Cancela e remove todos os pedidos pendentes do usuário.
     * Útil quando o usuário limpa o carrinho para reiniciar o fluxo.
     * @param {string} userId - ID do usuário
     */
    static async cancelPendingOrders(userId) {
        console.log('🗑️ OrderModel: Cancelando pedidos pendentes para:', userId);
        const { error, count } = await supabase
            .from('orders')
            .delete({ count: 'exact' })
            .eq('user_id', userId)
            .eq('status', 'pendente');

        if (error) {
            console.error('❌ Erro ao cancelar pedidos pendentes:', error);
            return { error };
        }

        console.log(`✅ Pedidos pendentes removidos: ${count}`);
        return { error: null, count };
    }
    /**
     * Atualiza o status do pedido para 'pago'.
     * @param {string} orderId - ID do pedido
     */
    static async confirmPayment(orderId) {
        console.log('✅ OrderModel: Confirmando pagamento para pedido:', orderId);
        const { error } = await supabase
            .from('orders')
            .update({ status: 'pago' })
            .eq('id', orderId);

        if (error) {
            console.error('❌ Erro ao confirmar pagamento:', error);
            return { error };
        }

        return { error: null };
    }
    /**
     * Busca todos os pedidos do sistema (Apenas para Admins).
     * Retorna pedidos com dados do cliente e itens.
     */
    static async getAllOrders() {
        // Ordena por data de criação decrescente (mais recentes primeiro)
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles:user_id (full_name, email),
                order_items (
                    id, quantity, price_at_time, observation,
                    products (name)
                ),
                quentinhas (
                     rice, rice_type, beans, bean_type, protein, salad, pasta, employee_count
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar todos os pedidos:', error);
            return { error };
        }

        return { data };
    }
}

