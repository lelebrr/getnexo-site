
import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.getnexo.com.br';

const BroadcastManager = () => {
    const [name, setName] = useState('');
    const [template, setTemplate] = useState('');
    const [contacts, setContacts] = useState([]);
    const [selectedPhones, setSelectedPhones] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_URL}/contacts`);
            const data = await res.json();
            setContacts(data);
        } catch (e) { console.error(e); }
    };

    const toggleSelect = (phone) => {
        if (selectedPhones.includes(phone)) {
            setSelectedPhones(prev => prev.filter(p => p !== phone));
        } else {
            setSelectedPhones(prev => [...prev, phone]);
        }
    };

    const selectAll = () => setSelectedPhones(contacts.map(c => c.phone));
    const selectNone = () => setSelectedPhones([]);

    const handleSend = async () => {
        if (!name || !template || selectedPhones.length === 0) {
            alert('Preencha o nome, mensagem e selecione contatos.');
            return;
        }

        if (!confirm(`Enviar para ${selectedPhones.length} contatos?`)) return;

        try {
            const res = await fetch(`${API_URL}/campaign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, template, phones: selectedPhones })
            });
            const data = await res.json();
            if (data.ok) {
                alert(`🚀 Disparo iniciado para ${data.queued} números!`);
                setName('');
                setTemplate('');
                setSelectedPhones([]);
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (e) {
            alert('Erro de conexão');
        }
    };

    return (
        <div className="flex gap-6 h-[75vh]">
            {/* Left: Input */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="glass-panel p-4 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-bold text-neon-blue mb-4">📢 Nova Campanha</h3>

                    <label className="text-gray-400 text-sm">Nome da Campanha</label>
                    <input className="w-full bg-black/40 border border-gray-700 p-2 rounded text-white mb-4" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Aviso Importante" />

                    <label className="text-gray-400 text-sm">Mensagem</label>
                    <textarea className="w-full h-32 bg-black/40 border border-gray-700 p-2 rounded text-white mb-4" value={template} onChange={e => setTemplate(e.target.value)} placeholder="Olá!..." />

                    <div className="text-sm text-gray-500 mb-4">
                        Selecionados: <span className="text-white font-bold">{selectedPhones.length}</span>
                    </div>

                    <button onClick={handleSend} className="w-full bg-neon-green text-black font-bold p-3 rounded hover:opacity-90 transition-all">
                        INICIAR DISPARO
                    </button>
                </div>
            </div>

            {/* Right: Contact Selector */}
            <div className="flex-1 glass-panel p-4 rounded-xl border border-gray-800 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Selecionar Públicos</h3>
                    <div className="flex gap-2">
                        <button onClick={selectAll} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Todos</button>
                        <button onClick={selectNone} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Nenhum</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {contacts.map(c => (
                        <div
                            key={c.id}
                            onClick={() => toggleSelect(c.phone)}
                            className={`p-3 rounded cursor-pointer border transition-all ${selectedPhones.includes(c.phone) ? 'bg-neon-blue/20 border-neon-blue' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}
                        >
                            <div className="font-bold text-white truncate">{c.name || 'Desconhecido'}</div>
                            <div className="text-xs text-gray-400">{c.phone}</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">{c.stage}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BroadcastManager;
