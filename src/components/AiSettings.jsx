
import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.getnexo.com.br';

const AiSettings = () => {
    const [context, setContext] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchContext();
    }, []);

    const fetchContext = async () => {
        const res = await fetch(`${API_URL}/ai-context`);
        const data = await res.json();
        setContext(data.content || '');
    };

    const handleSave = async () => {
        await fetch(`${API_URL}/ai-context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: context })
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex justify-center h-[75vh]">
            <div className="w-full max-w-3xl glass-panel p-8 rounded-2xl border border-gray-800 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-neon-blue/20 p-3 rounded-full">
                        <span className="text-3xl">🤖</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Treinar Agente IA</h2>
                        <p className="text-gray-400">Insira informações sobre sua empresa para o bot usar nas respostas.</p>
                    </div>
                </div>

                <div className="flex-1 mb-6">
                    <textarea
                        className="w-full h-full bg-black/40 border border-gray-700 p-4 rounded-xl text-white font-mono text-sm leading-relaxed focus:border-neon-blue outline-none resize-none"
                        placeholder="Ex: A GetNexo é uma empresa de software... Nosso horário de atendimento é das 9h às 18h... Produtos: OmniChat, ZapFlow..."
                        value={context}
                        onChange={e => setContext(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-4 items-center">
                    {saved && <span className="text-neon-green font-bold animate-pulse">✅ Salvo com sucesso!</span>}
                    <button
                        onClick={handleSave}
                        className="bg-neon-blue hover:bg-neon-green hover:text-black text-black font-bold px-8 py-3 rounded-lg transition-all shadow-lg"
                    >
                        Salvar Conhecimento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiSettings;
