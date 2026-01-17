
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
        <div className="dashboard-container w-full max-w-6xl mx-auto">
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                <button onClick={() => setView('roles')} className={`px-8 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest ${view === 'roles' ? 'bg-[#00d4ff] text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]' : 'bg-white/5 border border-white/10 text-gray-400'}`}>Matriz de Funções</button>
                <button onClick={() => setView('users')} className={`px-8 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest ${view === 'users' ? 'bg-[#00d4ff] text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]' : 'bg-white/5 border border-white/10 text-gray-400'}`}>Membros Ativos</button>
                <button onClick={() => setView('logs')} className={`px-8 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest ${view === 'logs' ? 'bg-[#00ff9d] text-black shadow-[0_0_20px_rgba(0,255,157,0.3)]' : 'bg-white/5 border border-white/10 text-gray-400'}`}>Auditoria Síncrona</button>
                <button onClick={() => { setToken(''); localStorage.removeItem('roles_token'); }} className="ml-auto text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-widest bg-red-400/5 px-6 py-3 rounded-xl border border-red-400/10">Encerrar Sessão</button>
            </div>

            {view === 'roles' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-black text-[#00ff9d] mb-6 uppercase tracking-widest">Registrar Nova Esfera</h3>
                        <div className="space-y-4">
                            <input className="w-full bg-black/60 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#00d4ff]" placeholder="Nome da Função (ex: Vendas)" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
                            <textarea className="w-full bg-black/60 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#00d4ff] h-24" placeholder="Descrição Tática..." value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} />
                        </div>

                        <h4 className="text-gray-500 mb-4 mt-8 text-[0.65rem] font-black uppercase tracking-[0.2em]">Permissões de Acesso</h4>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {['conversations.view', 'conversations.manage', 'contacts.manage', 'reports.view', 'system.admin'].map(p => (
                                <label key={p} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer appearance-none w-5 h-5 bg-black/40 border border-white/10 rounded-md checked:bg-[#00d4ff] checked:border-[#00d4ff] transition-all" checked={!!selectedPerms[p]} onChange={e => setSelectedPerms({ ...selectedPerms, [p]: e.target.checked })} />
                                        <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-black text-xs font-black left-1">✓</div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{p}</span>
                                </label>
                            ))}
                        </div>
                        <button onClick={createRole} className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff9d] text-black font-black py-4 rounded-xl shadow-xl hover:scale-[1.02] transition-transform uppercase tracking-widest text-sm">
                            Sincronizar Função
                        </button>
                    </div>

                    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Matriz Atual</h3>
                        <div className="space-y-4">
                            {roles.map(role => (
                                <div key={role.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#00ff9d]/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <strong className="text-[#00d4ff] text-lg font-black block">{role.name}</strong>
                                            <p className="text-gray-500 text-xs mt-1">{role.description}</p>
                                        </div>
                                        <button onClick={() => deleteRole(role.id)} className="text-red-500/50 hover:text-red-500 text-[0.6rem] font-black uppercase tracking-widest">Eliminar</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.map(p => <span key={p} className="text-[0.6rem] font-bold bg-black/40 text-gray-400 px-3 py-1 rounded-full border border-white/5">{p}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'users' && (
                <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Agentes do Centro de Comando</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-500 text-[0.65rem] font-black uppercase tracking-widest">
                                    <th className="p-4">Identidade</th>
                                    <th className="p-4">Credencial</th>
                                    <th className="p-4">Nível de Acesso</th>
                                    <th className="p-4">Ingresso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#a78bfa] rounded-full flex items-center justify-center font-black text-black text-xs">{u.name?.substring(0, 2).toUpperCase()}</div>
                                                <span className="font-bold text-white text-sm">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm font-mono">{u.email}</td>
                                        <td className="p-4">
                                            <span className="bg-[#00ff9d]/10 text-[#00ff9d] px-4 py-1.5 rounded-full text-[0.6rem] font-black border border-[#00ff9d]/20 tracking-widest uppercase">{u.role_name || 'Agente Base'}</span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs font-bold">{new Date(u.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'logs' && (
                <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 h-[600px] overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Fluxo de Auditoria Quântica</h3>
                    <div className="space-y-6">
                        {logs.map(log => (
                            <div key={log.id} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-[#00d4ff] before:to-transparent">
                                <span className="text-[0.6rem] font-black text-gray-500 uppercase tracking-widest block mb-2">{new Date(log.created_at).toLocaleString()}</span>
                                <div className="text-sm">
                                    <span className="text-[#00d4ff] font-black uppercase tracking-widest mr-2">{log.user_name}</span>
                                    <span className="text-white/60">executou</span>
                                    <span className="text-[#00ff9d] font-black uppercase tracking-widest mx-2">{log.action}</span>
                                </div>
                                <p className="text-gray-400 text-xs mt-2 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">{log.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesManager;
