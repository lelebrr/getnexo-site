
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import OrderBuilder from './OrderBuilder';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const socket = io(API_URL);

const ChatInterface = () => {
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);

    // New State for "Pro" Features
    const [isNote, setIsNote] = useState(false);
    const [macros, setMacros] = useState([]);
    const [showMacros, setShowMacros] = useState(false);
    const [showCsat, setShowCsat] = useState(false);

    // Enterprise V2 State
    const [inboxTab, setInboxTab] = useState('all'); // 'all', 'mine', 'resolved'
    const [agents, setAgents] = useState([]);
    const [ticket, setTicket] = useState(null); // { status, assigned_to }
    const [showOrderBuilder, setShowOrderBuilder] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('omnichat_user') || '{}');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchContacts();
        fetchMacros();
        fetchAgents();
        socket.on('new-message', handleNewMessage);
        socket.on('ticket:update', (data) => {
            // Real-time update of ticket status if viewing that contact
            if (activeContactRef.current && activeContactRef.current.phone === data.phone) {
                fetchTicket(data.phone);
            }
            fetchContacts(); // Refresh lists
        });
        socket.on('contact:new', fetchContacts);
        socket.on('contact-updated', fetchContacts);

        return () => {
            socket.off('new-message');
            socket.off('contact:new');
            socket.off('contact-updated');
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${API_URL}/contacts`);
            setContacts(res.data);
            setLoading(false);
        } catch (err) { console.error("Error fetching contacts", err); }
    };

    const fetchMacros = async () => {
        try {
            const res = await axios.get(`${API_URL}/macros`);
            setMacros(res.data);
        } catch (e) { }
    };
    const fetchAgents = async () => {
        try { const res = await axios.get(`${API_URL}/users`); setAgents(res.data); } catch (e) { }
    };

    const fetchTicket = async (phone) => {
        try {
            const res = await axios.get(`${API_URL}/ticket/${phone}`);
            setTicket(res.data);
        } catch (e) { setTicket(null); }
    };

    const handleAssign = async (agentId) => {
        if (!activeContact) return;
        await axios.post(`${API_URL}/ticket/assign`, { phone: activeContact.phone, agent_id: agentId });
        fetchTicket(activeContact.phone);
    };

    const handleResolve = async () => {
        if (!activeContact) return;
        await axios.post(`${API_URL}/ticket/resolve`, { phone: activeContact.phone });
        setTicket({ ...ticket, status: 'resolved' });
    };

    const activeContactRef = useRef(activeContact);
    useEffect(() => { activeContactRef.current = activeContact; }, [activeContact]);

    const handleNewMessage = (msg) => {
        if (activeContactRef.current && activeContactRef.current.phone === msg.phone) {
            setMessages(prev => [...prev, msg]);
        }
        fetchContacts();
    };

    const selectContact = async (contact) => {
        setActiveContact(contact);
        fetchTicket(contact.phone);
        try {
            const res = await axios.get(`${API_URL}/messages?phone=${contact.phone}`);
            setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeContact) return;

        try {
            // Support Internal Notes
            const endpoint = `${API_URL}/send`;
            await axios.post(endpoint, {
                phone: activeContact.phone,
                body: input,
                type: isNote ? 'note' : 'text'
            });
            setInput('');
            setIsNote(false); // Reset to normal mode
            setShowMacros(false);
        } catch (err) { alert('Failed to send'); }
    };

    // Drag and Drop (Kanban Stage Update) Mock
    const handleDragStart = (e, contact) => { e.dataTransfer.setData("contactPhone", contact.phone); };

    const insertMacro = (text) => {
        setInput(text);
        setShowMacros(false);
    };

    const handleRate = async (nota) => {
        try {
            await axios.post(`${API_URL}/csat`, { phone: activeContact.phone, nota });
            alert('Obrigado pela avaliação!');
            setShowCsat(false);
        } catch (e) { }
    };

    return (
        <div className="flex h-[80vh] gap-6">

            {/* Sidebar - Contact List */}
            <div className="w-1/3 flex flex-col glass-panel rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-10 space-y-3">
                    {/* Multichannel Mock Tabs */}
                    <div className="flex gap-1 bg-gray-900 p-1 rounded-lg">
                        <button className="flex-1 bg-gray-800 text-white text-xs py-1 rounded shadow text-center">WhatsApp</button>
                        <button className="flex-1 text-gray-500 hover:text-white text-xs py-1 text-center">Instagram</button>
                        <button className="flex-1 text-gray-500 hover:text-white text-xs py-1 text-center">Messenger</button>
                    </div>
                    {/* Inbox Filters */}
                    <div className="flex justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                        <button onClick={() => setInboxTab('mine')} className={`${inboxTab === 'mine' ? 'text-neon-blue font-bold border-b-2 border-neon-blue' : 'hover:text-white'}`}>Meus</button>
                        <button onClick={() => setInboxTab('all')} className={`${inboxTab === 'all' ? 'text-white font-bold border-b-2 border-white' : 'hover:text-white'}`}>Todos</button>
                        <button onClick={() => setInboxTab('resolved')} className={`${inboxTab === 'resolved' ? 'text-green-500 font-bold border-b-2 border-green-500' : 'hover:text-white'}`}>Resolvidos</button>
                    </div>

                    <input placeholder="Buscar..." className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-neon-blue" />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {loading ? <div className="text-center text-gray-500 mt-10">Carregando...</div> : contacts.map(c => (
                        <div
                            key={c.id}
                            onClick={() => selectContact(c)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, c)}
                            className={`p-3 rounded-xl cursor-pointer transition-all border ${activeContact?.id === c.id ? 'bg-neon-blue/10 border-neon-blue' : 'bg-transparent border-transparent hover:bg-gray-800'} flex items-center gap-3 group`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-gray-600">
                                {c.name ? c.name[0].toUpperCase() : '#'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-200 truncate group-hover:text-white transition-colors">{c.name || c.phone}</h4>
                                    <span className="text-[10px] text-gray-500 bg-gray-900 px-1 rounded uppercase tracking-wider">{c.stage || 'NEW'}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{c.last_message?.body || 'Inicie a conversa...'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-gray-800 overflow-hidden relative">
                {activeContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md flex justify-between items-center z-10">
                            <div>
                                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                                    {activeContact.name || activeContact.phone}
                                    {ticket?.status === 'resolved' && <span className="text-xs bg-green-900 text-green-300 px-2 rounded-full border border-green-700">RESOLVIDO</span>}
                                </h3>
                                <div className="text-xs flex gap-3 text-gray-400">
                                    <select
                                        className="bg-transparent border-none outline-none cursor-pointer hover:text-neon-blue transition-colors"
                                        value={ticket?.assigned_to || ""}
                                        onChange={(e) => handleAssign(e.target.value)}
                                    >
                                        <option value="">👤 Atribuir a...</option>
                                        {agents.map(a => <option key={a.id} value={a.id}>{a.email}</option>)}
                                    </select>
                                    {ticket?.status !== 'resolved' && (
                                        <button onClick={handleResolve} className="hover:text-green-400">✅ Resolver</button>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex gap-2 relative">
                                    <button onClick={() => setShowOrderBuilder(true)} className="text-xs bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-black px-3 py-1 rounded border border-neon-blue transition-colors font-bold">
                                        🛍️ Venda Assistida
                                    </button>
                                    <button onClick={() => setShowCsat(!showCsat)} className="text-xs bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-1 rounded border border-gray-600 transition-colors">
                                        ⭐ CSAT
                                    </button>
                                    {showCsat && (
                                        <div className="absolute top-10 right-0 w-64 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl z-50">
                                            <p className="text-gray-300 mb-3 text-sm font-bold text-center">Nota de 1 a 5:</p>
                                            <div className="flex gap-2 justify-center">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button key={n} onClick={() => handleRate(n)} className="w-8 h-8 rounded-full bg-gray-800 hover:bg-neon-blue hover:text-black text-white font-bold transition-colors border border-gray-600 hover:border-neon-blue">{n}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-dots-pattern">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.from_me ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-lg backdrop-blur-sm border ${m.type === 'note'
                                        ? 'bg-yellow-900/40 border-yellow-600 text-yellow-100' // Internal Note Style
                                        : m.from_me
                                            ? 'bg-neon-blue/20 border-neon-blue/30 text-white rounded-tr-none'
                                            : 'bg-gray-800/80 border-gray-700 text-gray-200 rounded-tl-none'
                                        }`}>
                                        {m.type === 'note' && <div className="text-[10px] uppercase font-bold text-yellow-500 mb-1 flex items-center gap-1">🔒 Nota Interna</div>}
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{m.body}</p>
                                        <span className="text-[10px] opacity-50 mt-2 block text-right">{new Date().toLocaleTimeString().slice(0, 5)}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className={`p-4 border-t border-gray-800 ${isNote ? 'bg-yellow-900/20' : 'bg-black/40'} relative transition-colors`}>

                            {/* Quick Actions Bar */}
                            <div className="flex items-center gap-3 mb-2 px-1">
                                <button
                                    onClick={() => setIsNote(!isNote)}
                                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${isNote ? 'bg-yellow-500 text-black border-yellow-500' : 'text-gray-400 border-gray-700 hover:border-gray-500'}`}
                                >
                                    🔒 Nota Interna
                                </button>
                                <button
                                    onClick={() => setShowMacros(!showMacros)}
                                    className="text-xs font-bold px-3 py-1 rounded-full text-neon-blue border border-gray-700 hover:border-neon-blue transition-all"
                                >
                                    ⚡ Resposta Rápida
                                </button>
                            </div>

                            {/* Macros Popup */}
                            {showMacros && (
                                <div className="absolute bottom-20 left-4 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-2 z-20">
                                    <h5 className="text-xs text-gray-500 font-bold mb-2 px-2">MACROS</h5>
                                    {macros.length === 0 && <div className="text-xs text-gray-600 px-2 italic">Sem macros salvas.</div>}
                                    {macros.map(m => (
                                        <div key={m.id} onClick={() => insertMacro(m.text)} className="p-2 hover:bg-gray-800 rounded cursor-pointer text-sm text-gray-300 truncate">
                                            <span className="font-bold text-neon-blue mr-2">/{m.shortcut || 'macro'}</span>
                                            {m.text}
                                        </div>
                                    ))}
                                    {/* Hardcoded defaults for demo */}
                                    <div onClick={() => insertMacro("Olá! Como posso ajudar você hoje?")} className="p-2 hover:bg-gray-800 rounded cursor-pointer text-sm text-gray-300 truncate">
                                        <span className="font-bold text-neon-blue mr-2">/ola</span> Olá! Como posso ajudar...
                                    </div>
                                    <div onClick={() => insertMacro("Seu pedido foi confirmado e está em separação.")} className="p-2 hover:bg-gray-800 rounded cursor-pointer text-sm text-gray-300 truncate">
                                        <span className="font-bold text-neon-blue mr-2">/status</span> Pedido confirmado
                                    </div>
                                </div>
                            )}

                            <form onSubmit={sendMessage} className="flex gap-4">
                                <input
                                    className={`flex-1 bg-gray-900/50 border p-4 rounded-xl text-white outline-none transition-all ${isNote ? 'border-yellow-600 focus:border-yellow-500 placeholder-yellow-700' : 'border-gray-700 focus:border-neon-blue'}`}
                                    placeholder={isNote ? "Escreva uma nota interna (invisível para o cliente)..." : "Digite sua mensagem..."}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                />
                                <button type="submit" className={`px-6 rounded-xl font-bold transition-all transform hover:scale-105 ${isNote ? 'bg-yellow-600 text-black hover:bg-yellow-500' : 'bg-neon-blue text-black hover:bg-neon-green'}`}>
                                    {isNote ? 'SALVAR' : 'ENVIAR'}
                                </button>
                            </form>
                        </div>

                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                        <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 animate-pulse">
                            <span className="text-4xl">💬</span>
                        </div>
                        <p>Selecione um contato para começar</p>
                    </div>
                )}
            </div>


            {
                showOrderBuilder && (
                    <OrderBuilder
                        onClose={() => setShowOrderBuilder(false)}
                        onSendOrder={(text) => {
                            setInput(text);
                            setShowOrderBuilder(false);
                        }}
                    />
                )
            }
        </div >
    );
};

export default ChatInterface;
