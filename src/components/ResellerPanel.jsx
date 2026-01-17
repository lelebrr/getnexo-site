import React, { useState } from 'react';

const ResellerPanel = () => {
    const [referralLink, setReferralLink] = useState('https://getnexo.com.br/r/leandro123');
    const [stats] = useState({
        commissions: 1450.00,
        active_clients: 12,
        clicks: 342,
        conversion_rate: 3.5
    });

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Link copiado!');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">

            {/* HERO SECTION: GAMIFICATION */}
            <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-8 flex items-center justify-between">
                <div className="relative z-10 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-black px-2 py-1 rounded mb-2 inline-block">PARCEIRO GOLD</span>
                            <h2 className="text-4xl font-black text-white italic tracking-tight mb-2">PAINEL DE AFILIADO</h2>
                            <p className="text-gray-400 max-w-lg">Você está entre os top 5% parceiros. Continue indicando para desbloquear o <span className="text-neon-blue font-bold">Plano Black</span>.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Próximo Nível</div>
                            <div className="text-2xl font-bold text-white mb-2">85<span className="text-sm text-gray-500">/100 Vendas</span></div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-1 font-mono">
                            <span>Level 3</span>
                            <span>Level 4 (Black)</span>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                            <div className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 w-[85%] shadow-[0_0_15px_rgba(255,165,0,0.5)]"></div>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none"></div>
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none"></div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-xl border border-gray-800 relative overflow-hidden group hover:border-neon-green/50 transition-colors">
                    <div className="absolute top-2 right-2 p-2 bg-neon-green/10 rounded-lg text-neon-green text-xl md:text-2xl group-hover:scale-110 transition-transform">💰</div>
                    <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Comissões Totais</h3>
                    <div className="text-3xl font-black text-white">R$ {stats.commissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-neon-green mt-1 font-bold">+R$ 350,00 esta semana</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-gray-800 relative overflow-hidden group hover:border-neon-blue/50 transition-colors">
                    <div className="absolute top-2 right-2 p-2 bg-neon-blue/10 rounded-lg text-neon-blue text-xl md:text-2xl group-hover:scale-110 transition-transform">👥</div>
                    <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Clientes Ativos</h3>
                    <div className="text-3xl font-black text-white">{stats.active_clients}</div>
                    <div className="text-xs text-gray-400 mt-1">Churn rate: 0.5% (Baixo)</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-gray-800 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                    <div className="absolute top-2 right-2 p-2 bg-purple-500/10 rounded-lg text-purple-400 text-xl md:text-2xl">⚡</div>
                    <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Cliques (Link)</h3>
                    <div className="text-3xl font-black text-white">{stats.clicks}</div>
                    <div className="text-xs text-gray-400 mt-1">CTR médio: 3.5%</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-gray-800 bg-neon-green/5 flex flex-col justify-center items-center cursor-pointer hover:bg-neon-green/10 transition-colors border-dashed border-2 border-neon-green/30">
                    <span className="text-2xl mb-1">💸</span>
                    <span className="text-neon-green font-bold text-sm">SACAR R$ 1.450,00</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Link Generator */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900 via-gray-900 to-black relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-purple-500"></div>
                        <h3 className="text-white font-bold mb-1 text-lg">Seu Link Mágico</h3>
                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">Envie este link. O cookie dura 90 dias. A comissão cai na hora.</p>

                        <div className="bg-black border border-gray-700 rounded-lg p-3 mb-4 flex gap-2 items-center shadow-inner relative group">
                            <input
                                value={referralLink}
                                readOnly
                                className="bg-transparent text-neon-blue text-sm w-full outline-none font-mono tracking-tighter"
                            />
                            <div className="absolute right-2 bg-neon-blue/20 text-neon-blue text-[10px] px-2 py-1 rounded hidden group-hover:block animate-fade-in">Copiar</div>
                        </div>
                        <button onClick={copyLink} className="w-full bg-neon-blue text-black font-black py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all transform hover:-translate-y-1">
                            COPIAR LINK
                        </button>

                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Materiais de Venda</h4>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded border border-gray-700">Banner Stories</button>
                                <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded border border-gray-700">Copy WhatsApp</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Clients Table */}
                <div className="lg:col-span-2 glass-panel p-0 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="font-bold text-white">Últimas Conversões</h3>
                        <span className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded">Tempo Real</span>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black/40 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Plano</th>
                                    <th className="p-4">Data</th>
                                    <th className="p-4 text-right">Sua Parte</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                <tr className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-neon-blue transition-colors">Padaria Central</div>
                                        <div className="text-[10px]">padariacentral.com.br</div>
                                    </td>
                                    <td className="p-4"><span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase">Enterprise</span></td>
                                    <td className="p-4">12 Jan</td>
                                    <td className="p-4 text-neon-green font-mono font-bold text-right">+ R$ 150,00</td>
                                </tr>
                                <tr className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-neon-blue transition-colors">Oficina do Zé</div>
                                        <div className="text-[10px]">automecanica.com.br</div>
                                    </td>
                                    <td className="p-4"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase">Pro</span></td>
                                    <td className="p-4">10 Jan</td>
                                    <td className="p-4 text-neon-green font-mono font-bold text-right">+ R$ 89,00</td>
                                </tr>
                                <tr className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white">Clinica Sorriso</div>
                                        <div className="text-[10px]">clinicasorriso.com.br</div>
                                    </td>
                                    <td className="p-4"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase">Pro</span></td>
                                    <td className="p-4">08 Jan</td>
                                    <td className="p-4 text-neon-green font-mono font-bold text-right">+ R$ 89,00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-800 bg-gray-900/30 text-center">
                        <button className="text-xs text-gray-500 hover:text-white transition-colors">Ver todos os 12 clientes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResellerPanel;
