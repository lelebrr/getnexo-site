
// src/pages/api/kira/nightly-review.js
import fs from 'fs';
import path from 'path';

// Called by n8n at 22:00
export async function GET() {
    console.log("🌙 [Kira API] Nightly Performance Review...");

    const todayPath = path.join(process.cwd(), 'public', 'kira_today.json');
    if (!fs.existsSync(todayPath)) return new Response(JSON.stringify({ msg: "No data" }));

    const data = JSON.parse(fs.readFileSync(todayPath, 'utf-8'));
    const completed = data.completed || 0;
    const total = 3;
    const percentage = (completed / total) * 100;

    let verdict = "";
    let adjustment = "";

    if (percentage > 66) {
        verdict = `Você matou ${parseInt(percentage)}% das tarefas.`;
        adjustment = "Meta +20%. Amanhã: 4 tarefas.";
    } else if (percentage === 0) {
        verdict = "Fracasso total (0%).";
        adjustment = "Ativando Protocolo de Emergência (Spam Mode).";
    } else {
        verdict = "Medíocre.";
        adjustment = "Manter pressão.";
    }

    return new Response(JSON.stringify({
        report: `Relatório Noturno:\n${verdict}\n${adjustment}`,
        next_day_difficulty: percentage > 66 ? "hard" : "normal"
    }), { status: 200 });
}
