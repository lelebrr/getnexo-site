import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import KanbanBoard from './KanbanBoard';
import BroadcastManager from './BroadcastManager';
import CatalogManager from './CatalogManager';
import AbandonedCartWidget from './AbandonedCartWidget';
import AiSettings from './AiSettings';
import AdminPanel from './AdminPanel';
import FlowBuilder from './FlowBuilder';
import ResellerPanel from './ResellerPanel';
import ReportsPanel from './ReportsPanel';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const OmniChatApp = ({ initialTab = 'chat' }) => {
    const [tab, setTab] = useState(initialTab);
    const [selectedFlow, setSelectedFlow] = useState(null);
    useEffect(() => { setTab(initialTab); }, [initialTab]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('omnichat_token')) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.ok) {
                localStorage.setItem('omnichat_token', 'true');
                localStorage.setItem('omnichat_user', JSON.stringify(data.user));
                setIsLoggedIn(true);
            } else {
                setLoginError(data.error || 'Credenciais inválidas');
            }
        } catch (e) {
            setLoginError('Erro de conexão com servidor');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('omnichat_token');
        localStorage.removeItem('omnichat_user');
        setIsLoggedIn(false);
    };

    // Login Form
    if (!isLoggedIn) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-8">
                <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        <span className="text-[#00ff9d]">OmniNexo</span> Dashboard
                    </h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00d4ff] focus:outline-none"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00d4ff] focus:outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {loginError && (
                            <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{loginError}</div>
                        )}
                        <button type="submit" className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff9d] text-black font-bold py-3 rounded-lg hover:opacity-90 transition">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'chat', icon: '💬', label: 'Chat', color: 'bg-[#00d4ff]' },
        { id: 'flows', icon: '⚡', label: 'Flows', color: 'bg-orange-500' },
        { id: 'kanban', icon: '📊', label: 'Kanban', color: 'bg-[#00ff9d]' },
        { id: 'broadcast', icon: '📢', label: 'Disparos', color: 'bg-purple-500' },
        { id: 'store', icon: '🏪', label: 'Loja', color: 'bg-yellow-500' },
        { id: 'ai', icon: '🤖', label: 'IA', color: 'bg-cyan-500' },
        { id: 'reports', icon: '📈', label: 'Relatórios', color: 'bg-emerald-500' },
        { id: 'revenda', icon: '💰', label: 'Revenda', color: 'bg-pink-500' },
        { id: 'admin', icon: '⚙️', label: 'Admin', color: 'bg-gray-700' },
    ];

    return (
        <div className="flex flex-col h-full bg-transparent text-gray-200">
            {/* Navigation Tabs */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-gray-800 p-2 flex justify-between items-center mb-4 rounded-xl mx-4 mt-4">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-2 rounded-lg font-bold transition-all text-xs flex items-center gap-1 whitespace-nowrap ${tab === t.id
                                    ? `${t.color} text-black shadow-lg`
                                    : 'text-gray-400 hover:bg-gray-800'
                                }`}
                        >
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-400 text-xs px-2"
                >
                    Sair
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[70vh] flex-1">
                {tab === 'chat' && <ChatInterface />}
                {tab === 'flows' && <FlowBuilder />}
                {tab === 'kanban' && <KanbanBoard />}
                {tab === 'broadcast' && <BroadcastManager />}
                {tab === 'store' && <CatalogManager />}
                {tab === 'ai' && <AiSettings />}
                {tab === 'reports' && <ReportsPanel />}
                {tab === 'revenda' && <ResellerPanel />}
                {tab === 'admin' && <AdminPanel />}
            </div>

            <AbandonedCartWidget />
        </div>
    );
};

export default OmniChatApp;
