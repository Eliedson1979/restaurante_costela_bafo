import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signUp(email, password, { full_name: name });
            alert('Cadastro realizado! Por favor, verifique seu e-mail para confirmar a conta.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao realizar o cadastro.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 md:pt-36 pb-12 flex items-center justify-center px-4 bg-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800"
            >
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-8 text-black text-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo.png"
                            alt="Costela no Bafo Logo"
                            className="h-20 w-auto object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                        />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Crie sua Conta</h1>
                    <p className="opacity-80 font-medium text-sm">Junte-se à elite do sabor.</p>
                </div>

                <form onSubmit={handleSignup} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Nome Completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">E-mail</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Senha</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-900/10 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Cadastrar</span>
                                <UserPlus size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-zinc-500">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-yellow-500 font-bold hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
