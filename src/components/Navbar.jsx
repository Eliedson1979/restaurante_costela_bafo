import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, UtensilsCrossed, Phone, Box, CreditCard, User, LogOut, LogIn, Briefcase } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useCart();
    const { user, signOut } = useAuth();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { title: 'Cardápio', path: '/', icon: <UtensilsCrossed size={18} /> },
        { title: 'Quentinhas', path: '/quentinhas', icon: <Box size={18} /> },
        { title: 'Pagamento', path: '/pagamento', icon: <CreditCard size={18} /> },
        { title: 'Contato', path: '/contato', icon: <Phone size={18} /> },
        { title: 'Trabalhe Conosco', path: '/trabalhe-conosco', icon: <Briefcase size={18} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 md:h-28">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Costela no Bafo Logo" className="h-14 md:h-24 w-auto object-contain hover:scale-105 transition-transform" onError={(e) => { e.target.onerror = null; e.target.src = '/vite.svg'; }} />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 font-medium transition-colors hover:text-yellow-500 ${isActive ? 'text-yellow-500' : 'text-zinc-400'
                                    }`
                                }
                            >
                                {link.icon}
                                <span>{link.title}</span>
                            </NavLink>
                        ))}

                        <Link to="/carrinho" className="relative p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors group">
                            <ShoppingCart className="text-yellow-500 group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-zinc-800">
                                <Link to="/perfil" className="flex items-center space-x-2 hover:bg-zinc-800 p-1 px-3 rounded-xl transition-colors group">
                                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                                        <User size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-zinc-300 truncate max-w-[100px]">
                                        {user.user_metadata?.full_name || user.email}
                                    </span>
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Sair"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-600 transition-all shadow-md shadow-yellow-900/20"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link to="/carrinho" className="relative p-2 bg-zinc-900 rounded-full">
                            <ShoppingCart className="text-yellow-500" size={20} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-yellow-500 hover:bg-zinc-900 rounded-lg transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-950 border-t border-zinc-800 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {user && (
                                <Link
                                    to="/perfil"
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-4 flex items-center space-x-3 border-b border-zinc-800 mb-2 hover:bg-zinc-900 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-yellow-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-100">{user.user_metadata?.full_name || 'Usuário'}</p>
                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                    </div>
                                </Link>
                            )}
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-3 py-4 rounded-md text-base font-medium ${isActive ? 'bg-zinc-900 text-yellow-500' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    <span>{link.title}</span>
                                </NavLink>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => { signOut(); setIsOpen(false); }}
                                    className="w-full flex items-center space-x-3 px-3 py-4 text-left text-red-500 font-medium hover:bg-red-50 rounded-md"
                                >
                                    <LogOut size={18} />
                                    <span>Sair da Conta</span>
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-4 text-yellow-500 font-bold hover:bg-zinc-900 rounded-md"
                                >
                                    <LogIn size={18} />
                                    <span>Fazer Login</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
