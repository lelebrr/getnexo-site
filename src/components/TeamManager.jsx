import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManager = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ email: '', password: '', role_id: 1 });

    const API_URL = import.meta.env.PUBLIC_API_URL || 'https://api.getnexo.com.br';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, rolesRes] = await Promise.all([
                axios.get(`${API_URL}/api/users`),
                axios.get(`${API_URL}/api/roles`)
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            alert('Erro ao carregar dados da equipe.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update
                await axios.put(`${API_URL}/api/users/${editingUser.id}`, formData);
                alert('Usuário atualizado com sucesso!');
            } else {
                // Create
                await axios.post(`${API_URL}/api/users`, formData);
                alert('Usuário criado com sucesso!');
            }
            setModalOpen(false);
            setEditingUser(null);
            setFormData({ email: '', password: '', role_id: 1 });
            fetchData();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Erro ao salvar usuário: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja remover este usuário?')) return;
        try {
            await axios.delete(`${API_URL}/api/users/${id}`);
            alert('Usuário removido.');
            fetchData();
        } catch (error) {
            alert('Erro ao remover: ' + (error.response?.data?.error || error.message));
        }
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setFormData({ email: user.email, password: '', role_id: user.role_id }); // Password blank on edit
        setModalOpen(true);
    };

    const openNew = () => {
        setEditingUser(null);
        setFormData({ email: '', password: '', role_id: 1 });
        setModalOpen(true);
    };

    return (
        <div className="p-6 text-white max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#00ff9d] bg-clip-text text-transparent">Gestão de Equipe</h2>
                    <p className="text-gray-400">Adicione agentes e administradores ao seu OmniNexo.</p>
                </div>
                <button onClick={openNew} className="bg-[#00d4ff] hover:bg-[#00c4ef] text-black font-bold py-2 px-6 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">
                    + Novo Usuário
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500 animate-pulse">Carregando equipe...</div>
            ) : (
                <div className="bg-black/40 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-800">
                                <th className="p-4">ID</th>
                                <th className="p-4">Email / Login</th>
                                <th className="p-4">Cargo</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 text-gray-500">#{user.id}</td>
                                    <td className="p-4 font-medium text-white">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role_name === 'Admin' ? 'bg-purple-900/50 text-purple-300 border border-purple-700' : 'bg-blue-900/50 text-blue-300 border border-blue-700'}`}>
                                            {user.role_name || 'Agente'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => openEdit(user)} className="text-[#00d4ff] hover:text-white transition-colors">Editar</button>
                                        {user.id !== 1 && (
                                            <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-400 transition-colors">Excluir</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum usuário encontrado.</div>}
                </div>
            )}

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0a0e17] border border-gray-700 rounded-2xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                        <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                        <h3 className="text-2xl font-bold mb-6 text-white">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email (Login)</label>
                                <input
                                    type="email" required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00d4ff] outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00d4ff] outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingUser ? "••••••••" : ""}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cargo</label>
                                <select
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-[#00d4ff] outline-none"
                                    value={formData.role_id}
                                    onChange={e => setFormData({ ...formData, role_id: Number(e.target.value) })}
                                >
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-[#00ff9d] hover:bg-[#00e68d] text-black font-bold py-3 rounded-lg shadow-lg mt-4 transition-all0">
                                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManager;
