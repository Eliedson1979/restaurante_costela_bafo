import { motion } from 'framer-motion';
import { Briefcase, TrendingUp } from 'lucide-react';

const Careers = () => {


    const positions = [
        {
            title: 'Cozinheiro(a)',
            type: 'Tempo Integral',
            description: 'Buscamos profissional experiente em cozinha e culinária tradicional brasileira.',
            requirements: ['Experiência mínima de 1 ano', 'Conhecimento em cortes de carne', 'Disponibilidade para finais de semana']
        },
        {
            title: 'Auxiliar de Cozinha',
            type: 'Tempo Integral',
            description: 'Auxiliar na preparação de alimentos e organização da cozinha.',
            requirements: ['Disponibilidade imediata', 'Trabalho em equipe', 'Comprometimento']
        },
    ];

    return (
        <div className="pt-24 md:pt-36 pb-20 px-4 max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20">
                        <Briefcase className="text-yellow-500" size={48} />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-zinc-100 mb-4">
                    Trabalhe <span className="text-yellow-500">Conosco</span>
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                    Faça parte da nossa equipe e ajude a levar o melhor restaurante da região para nossos clientes.
                </p>
            </motion.div>



            {/* Vagas Disponíveis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100 mb-8 text-center">
                    Vagas <span className="text-yellow-500">Disponíveis</span>
                </h2>
                <div className="space-y-6 max-w-4xl mx-auto">
                    {positions.map((position, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-yellow-500/50 transition-all"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-zinc-100 mb-2">{position.title}</h3>
                                        <span className="inline-block bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-500/20">
                                            {position.type}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-zinc-400 mb-4">{position.description}</p>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Requisitos:</p>
                                    <ul className="space-y-1">
                                        {position.requirements.map((req, idx) => (
                                            <li key={idx} className="text-zinc-400 text-sm flex items-start">
                                                <span className="text-yellow-500 mr-2">•</span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-zinc-950/50 px-6 py-4 border-t border-zinc-800">
                                <a
                                    href="mailto:r.costelanobafo@gmail.com?subject=Candidatura - {position.title}"
                                    className="inline-flex items-center space-x-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-900/20"
                                >
                                    <span>Candidatar-se</span>
                                    <TrendingUp size={18} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl p-8 md:p-12 text-center text-black"
            >
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
                    Não encontrou a vaga ideal?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                    Envie seu currículo para nosso banco de talentos e seja considerado em futuras oportunidades.
                </p>
                <a
                    href="mailto:r.costelanobafo@gmail.com?subject=Currículo - Banco de Talentos"
                    className="inline-flex items-center space-x-2 bg-black text-yellow-500 px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-zinc-900 transition-all shadow-xl"
                >
                    <span>Enviar Currículo</span>
                </a>
            </motion.div>
        </div>
    );
};

export default Careers;
