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

import axios from 'axios';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

// Global Auth Header for Sub-components (Chat, Kanban, etc)
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('omnichat_token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

const OmniChatApp = ({ initialTab = 'chat' }) => {
    const [tab, setTab] = useState(initialTab);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('omnichat_token')) {
            window.location.href = '/admin/login';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('omnichat_token');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
    };

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
