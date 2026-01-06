import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, updatePassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updatePassword(newPassword);
            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao alterar a senha. Tente novamente.' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 md:pt-36 pb-20 px-4 max-w-4xl mx-auto">
            <Link to="/" className="flex items-center text-yellow-500 font-bold hover:underline mb-8">
                <ArrowLeft size={18} className="mr-2" />
                Voltar para o Início
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800"
            >
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-8 text-black">
                    <div className="flex items-center space-x-4">
                        <div className="bg-black/10 p-3 rounded-2xl backdrop-blur-sm">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Meu Perfil</h1>
                            <p className="opacity-80 font-medium">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Informações Básicas */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black italic uppercase tracking-wider text-zinc-100 border-b border-zinc-800 pb-2">Informações da Conta</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-1 uppercase tracking-widest">Nome</label>
                                <p className="text-lg font-bold text-zinc-100">{user?.user_metadata?.full_name || 'Não informado'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-1 uppercase tracking-widest">E-mail</label>
                                <p className="text-lg font-bold text-zinc-100">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alterar Senha */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black italic uppercase tracking-wider text-zinc-100 border-b border-zinc-800 pb-2">Segurança</h3>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                >
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-2">Nova Senha</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-2">Confirmar Nova Senha</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-900/10 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Salvar Nova Senha</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
