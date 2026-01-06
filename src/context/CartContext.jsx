import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { CartModel } from '../models/CartModel';
import { OrderModel } from '../models/OrderModel';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Sincronizar carrinho com local storage sempre que mudar
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Carregar carrinho do banco ao logar e mesclar/priorizar
    useEffect(() => {
        const syncDbCart = async () => {
            if (user) {
                try {
                    const dbItems = await CartModel.getCart(user.id);
                    if (dbItems && dbItems.length > 0) {
                        // Converter formato do banco para formato local
                        const formattedCart = dbItems.map(item => ({
                            // Ajuste para garantir compatibilidade com componentes que usam 'id'
                            ...item,
                            id: item.product_id || `quentinha-${item.created_at}`, // Gerar ID compatível para quentinhas do banco
                        }));

                        // Opcional: Aqui poderíamos mesclar com o local, mas por simplicidade vamos assumir o do banco como verdade 
                        // se houver dados, ou manter local se banco vazio?
                        // Melhor estratégia simples: Se banco tem dados, usa banco.
                        setCart(formattedCart);
                    }
                } catch (error) {
                    console.error("Erro ao sincronizar carrinho:", error);
                }
            }
        };
        syncDbCart();
    }, [user]);

    const addToCart = async (product, quantity = 1) => {
        // Atualização Otimista (Local)
        let updatedItem;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                updatedItem = { ...existing, quantity: existing.quantity + quantity };
                return prev.map(item =>
                    item.id === product.id ? updatedItem : item
                );
            }
            updatedItem = { ...product, quantity };
            return [...prev, updatedItem];
        });

        // Sincronização com Banco
        if (user && updatedItem) {
            await CartModel.syncItem(user.id, updatedItem);
        }
    };

    const removeFromCart = async (productId) => {
        const itemToRemove = cart.find(item => item.id === productId);
        setCart(prev => prev.filter(item => item.id !== productId));

        if (user && itemToRemove) {
            await CartModel.removeItem(user.id, itemToRemove);
        }
    };

    const updateQuantity = async (productId, delta) => {
        let updatedItem = null;

        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                if (newQty === 0) return null; // Será removido pelo filter
                updatedItem = { ...item, quantity: newQty };
                return updatedItem;
            }
            return item;
        }).filter(Boolean));

        if (user) {
            const originalItem = cart.find(item => item.id === productId);
            if (updatedItem) {
                await CartModel.syncItem(user.id, updatedItem);
            } else if (originalItem && (originalItem.quantity + delta) <= 0) {
                // Se quantity virou 0, removemos
                await CartModel.removeItem(user.id, originalItem);
            }
        }
    };

    const clearCart = async () => {
        // Limpeza local imediata para responsividade
        setCart([]);
        localStorage.removeItem('cart');

        if (user) {
            console.log('🔄 Controller: Solicitando limpeza no banco...');

            // executa em paralelo para ser mais rápido
            const [cartResult, orderResult] = await Promise.all([
                CartModel.clearCart(user.id),
                OrderModel.cancelPendingOrders(user.id)
            ]);

            if (cartResult.error) console.error('❌ Falha ao limpar carrinho no banco:', cartResult.error);
            if (orderResult.error) console.error('❌ Falha ao cancelar pedidos pendentes:', orderResult.error);

            if (!cartResult.error && !orderResult.error) {
                console.log('✅ Limpeza completa (Carrinho + Pedidos Pendentes) realizada com sucesso.');
            }
        } else {
            console.log('ℹ️ Limpeza apenas local (usuário não logado).');
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const hasQuentinha = cart.some(item => item.type === 'quentinha');
    const deliveryFee = hasQuentinha ? 5.00 : 0;
    const total = subtotal + deliveryFee;

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            subtotal, deliveryFee, total
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
