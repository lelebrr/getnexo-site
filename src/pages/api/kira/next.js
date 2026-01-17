
// src/pages/api/kira/next.js
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'public', 'kira_brain.json');

function getKV() {
    if (!fs.existsSync(DB_PATH)) return {};
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function setKV(data) {
    const current = getKV();
    const updated = { ...current, ...data };
    fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2));
}

export async function POST({ request }) {
    const body = await request.json();
    const status = body.status; // 'feito' or 'morreu'

    let db = getKV();
    let currentPhase = db.fase || 1;
    let feedback = "";

    if (status === 'feito') {
        currentPhase += 1;
        feedback = "🛡️ OK recebido. O inimigo recuou. Se prepare para a próxima onda.";
        // Logic to mutate plan could go here
    } else if (status === 'morreu') {
        feedback = "💀 BAIXA DETECTADA. Reiniciando protocolos de emergência. Plano resetado.";
        // Wipe plan to force regen next load
        setKV({ plano_atual: null, fase: 1 });
        return new Response(JSON.stringify({ acao: feedback, reset: true }));
    } else if (status === 'replan') {
        feedback = "🔄 Reavaliando campo de batalha... Nova estratégia compilada.";
        setKV({ plano_atual: null, fase: currentPhase });
        return new Response(JSON.stringify({ acao: feedback, reset: true }));
    }

    setKV({ fase: currentPhase });

    return new Response(JSON.stringify({ acao: feedback, fase: currentPhase }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
