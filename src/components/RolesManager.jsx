
import React, { useState, useEffect } from 'react';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const RolesManager = () => {
    const [token, setToken] = useState(localStorage.getItem('roles_token') || '');
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [view, setView] = useState('login'); // login, roles, users, logs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Forms state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDesc, setNewRoleDesc] = useState('');
    const [selectedPerms, setSelectedPerms] = useState({});

    useEffect(() => {
        if (token) {
            fetchRoles();
            fetchUsers();
            fetchLogs();
            setView('roles');
        }
    }, [token]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPass })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('roles_token', data.token);
                setToken(data.token);
                setError('');
            } else {
                setError('Login failed');
            }
        } catch (e) {
            setError('Connection error');
        }
        setLoading(false);
    };

    const fetchRoles = async () => {
        const res = await fetch(`${API_URL}/roles`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setRoles(await res.json());
    };

    const fetchUsers = async () => {
        const res = await fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setUsers(await res.json());
    };

    const fetchLogs = async () => {
        const res = await fetch(`${API_URL}/logs`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setLogs(await res.json());
    };

    const createRole = async () => {
        const permissions = Object.keys(selectedPerms).filter(k => selectedPerms[k]);
        await fetch(`${API_URL}/roles`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newRoleName, description: newRoleDesc, permissions })
        });
        fetchRoles();
        setNewRoleName('');
        setNewRoleDesc('');
        setSelectedPerms({});
    };

    const deleteRole = async (id) => {
        if (window.confirm('Are you sure?')) {
            await fetch(`${API_URL}/roles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchRoles();
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <form onSubmit={handleLogin} className="glass-panel p-8 rounded-xl max-w-sm w-full border border-[rgba(0,212,255,0.2)]">
                    <h2 className="text-2xl font-bold mb-6 text-center text-neon-blue">Acesso Admin</h2>
                    {error && <p className="text-red-400 mb-4">{error}</p>}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="admin@getnexo.local"
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            className="w-full bg-[rgba(10,14,23,0.8)] border border-gray-700 p-3 rounded text-white focus:border-neon-blue outline-none"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="password"
                            value={loginPass}
                            onChange={e => setLoginPass(e.target.value)}
                            className="w-full bg-[rgba(10,14,23,0.8)] border border-gray-700 p-3 rounded text-white focus:border-neon-blue outline-none"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-neon-blue to-neon-green text-black font-bold p-3 rounded hover:scale-105 transition-transform">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="dashboard-container w-full max-w-6xl mx-auto p-4">
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button onClick={() => setView('roles')} className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'roles' ? 'bg-neon-blue text-black glow' : 'border border-gray-700 text-gray-400'}`}>Funções</button>
                <button onClick={() => setView('users')} className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'users' ? 'bg-neon-blue text-black glow' : 'border border-gray-700 text-gray-400'}`}>Usuários</button>
                <button onClick={() => setView('logs')} className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'logs' ? 'bg-neon-blue text-black glow' : 'border border-gray-700 text-gray-400'}`}>Auditoria</button>
                <button onClick={() => { setToken(''); localStorage.removeItem('roles_token'); }} className="ml-auto text-red-400 hover:text-red-300">Sair</button>
            </div>

            {view === 'roles' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-neon-green mb-4">Nova Função</h3>
                        <input className="w-full mb-3 bg-black/40 border border-gray-700 p-2 rounded text-white" placeholder="Nome da Função (ex: Vendas)" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
                        <input className="w-full mb-3 bg-black/40 border border-gray-700 p-2 rounded text-white" placeholder="Descrição" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} />

                        <h4 className="text-gray-400 mb-2 mt-4 text-sm uppercase tracking-wide">Permissões</h4>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {['conversations.view', 'conversations.manage', 'contacts.manage', 'reports.view'].map(p => (
                                <label key={p} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                                    <input type="checkbox" checked={!!selectedPerms[p]} onChange={e => setSelectedPerms({ ...selectedPerms, [p]: e.target.checked })} />
                                    {p}
                                </label>
                            ))}
                        </div>
                        <button onClick={createRole} className="w-full bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black font-bold py-2 rounded transition-colors">
                            Criar Função
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-4">Funções Existentes</h3>
                        <div className="space-y-3">
                            {roles.map(role => (
                                <div key={role.id} className="p-4 bg-black/40 rounded border border-gray-800 hover:border-neon-green/50 transition-colors flex justify-between items-start">
                                    <div>
                                        <strong className="text-neon-blue block mb-1">{role.name}</strong>
                                        <p className="text-gray-400 text-sm mb-2">{role.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.map(p => <span key={p} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{p}</span>)}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteRole(role.id)} className="text-red-500 hover:text-red-400 text-sm">Remover</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'users' && (
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4">Usuários do Sistema</h3>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-3">Nome</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Função</th>
                                <th className="p-3">Criado em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-800 hover:bg-white/5">
                                    <td className="p-3 text-white">{u.name}</td>
                                    <td className="p-3 text-gray-400">{u.email}</td>
                                    <td className="p-3"><span className="text-neon-green bg-neon-green/10 px-2 py-1 rounded text-sm">{u.role_name || 'Sem função'}</span></td>
                                    <td className="p-3 text-gray-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'logs' && (
                <div className="glass-panel p-6 rounded-xl border border-gray-800 h-[500px] overflow-y-auto font-mono text-sm">
                    <h3 className="text-xl font-bold text-white mb-4 font-sans">Logs de Auditoria</h3>
                    {logs.map(log => (
                        <div key={log.id} className="border-l-2 border-neon-blue pl-4 py-2 mb-2">
                            <span className="text-gray-500 block text-xs">{new Date(log.created_at).toLocaleString()}</span>
                            <span className="text-neon-blue font-bold">{log.user_name}</span> <span className="text-gray-300">performed</span> <span className="text-neon-green">{log.action}</span>
                            <p className="text-gray-400 mt-1">{log.details}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default RolesManager;
