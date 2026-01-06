import React from 'react';

const Contact = () => (
    <div className="pt-24 md:pt-36 pb-20 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-8 italic uppercase tracking-tighter">Fale <span className="text-yellow-500">Conosco</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl">
                <div className="text-yellow-500 mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <h3 className="font-bold text-zinc-100 mb-2">Telefone</h3>
                <p className="text-zinc-400">(81) 99928-0870</p>
            </div>
            <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl">
                <div className="text-yellow-500 mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
                <h3 className="font-bold text-zinc-100 mb-2">E-mail</h3>
                <p className="text-zinc-400">r.costelanobafo@gmail.com</p>
            </div>
            <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl">
                <div className="text-yellow-500 mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </div>
                <h3 className="font-bold text-zinc-100 mb-2">Redes Sociais</h3>
                <p className="text-zinc-400">@costelanobafo_oficial</p>
            </div>
        </div>
    </div>
);

export default Contact;
