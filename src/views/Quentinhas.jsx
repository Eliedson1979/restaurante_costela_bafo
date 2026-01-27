import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Send, Users, CheckCircle2, User, ShoppingCart, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const QUENTINHA_PRICE = 20.00;

const Quentinhas = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rice: true,
        beans: true,
        pasta: true,
        salad: true,
        protein: 'costela',
        employees: 1,
        customerName: '',
        zipCode: '',
        address: '',
        number: '',
        neighborhood: '',
        complement: '',
        beanType: 'preto', // preto, mulato, macassa
        riceType: 'branco' // branco, carioca
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setFormData(prev => ({ ...prev, customerName: user.user_metadata.full_name }));
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const sides = [];
        if (formData.rice) sides.push(`Arroz ${formData.riceType.charAt(0).toUpperCase() + formData.riceType.slice(1)}`);
        if (formData.beans) sides.push(`Feijão ${formData.beanType.charAt(0).toUpperCase() + formData.beanType.slice(1)}`);
        if (formData.pasta) sides.push('Macarrão');
        if (formData.salad) sides.push('Salada');

        const addressInfo = `${formData.address}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}, ${formData.neighborhood}. CEP: ${formData.zipCode}`;
        const quentinhaItem = {
            id: `quentinha-${Date.now()}`,
            type: 'quentinha', // Para identificação estruturada
            name: `Quentinha - ${formData.customerName || 'Cliente'}`,
            price: QUENTINHA_PRICE,
            deliveryAddress: addressInfo, // Endereço explícito
            image: 'https://i.pinimg.com/736x/ef/d8/11/efd811bb41334f8a51bc98c4946cc074.jpg',
            description: `Pedido para ${formData.employees} funcionários. Proteína: ${formData.protein}. Acompanhamentos: ${sides.join(', ')}.`,
            details: formData // Dados estruturados para o banco de dados
        };

        addToCart(quentinhaItem, formData.employees);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            navigate('/carrinho');
        }, 1500);
    };

    return (
        <div className="pt-24 md:pt-36 pb-20 px-4 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800"
            >
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-8 text-black">
                    <div className="flex items-center space-x-4 mb-4">
                        <Box size={32} />
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Pedido de Quentinhas</h1>
                    </div>
                    <p className="opacity-80 font-medium">Área exclusiva para pedidos coletivos de Clientes.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Acompanhamentos */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
                                <span className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">01</span>
                                <span>Identificação do Cliente</span>
                            </h3>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                    className="block w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-zinc-100 placeholder:text-zinc-600 font-bold"
                                    placeholder="Nome do Responsável"
                                    required
                                />
                            </div>

                            <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2 pt-4">
                                <span className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">02</span>
                                <span>Endereço de Entrega</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="CEP"
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData(p => ({ ...p, zipCode: e.target.value }))}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bairro"
                                        value={formData.neighborhood}
                                        onChange={(e) => setFormData(p => ({ ...p, neighborhood: e.target.value }))}
                                        className="w-full p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Logradouro"
                                        value={formData.address}
                                        onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                                        className="sm:col-span-3 p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nº"
                                        value={formData.number}
                                        onChange={(e) => setFormData(p => ({ ...p, number: e.target.value }))}
                                        className="sm:col-span-1 p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Complemento (Opcional)"
                                    value={formData.complement}
                                    onChange={(e) => setFormData(p => ({ ...p, complement: e.target.value }))}
                                    className="w-full p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2 pt-4">
                                <span className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">03</span>
                                <span>Escolha os Acompanhamentos</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {['Arroz', 'Feijão', 'Macarrão', 'Salada'].map((item) => (
                                    <label key={item} className="flex items-center space-x-3 p-4 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-yellow-500"
                                            checked={
                                                item === 'Arroz' ? formData.rice :
                                                    item === 'Feijão' ? formData.beans :
                                                        item === 'Macarrão' ? formData.pasta :
                                                            formData.salad
                                            }
                                            onChange={(e) => {
                                                const key = item === 'Arroz' ? 'rice' :
                                                    item === 'Feijão' ? 'beans' :
                                                        item === 'Macarrão' ? 'pasta' : 'salad';
                                                setFormData(prev => ({ ...prev, [key]: e.target.checked }));
                                            }}
                                        />
                                        <span className="font-medium text-zinc-300">{item}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Seleção do Tipo de Arroz */}
                                {formData.rice && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700 space-y-3"
                                    >
                                        <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest italic">Tipo de Arroz</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['branco', 'carioca'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, riceType: type }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border ${formData.riceType === type
                                                        ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-900/20'
                                                        : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Seleção do Tipo de Feijão */}
                                {formData.beans && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700 space-y-3"
                                    >
                                        <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest italic">Tipo de Feijão</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['preto', 'mulato', 'macassa'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, beanType: type }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border ${formData.beanType === type
                                                        ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-900/20'
                                                        : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Proteina e Quantidade */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
                                    <span className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">04</span>
                                    <span>Proteína Principal</span>
                                </h3>
                                <select
                                    value={formData.protein}
                                    onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
                                    className="w-full p-4 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                                >
                                    <option value="costela">Costela no Bafo </option>
                                    <option value="frango">Frango Assado </option>
                                    <option value="isca_Carne">Isca de Carne </option>
                                    <option value="figado">Figado Acebolado </option>
                                    <option value="carne">Carne Guisada </option>
                                    <option value="galinha">Galinha Guisada </option>
                                    <option value="peito_frango">Isca de Peito de Frango </option>

                                </select>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
                                    <span className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">05</span>
                                    <span>Quantidade de Funcionários</span>
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, employees: Math.max(1, p.employees - 1) }))}
                                        className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-2xl hover:bg-zinc-800 text-yellow-500"
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-black w-12 text-center text-zinc-100">{formData.employees}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, employees: p.employees + 1 }))}
                                        className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-2xl hover:bg-zinc-800 text-yellow-500"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-zinc-500 font-medium italic">Resumo do Pedido</p>
                            <h4 className="text-xl font-black text-yellow-500 uppercase tracking-tight">
                                {formData.employees} {formData.employees === 1 ? 'Quentinha' : 'Quentinhas'} • R$ {(formData.employees * QUENTINHA_PRICE).toFixed(2).replace('.', ',')}
                            </h4>
                        </div>
                        <button
                            type="submit"
                            disabled={submitted}
                            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${submitted
                                ? 'bg-green-600 text-white'
                                : 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg shadow-yellow-900/10'
                                }`}
                        >
                            {submitted ? (
                                <>
                                    <CheckCircle2 size={20} />
                                    <span>Pedido Enviado!</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Enviar Pedido</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Quentinhas;
