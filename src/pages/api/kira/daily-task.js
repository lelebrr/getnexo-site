
// src/pages/api/kira/daily-task.js
import fs from 'fs';
import path from 'path';

// This API is called by n8n at 07:00 AM
export async function GET() {
    console.log("🔥 [Kira API] Generating Daily Tasks for n8n...");

    const prompt = `Gera 3 tarefas de hoje com horário exato (08:30, 11:00, 18:00) para um fundador de SaaS agressivo.
    Meta atual: Vender IA de suporte.
    Responda APENAS um JSON válido.
    Formato:
    {
        "meta": "1 Venda",
        "horario1": "08:30", "task1": "Post LinkedIn...",
        "horario2": "11:00", "task2": "DM 10 CTOs...",
        "horario3": "18:00", "task3": "Story..."
    }`;

    try {
        let taskData;

        if (process.env.XAI_API_KEY) {
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'grok-beta', // Adjusted model name
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            // Simple parsing assuming Grok behaves
            const content = data.choices[0].message.content;
            // Extract JSON if wrapped in markdown
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            taskData = JSON.parse(jsonStr);
        } else {
            // Fallback Mock
            taskData = {
                "meta": "Domínio Total",
                "horario1": "08:30", "task1": "Post LinkedIn: 'IA que vende sozinha.'",
                "horario2": "11:00", "task2": "DM 10 E-commerces no Telegram.",
                "horario3": "18:00", "task3": "Story do Dashboard mostrando leads."
            };
        }

        // Save to today state for tracking
        const todayPath = path.join(process.cwd(), 'public', 'kira_today.json');
        fs.writeFileSync(todayPath, JSON.stringify({ ...taskData, completed: 0, status: 'pending' }));

        return new Response(JSON.stringify(taskData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
