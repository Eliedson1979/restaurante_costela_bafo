import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Copy, ArrowLeft, CreditCard, Sparkles, Loader2, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { OrderModel } from '../models/OrderModel';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

const Checkout = () => {
    const { user } = useAuth();
    const { total, subtotal, deliveryFee, cart, clearCart } = useCart();
    const [copied, setCopied] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const orderCreatedRef = useRef(false);

    // Configurações do Recebedor
    const pixKey = "+5581983357326";
    const merchantName = "Restaurante Costela no Bafo";
    const merchantCity = "Jaboatao dos Guararapes";

    // Criar ou recuperar pedido automaticamente
    useEffect(() => {
        const initOrder = async () => {
            if (!user || cart.length === 0 || orderId || orderCreatedRef.current) return;

            orderCreatedRef.current = true;
            setLoading(true);

            try {
                // 1. Tentar recuperar um pedido pendente existente
                const pendingOrder = await OrderModel.getPendingOrder(user.id);

                if (pendingOrder) {
                    console.log('🔄 Pedido pendente encontrado, reutilizando:', pendingOrder.id);
                    setOrderId(pendingOrder.id);

                    // Atualiza o total se tiver mudado (para garantir consistência)
                    if (pendingOrder.total !== total) {
                        await supabase.from('orders').update({ total: total }).eq('id', pendingOrder.id);
                    }
                } else {
                    // 2. Se não existir, cria um novo
                    console.log('✨ Criando novo pedido...');
                    const quentinhaItem = cart.find(item => item.type === 'quentinha' || item.id.toString().startsWith('quentinha'));
                    let deliveryAddress = "Retirada no Balcão";
                    if (quentinhaItem?.deliveryAddress) deliveryAddress = quentinhaItem.deliveryAddress;

                    const { data, error } = await OrderModel.createOrder({
                        user_id: user.id,
                        total: total,
                        address: deliveryAddress,
                        payment_method: 'pix'
                    }, cart);

                    if (error) throw error;
                    setOrderId(data.id);
                }
            } catch (error) {
                console.error('Erro ao iniciar pedido:', error);
                orderCreatedRef.current = false;
            } finally {
                setLoading(false);
            }
        };

        if (user && cart.length > 0) initOrder();
    }, [user, cart, total, orderId]);

    // Monitoramento Realtime (Automático)
    useEffect(() => {
        if (!orderId) return;

        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    if (payload.new.status === 'pago') {
                        setConfirmed(true);
                        clearCart();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId, clearCart]);

    // Função de Confirmação Manual (Botão restaurado)
    const handleManualConfirm = async () => {
        if (!orderId) return;

        setLoading(true);
        try {
            const { error } = await OrderModel.confirmPayment(orderId);

            if (error) throw error;

            // Força a tela de sucesso imediatamente se o realtime demorar
            setConfirmed(true);
            clearCart();
        } catch (error) {
            console.error('Erro na confirmação manual:', error);
            alert('Não foi possível confirmar o pagamento. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const generatePixPayload = (key, name, city, amount) => {
        // Remove o '+' se for uma chave de telefone no formato E.164
        const sanitizedKey = key.startsWith('+') ? key.substring(1) : key;

        const formatField = (id, value) => {
            const len = value.length.toString().padStart(2, '0');
            return `${id}${len}${value}`;
        };
        const amountStr = amount.toFixed(2);
        const gui = formatField('00', 'BR.GOV.BCB.PIX');
        const keyField = formatField('01', key);
        const merchantInfo = formatField('26', gui + keyField);

        const payload = [
            formatField('00', '01'),
            merchantInfo,
            formatField('52', '0000'),
            formatField('53', '986'),
            formatField('54', amountStr),
            formatField('58', 'BR'),
            formatField('59', name),
            formatField('60', city),
            formatField('62', formatField('05', '***')),
        ].join('');

        const result = payload + '6304';
        let crc = 0xFFFF;
        for (let i = 0; i < result.length; i++) {
            crc ^= (result.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
                else crc <<= 1;
            }
        }
        const finalCrc = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        return result + finalCrc;
    };

    const pixPayload = generatePixPayload(pixKey, merchantName, merchantCity, total);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixPayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (confirmed) {
        return (
            <div className="pt-24 md:pt-36 pb-20 px-4 flex justify-center min-h-[80vh]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-900 p-12 rounded-[40px] shadow-2xl text-center max-w-md border border-zinc-800"
                >
                    <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="text-black" size={40} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100 mb-4 font-inter">Pagamento Concluído!</h2>
                    <p className="text-zinc-400 mb-8 italic">
                        Seu pedido foi processado com sucesso. Já estamos cuidando de tudo!
                    </p>
                    <Link
                        to="/"
                        className="block w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-900/10 text-center"
                    >
                        Voltar para o Início
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!user) return (
        <div className="pt-40 pb-20 px-4 text-center">
            <h2 className="text-2xl font-black uppercase text-zinc-100 mb-4">Acesso Restrito</h2>
            <Link to="/login" className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest">Fazer Login</Link>
        </div>
    );

    return (
        <div className="pt-24 md:pt-36 pb-20 px-4 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Lado Esquerdo: Resumo */}
                <div className="space-y-8">
                    <Link to="/carrinho" className="flex items-center text-zinc-500 font-bold hover:text-yellow-500 uppercase text-[10px] tracking-widest">
                        <ArrowLeft size={14} className="mr-2" />
                        Revisar Carrinho
                    </Link>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100 leading-none">Finalizar <span className="text-yellow-500">Pedido</span></h1>

                    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[32px] p-8 border border-zinc-800">
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-zinc-400">
                                    <div className="flex items-center space-x-4">
                                        <span className="font-black text-yellow-500 text-xs italic">{item.quantity}x</span>
                                        <span className="font-bold uppercase text-[11px] tracking-tight">{item.name}</span>
                                    </div>
                                    <span className="font-black text-zinc-100 text-[11px]">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-zinc-800 space-y-3">
                            <div className="flex justify-between text-zinc-500 text-[11px] font-black uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 text-[11px] font-black uppercase tracking-widest">
                                <span>Entrega</span>
                                {deliveryFee > 0 ? (
                                    <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                                ) : (
                                    <span className="text-green-500">Grátis</span>
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Total Final</span>
                                <span className="text-3xl font-black text-yellow-500 italic">R$ {total.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Pix */}
                <div className="bg-zinc-900 rounded-[40px] p-10 border border-zinc-800 shadow-2xl flex flex-col items-center">
                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-zinc-100 mb-2">Pague via Pix</h2>
                    <p className="text-zinc-500 mb-8 italic text-xs">Escaneie o código abaixo para pagar.</p>

                    <div className="bg-white p-6 rounded-[32px] shadow-2xl mb-8 relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 rounded-[32px] flex items-center justify-center z-10">
                                <Loader2 className="animate-spin text-yellow-500" size={32} />
                            </div>
                        )}
                        <QRCodeSVG value={pixPayload} size={200} includeMargin={true} />
                    </div>

                    <div className="w-full space-y-4">
                        <button
                            onClick={copyToClipboard}
                            className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            <Copy size={16} />
                            {copied ? "Link Copiado!" : "Copiar Chave Pix"}
                        </button>

                        <button
                            onClick={handleManualConfirm}
                            disabled={loading || !orderId}
                            className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-yellow-900/10 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                            <span>Confirmar Pagamento Efetuado</span>
                        </button>
                        <p className="text-zinc-500 text-[10px] text-center italic">
                            Após realizar o pagamento no seu banco, clique no botão acima para confirmar.
                        </p>
                    </div>

                    <p className="mt-8 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.35em]">Ambiente Seguro • Processamento Instantâneo</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
