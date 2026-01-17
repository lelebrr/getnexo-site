
import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.getnexo.com.br';

const STAGES = {
    'lead': 'Novo Lead',
    'qualified': 'Qualificado',
    'proposal': 'Em Negociação',
    'closed': 'Venda Fechada'
};

const KanbanBoard = () => {
    const [contacts, setContacts] = useState([]);
    const [draggedId, setDraggedId] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const res = await fetch(`${API_URL}/contacts`);
        const data = await res.json();
        setContacts(data);
    };

    const handleDragStart = (e, id) => {
        setDraggedId(id);
    };

    const handleDrop = async (e, stage) => {
        e.preventDefault();
        if (!draggedId) return;

        // Optimistic Update
        setContacts(prev => prev.map(c => c.id === draggedId ? { ...c, funnel_stage: stage } : c));

        // Compatible with server.js POST /update-stage
        await fetch(`${API_URL}/update-stage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: draggedId, stage: stage }) // draggedId is the phone or contact ID
        });

        setDraggedId(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div className="flex gap-4 h-[75vh] overflow-x-auto pb-4">
            {Object.keys(STAGES).map(stageKey => (
                <div
                    key={stageKey}
                    className="flex-shrink-0 w-72 bg-black/40 border border-gray-800 rounded-xl flex flex-col"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stageKey)}
                >
                    <div className={`p-4 border-b border-gray-800 font-bold uppercase tracking-wider text-sm ${stageKey === 'closed' ? 'text-neon-green' : 'text-neon-blue'}`}>
                        {STAGES[stageKey]} ({contacts.filter(c => c.funnel_stage === stageKey).length})
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        {contacts.filter(c => (c.funnel_stage || 'lead') === stageKey).map(contact => (
                            <div
                                key={contact.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, contact.id)}
                                className="p-4 bg-gray-900/80 border border-gray-700 rounded-lg cursor-grab hover:border-neon-blue/50 shadow-lg group active:cursor-grabbing"
                            >
                                <div className="font-bold text-white mb-1 truncate">{contact.name || contact.id}</div>
                                <div className="text-xs text-gray-400 mb-2 truncate">{contact.last_message?.body || 'Sem mensagens'}</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-500 font-mono">
                                        {contact.id.split('@')[0].slice(-4)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
