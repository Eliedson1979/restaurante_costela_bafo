import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-800 group"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.isBestSeller && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Mais Vendido
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur px-3 py-1 rounded-full shadow-md border border-zinc-700">
                    <span className="text-yellow-500 font-bold text-sm">
                        R$ {product.price.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-zinc-100 mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {product.description}
                </p>

                <button
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-900/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    <span>Adicionar ao Carrinho</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
