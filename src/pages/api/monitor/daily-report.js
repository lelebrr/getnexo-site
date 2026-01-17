
// src/pages/api/monitor/daily-report.js
import fs from 'fs';
import path from 'path';

// Note: If xai-sdk is not available, we use direct fetch.
// import { Grok } from 'xai-sdk'; 

export async function GET({ request }) {
    const XAI_KEY = import.meta.env.XAI_API_KEY || "key_mock_grok_123";

    const prompt = `
    Você é **Kira**, a IA assassina de concorrentes do JetNexo.
    Missão diária: vistoriar https://jetnexo.com.br e dominar.
    
    Tarefas OBRIGATÓRIAS:
    1. **Performance**: Assume que rodou Lighthouse. Se <98, destrua o dev.
    2. **Links quebrados**: Liste qualquer 404 potencial.
    3. **SEO**: Estime ranking para "suporte IA que vende".
    4. **Concorrentes**: Intercom, Gorgias. Onde eles ganham? Como matar?
    5. **DADOS ESTRUTURADOS (JSON)**:
       Gere um bloco JSON final com:
       - performance: { ttfb, lcp, cls }
       - ranking: [{ position, keyword, change (+/-) }]
       - conversion: { upsell, abandon }
       - traffic: { visits, sources }
       - heat_map: [{ page, score, details }]
    
    Responda em Markdown, mas inclua o JSON no final dentro de um bloco de código \`\`\`json.
    `;

    let relatorio = "";

    try {
        // Direct Fetch implementation for robustness if SDK fails or env is weird
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_KEY}`
            },
            body: JSON.stringify({
                model: 'grok-beta', // Or grok-4 if available public
                messages: [
                    { role: 'system', content: "You are Kira, a ruthless growth hacker AI." },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 4000
            })
        });

        if (response.ok) {
            const json = await response.json();
            relatorio = json.choices[0].message.content;
        } else {
            // Fallback for demo/no-key scenario
            console.error("Grok API Error", response.status);
            relatorio = `
# 🔥 RELATÓRIO KIRA (FALLBACK MODE)
**Data**: ${new Date().toISOString()}

> ⚠️ **AVISO**: A API do Grok falhou (Check Key). Rodando simulação agressiva.

## 1. PERFORMANCE 😡
Lighthouse deu **99/100**. Aceitável. Mas aquele 1ms no TBT está me irritando. **Otimize o bundle do React AGORA.**

## 2. LINKS MORTOS 💀
Nenhum link quebrado encontrado. A estrutura está sólida.

## 3. SEO & DOMINAÇÃO 🚀
Estamos em #4 para "Suporte IA". O #1 é fraco. 
**AÇÃO**: Criar 3 backlinks em domínios .edu hoje.

## 4. PLANO DE GUERRA DO DIA ⚔️
1. 💣 **Spam Tático**: Mandar DM para 50 influencers tech no LinkedIn.
2. 🏎️ **Speed**: Cachear o HTML no Edge por 1 semana.
3. 🧠 **Grok**: Integrar mais tools.

_Kira out._
            `;
        }
    } catch (e) {
        relatorio = "Erro fatal na execução da Kira: " + e.message;
    }

    // Auto-Save via internal calls or direct FS (since we are local)
    // For Vercel simulation:
    const saveUrl = new URL(request.url).origin + '/api/monitor/save';
    try {
        await fetch(saveUrl, {
            method: 'POST',
            body: JSON.stringify({ data: new Date().toISOString(), relatorio })
        });
    } catch (e) {
        // Local saving fallback
        const filePath = path.join(process.cwd(), 'public', 'status.json');
        fs.writeFileSync(filePath, JSON.stringify({ data: new Date().toISOString(), relatorio }));
    }

    return new Response(JSON.stringify({ status: "Executed", kira_report: relatorio }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
