import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderModel } from '../models/OrderModel';
import { ProductModel } from '../models/ProductModel';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import {
    Loader2, Package, CheckCircle2, Clock, MapPin, DollarSign, User,
    ShoppingBag, Plus, Edit2, Trash2, X, Save, Coffee
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
    const [activeProductTab, setActiveProductTab] = useState('all'); // 'all' or 'breakfast'

    // Orders state
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Products state
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [breakfastProducts, setBreakfastProducts] = useState([]);
    const [breakfastProductsLoading, setBreakfastProductsLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        is_best_seller: false
    });

    const [userProfile, setUserProfile] = useState(null);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', user.id)
                .single();

            if (profile) setUserProfile(profile);

            setOrdersLoading(true);
            try {
                const { data } = await OrderModel.getAllOrders();
                setOrders(data || []);
            } catch (err) {
                console.error('Erro ao buscar pedidos:', err);
            } finally {
                setOrdersLoading(false);
            }
        };

        if (!authLoading) fetchOrders();
    }, [user, authLoading]);

    // Fetch products
    useEffect(() => {
        fetchProducts();
        fetchBreakfastProducts();
    }, []);

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const data = await ProductModel.getAll();
            setProducts(data || []);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchBreakfastProducts = async () => {
        setBreakfastProductsLoading(true);
        try {
            const data = await ProductModel.getProductsByCategory('Café da Manhã');
            setBreakfastProducts(data || []);
        } catch (err) {
            console.error('Erro ao buscar produtos de café da manhã:', err);
        } finally {
            setBreakfastProductsLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            // Preparar dados do produto, removendo campos vazios
            const productData = {
                name: productForm.name.trim(),
                description: productForm.description.trim(),
                price: parseFloat(productForm.price),
                image: productForm.image.trim(),
                is_best_seller: productForm.is_best_seller
            };

            // Adicionar categoria apenas se não estiver vazia
            if (activeTab === 'breakfast') {
                productData.category = 'Café da Manhã';
            } else if (productForm.category && productForm.category.trim()) {
                productData.category = productForm.category.trim();
            }

            console.log('Salvando produto:', productData);

            if (editingProduct) {
                const result = await ProductModel.update(editingProduct.id, productData);
                console.log('Produto atualizado:', result);
            } else {
                const result = await ProductModel.create(productData);
                console.log('Produto criado:', result);
            }

            await fetchProducts();
            await fetchBreakfastProducts();
            resetProductForm();
            alert(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        } catch (err) {
            console.error('Erro detalhado ao salvar produto:', err);
            console.error('Mensagem:', err.message);
            console.error('Detalhes:', err.details);
            console.error('Hint:', err.hint);

            let errorMessage = 'Erro ao salvar produto.\n\n';

            if (err.message) {
                errorMessage += `Erro: ${err.message}\n`;
            }

            if (err.details) {
                errorMessage += `Detalhes: ${err.details}\n`;
            }

            if (err.hint) {
                errorMessage += `Dica: ${err.hint}\n`;
            }

            if (err.code === 'PGRST301' || err.message?.includes('permission')) {
                errorMessage += '\n⚠️ Problema de permissão. Verifique se você está logado como administrador.';
            }

            alert(errorMessage);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await ProductModel.delete(id);
            await fetchProducts();
            await fetchBreakfastProducts();
        } catch (err) {
            console.error('Erro ao excluir produto:', err);
            alert('Erro ao excluir produto.');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            image: product.image,
            category: product.category || '',
            is_best_seller: product.is_best_seller || false
        });
        setShowProductForm(true);
    };

    const resetProductForm = () => {
        setProductForm({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
            is_best_seller: false
        });
        setEditingProduct(null);
        setShowProductForm(false);
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'paid') return order.status === 'pago';
        if (filter === 'pending') return order.status === 'pendente';
        return true;
    });

    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 md:pt-36 flex justify-center items-start bg-black">
                <Loader2 className="animate-spin text-yellow-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 md:pt-36 pb-20 px-4 bg-black text-zinc-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-100 mb-2">
                        Painel <span className="text-yellow-500">Administrativo</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <p className="text-zinc-500 font-medium">Gerenciamento Completo</p>
                        {userProfile && (
                            <span className={`flex items-center gap-1 text-[10px] px-3 py-1 rounded-full border uppercase font-black tracking-wider ${userProfile.role === 'admin'
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${userProfile.role === 'admin' ? 'bg-green-500' : 'bg-zinc-500'}`} />
                                {userProfile.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-zinc-800">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-3 font-bold uppercase text-sm transition-all ${activeTab === 'orders'
                            ? 'text-yellow-500 border-b-2 border-yellow-500'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Package size={18} />
                        Pedidos
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-6 py-3 font-bold uppercase text-sm transition-all ${activeTab === 'products'
                            ? 'text-yellow-500 border-b-2 border-yellow-500'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <ShoppingBag size={18} />
                        Almoços
                    </button>
                    <button
                        onClick={() => setActiveTab('breakfast')}
                        className={`flex items-center gap-2 px-6 py-3 font-bold uppercase text-sm transition-all ${activeTab === 'breakfast'
                            ? 'text-yellow-500 border-b-2 border-yellow-500'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Coffee size={18} />
                        Café da Manhã
                    </button>
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        {/* Filters */}
                        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-8 w-fit">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${filter === 'all' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${filter === 'pending' ? 'bg-yellow-500/20 text-yellow-500 shadow-md border border-yellow-500/20' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Pendentes
                            </button>
                            <button
                                onClick={() => setFilter('paid')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${filter === 'paid' ? 'bg-green-500/20 text-green-500 shadow-md border border-green-500/20' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Pagos
                            </button>
                        </div>

                        {/* Orders List */}
                        {ordersLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-yellow-500" size={48} />
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                                <Package className="mx-auto h-16 w-16 text-zinc-700 mb-4" />
                                <h3 className="text-xl font-bold text-zinc-500 uppercase">Nenhum pedido encontrado</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`bg-zinc-900 rounded-2xl border-l-4 p-6 shadow-xl ${order.status === 'pago' ? 'border-l-green-500' : 'border-l-yellow-500'
                                            } border-y border-r border-zinc-800`}
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        #{order.id.slice(0, 8)}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                                                        <Clock size={12} />
                                                        {new Date(order.created_at).toLocaleString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-yellow-500" />
                                                    <h2 className="text-xl font-bold text-zinc-100">{order.profiles?.full_name || 'Cliente Desconhecido'}</h2>
                                                </div>
                                                {order.address && order.address !== 'Retirada no Balcão' ? (
                                                    <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-lg">
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-1">Endereço de Entrega:</p>
                                                        <p className="font-mono text-sm">{order.address}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                                                        <MapPin size={14} />
                                                        <span>Retirada no Balcão</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 lg:max-w-xl bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                                                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Itens do Pedido</h4>
                                                <div className="space-y-3">
                                                    {order.order_items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-start text-sm border-b border-zinc-800/50 last:border-0 pb-2 last:pb-0">
                                                            <div>
                                                                <span className="font-bold text-yellow-500 mr-2">{item.quantity}x</span>
                                                                <span className="text-zinc-300 uppercase font-bold text-xs">{item.products?.name || 'Item Removido'}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.quentinhas && order.quentinhas.map((q, idx) => (
                                                        <div key={`q-${idx}`} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 mt-2">
                                                            <span className="text-yellow-500 font-bold text-xs uppercase">Quentinha ({q.employee_count}x)</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between items-end min-w-[140px]">
                                                <div className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 ${order.status === 'pago' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {order.status === 'pago' ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
                                                    {order.status}
                                                </div>
                                                <div className="text-right mt-4">
                                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Total</p>
                                                    <div className="flex items-center text-yellow-500 font-black text-2xl italic gap-1">
                                                        <span className="text-sm opacity-50">R$</span>
                                                        {order.total.toFixed(2).replace('.', ',')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Products Tabs - Main and Breakfast */}
                {(activeTab === 'products' || activeTab === 'breakfast') && (
                    <div>
                        {/* Add Product Button */}
                        <div className="mb-8">
                            <button
                                onClick={() => setShowProductForm(true)}
                                className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-900/20"
                            >
                                <Plus size={20} />
                                Adicionar Produto
                            </button>
                        </div>

                        {/* Product Form Modal */}
                        <AnimatePresence>
                            {showProductForm && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                    onClick={resetProductForm}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full border border-zinc-800 max-h-[90vh] overflow-y-auto"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                                {editingProduct ? 'Editar' : 'Adicionar'} <span className="text-yellow-500">Produto</span>
                                            </h2>
                                            <button onClick={resetProductForm} className="text-zinc-500 hover:text-white">
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleProductSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-zinc-300 mb-2">Nome do Produto *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={productForm.name}
                                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
                                                    placeholder="Ex: Costela no Bafo Tradicional"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-zinc-300 mb-2">Descrição *</label>
                                                <textarea
                                                    required
                                                    value={productForm.description}
                                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                                                    rows="3"
                                                    placeholder="Descrição do produto..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-zinc-300 mb-2">Preço (R$) *</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        required
                                                        value={productForm.price}
                                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-zinc-300 mb-2">Categoria</label>
                                                    <input
                                                        type="text"
                                                        value={productForm.category}
                                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
                                                        placeholder="Ex: Carnes"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-zinc-300 mb-2">URL da Imagem *</label>
                                                <input
                                                    type="url"
                                                    required
                                                    value={productForm.image}
                                                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
                                                    placeholder="https://exemplo.com/imagem.jpg"
                                                />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="bestSeller"
                                                    checked={productForm.is_best_seller}
                                                    onChange={(e) => setProductForm({ ...productForm, is_best_seller: e.target.checked })}
                                                    className="w-5 h-5 accent-yellow-500"
                                                />
                                                <label htmlFor="bestSeller" className="text-sm font-bold text-zinc-300">Marcar como Mais Vendido</label>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={resetProductForm}
                                                    className="flex-1 bg-zinc-800 text-zinc-300 px-6 py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-900/20"
                                                >
                                                    <Save size={20} />
                                                    {editingProduct ? 'Atualizar' : 'Salvar'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Products List */}
                        {(activeTab === 'products' && productsLoading) || (activeTab === 'breakfast' && breakfastProductsLoading) ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-yellow-500" size={48} />
                            </div>
                        ) : (activeTab === 'products' && products.length === 0) || (activeTab === 'breakfast' && breakfastProducts.length === 0) ? (
                            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                                <ShoppingBag className="mx-auto h-16 w-16 text-zinc-700 mb-4" />
                                <h3 className="text-xl font-bold text-zinc-500 uppercase">Nenhum produto cadastrado</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(activeTab === 'products' ? products : breakfastProducts).map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all group"
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {product.is_best_seller && (
                                                <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                                    Mais Vendido
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-zinc-100 mb-2">{product.name}</h3>
                                            <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{product.description}</p>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-2xl font-black text-yellow-500">
                                                    R$ {product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-zinc-100 px-4 py-2 rounded-xl font-bold hover:bg-zinc-700 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
