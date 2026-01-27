import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProductModel } from '../models/ProductModel';
import ProductCard from '../components/ProductCard';
import { Utensils, Star, Clock, MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isOpenStatus, setIsOpenStatus] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 is Sunday, 1-6 is Mon-Sat
            const hour = now.getHours();

            // Monday (1) to Saturday (6)
            // From 06:00 to 14:59 (stays open until 15:00)
            if (day >= 1 && day <= 6 && hour >= 6 && hour < 15) {
                setIsOpenStatus(true);
            } else {
                setIsOpenStatus(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductModel.getAll();
                // Filtrar produtos de café da manhã do cardápio principal
                const filteredProducts = data.filter(product => product.category !== 'Café da Manhã');
                setProducts(filteredProducts);
            } catch (err) {
                console.error('Erro ao carregar cardápio:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="pt-24 md:pt-36 pb-12">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden mb-16">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1600"
                        className="w-full h-full object-cover brightness-50"
                        alt="Costela assando"
                    />
                </div>
                <div className="relative text-center text-white px-4">

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6"
                    >
                        Sabor que vem do <span className="text-yellow-500 text-shadow-lg">Fogo</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto"
                    >
                        A melhor costela no bafo da região, assada lentamente para garantir a suculência perfeita.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a href="#menu" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all shadow-xl shadow-yellow-900/20 text-center">
                            Ver Cardápio
                        </a>
                        <Link to="/avaliacoes" className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-6 py-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                            <Star className="text-yellow-400 fill-yellow-400" size={20} />
                            <span className="font-bold whitespace-nowrap">4.9 (500+ avaliações)</span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Info Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card de Funcionamento com Status em Tempo Real */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className={`relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border transition-all duration-300 ${isOpenStatus ? 'border-green-500/30 shadow-green-900/10' : 'border-zinc-800 shadow-black/50'}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${isOpenStatus ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-yellow-500'}`}>
                                <Clock size={24} />
                            </div>
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${isOpenStatus
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOpenStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span>{isOpenStatus ? 'Aberto' : 'Fechado'}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-100 text-lg mb-1">Funcionamento</h4>
                            <p className="text-zinc-400 text-sm font-medium">Seg à Sáb: 06h às 15h</p>
                        </div>
                        {/* Efeito de brilho sutil */}
                        {isOpenStatus && (
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/5 blur-3xl rounded-full"></div>
                        )}
                    </motion.div>

                    {/* Card de Localização */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-zinc-800 flex flex-col justify-between hover:border-yellow-500/30 transition-all duration-300"
                    >
                        <div className="bg-zinc-800 w-fit p-3 rounded-2xl text-yellow-500 mb-4">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-100 text-lg mb-1">Localização</h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">Rodovia BR 101 Sul - Novo Traçado, 177</p>
                        </div>
                    </motion.div>

                    {/* Card de Ingredientes */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-zinc-800 flex flex-col justify-between hover:border-yellow-500/30 transition-all duration-300"
                    >
                        <div className="bg-zinc-800 w-fit p-3 rounded-2xl text-yellow-500 mb-4">
                            <Utensils size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-100 text-lg mb-1">Qualidade</h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">Cortes Premium e Tempero Secreto da Casa</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Recommended Section */}
            <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-zinc-100 mb-2">Cardápio do Almoço</h2>
                        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                        <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
                        <p className="text-zinc-500 font-medium">Carregando cardápio suculento...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Nenhum prato disponível no momento. Verifique as credenciais do Supabase.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
