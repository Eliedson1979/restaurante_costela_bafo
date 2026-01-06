import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();

    if (cart.length === 0) {
        return (
            <div className="pt-24 md:pt-36 pb-20 px-4 flex flex-col items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-zinc-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                        <ShoppingBag className="text-zinc-600" size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-100 italic uppercase tracking-tighter mb-4">Seu carrinho está vazio</h2>
                    <p className="text-zinc-500 mb-8 max-w-xs mx-auto italic">
                        Parece que você ainda não escolheu sua costela. Que tal dar uma olhada no cardápio?
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-900/10"
                    >
                        <span>Ver Cardápio</span>
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-36 pb-20 px-4 max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Lista de Itens */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100">Meu Carrinho</h1>
                        <button
                            onClick={clearCart}
                            className="text-red-500 flex items-center space-x-1 font-bold text-sm hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                            <span>Limpar Carrinho</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode='popLayout'>
                            {cart.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-800 flex items-center space-x-4 sm:space-x-6 group"
                                >
                                    <img src={item.image} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={item.name} />

                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-100 text-lg sm:text-xl uppercase tracking-tight">{item.name}</h3>
                                        <p className="text-yellow-500 font-black mb-3 sm:mb-4">R$ {item.price.toFixed(2).replace('.', ',')}</p>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1 text-yellow-500 hover:bg-zinc-700 rounded-md transition-colors font-bold text-lg"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-black text-zinc-100">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1 text-yellow-500 hover:bg-zinc-700 rounded-md transition-colors font-bold text-lg"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-zinc-600 hover:text-red-500 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic">Subtotal</p>
                                        <p className="font-black text-2xl text-zinc-100">
                                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Resumo */}
                <div className="lg:w-96">
                    <div className="sticky top-32 bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-100 mb-8 underline decoration-yellow-500 underline-offset-8">Resumo</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-zinc-400 font-medium">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400 font-medium">
                                <span>Taxa de Entrega</span>
                                {deliveryFee > 0 ? (
                                    <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                                ) : (
                                    <span className="text-green-500 font-black uppercase text-sm">Grátis</span>
                                )}
                            </div>
                            <div className="h-px bg-zinc-800 my-2"></div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic">Total Final</p>
                                    <p className="text-4xl font-black text-yellow-500">R$ {total.toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/pagamento"
                            className="block w-full text-center bg-yellow-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-lg shadow-yellow-900/10 hover:bg-yellow-600 transition-all active:scale-95"
                        >
                            Finalizar Pedido
                        </Link>

                        <p className="mt-6 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
                            Ambiente 100% seguro • Entrega rápida
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
