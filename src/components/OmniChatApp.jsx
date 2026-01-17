
import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import KanbanBoard from './KanbanBoard';
import BroadcastManager from './BroadcastManager';
import CatalogManager from './CatalogManager';
import AbandonedCartWidget from './AbandonedCartWidget';
import AiSettings from './AiSettings';
import AdminPanel from './AdminPanel';
import FlowBuilder from './FlowBuilder';

const OmniChatApp = ({ initialTab = 'chat' }) => {
    const [tab, setTab] = useState(initialTab);
    const [selectedFlow, setSelectedFlow] = useState(null);
    useEffect(() => { setTab(initialTab); }, [initialTab]); // Sync if prop changes
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('omnichat_token')) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://api.getnexo.com.br/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.ok) {
                localStorage.setItem('omnichat_token', 'true'); // JWT in prod
                localStorage.setItem('omnichat_user', JSON.stringify(data.user));
                setIsLoggedIn(true);
            } else {
                alert('Login Falhou: ' + (data.error || 'Erro desconhecido'));
            }
        } catch (e) {
            alert('Erro de conexão com servidor API');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('omnichat_token');
        localStorage.removeItem('omnichat_user');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <div className="p-10 text-center text-gray-500 animate-pulse">Autenticando painel...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-transparent text-gray-200">
            {/* App Tabs / Navigation (Sub-header) */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-gray-800 p-2 flex justify-between items-center mb-4 rounded-xl mx-4 mt-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button onClick={() => setTab('chat')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'chat' ? 'bg-[#00d4ff] text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>💬</span> Chat
                    </button>
                    <button onClick={() => setTab('flows')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'flows' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,165,0,0.4)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>⚡</span> Flows
                    </button>
                    <button onClick={() => setTab('kanban')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'kanban' ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.4)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>📊</span> Kanban
                    </button>
                    <button onClick={() => setTab('broadcast')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'broadcast' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(128,0,128,0.4)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>📢</span> Disparos
                    </button>
                    <button onClick={() => setTab('store')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'store' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>🏪</span> Loja
                    </button>
                    <button onClick={() => setTab('ai')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'ai' ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>🤖</span> AI
                    </button>
                    <button onClick={() => setTab('admin')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${tab === 'admin' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <span>⚙️</span> Admin
                    </button>
                </div>

                <div className="flex gap-2">
                    <button className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366] px-3 py-1 rounded-lg font-bold hover:bg-[#25D366] hover:text-white transition-all text-xs flex items-center gap-2" onClick={() => window.open('http://localhost:3000', '_blank')}>
                        QR Code
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[70vh]">
                {tab === 'chat' && <ChatInterface />}
                {tab === 'flows' && <FlowBuilder />}
                {tab === 'kanban' && <KanbanBoard />}
                {tab === 'broadcast' && <BroadcastManager />}
                {tab === 'store' && <CatalogManager />}
                {tab === 'ai' && <AiSettings />}
                {tab === 'admin' && <AdminPanel />}

                import ResellerPanel from './ResellerPanel';

                // ... (inside render)
                {tab === 'revenda' && <ResellerPanel />}

                {tab === 'reports' && (
                    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
                        <h2 className="text-3xl font-bold text-white mb-6">Relatórios & Analytics</h2>
                        <div className="flex-1 bg-black/40 rounded-2xl border border-gray-800 flex items-center justify-center p-10">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📈</div>
                                <h3 className="text-2xl font-bold text-white">Módulo de BI em Construção</h3>
                                <p className="text-gray-400 mt-2 max-w-md">Em breve você terá gráficos detalhados de conversão, tempo de resposta e ROI das campanhas.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AbandonedCartWidget />
        </div>
    );
};

export default OmniChatApp;
