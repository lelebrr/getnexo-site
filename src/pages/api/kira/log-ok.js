
// src/pages/api/kira/log-ok.js
import fs from 'fs';
import path from 'path';

// Helper to simulate Vercel KV / Redis locally
const DB_PATH = path.join(process.cwd(), 'public', 'kira_brain.json');
const TODAY_PATH = path.join(process.cwd(), 'public', 'kira_today.json');

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
    try {
        const { chat_id } = await request.json(); // Data from n8n

        console.log(`✅ [Kira Log] Received OK from Chat ID: ${chat_id}`);

        // 1. Mark in simulated Redis (kv.incr)
        const dateKey = new Date().toISOString().split('T')[0];
        let db = getKV();

        // Key: kira:feito:2026-01-15
        const feitoKey = `kira:feito:${dateKey}`;
        const metaKey = `kira:meta:${dateKey}`;

        let feitos = (db[feitoKey] || 0) + 1;
        let metaHoje = db[metaKey] || 3; // Default to 3 tasks

        // Update DB
        const updatePayload = {};
        updatePayload[feitoKey] = feitos;
        setKV(updatePayload);

        // Also update local Today file for Dashboard sync
        if (fs.existsSync(TODAY_PATH)) {
            const todayData = JSON.parse(fs.readFileSync(TODAY_PATH, 'utf-8'));
            todayData.completed = feitos;
            fs.writeFileSync(TODAY_PATH, JSON.stringify(todayData, null, 2));
        }

        // 2. Verify Logic
        let resposta = '';
        if (feitos >= metaHoje) {
            resposta = '🏆 META BATI. Amanhã: +25%. Kira vai matar mais.';
        } else if (feitos >= metaHoje * 0.66) {
            resposta = '⚔️ 66% feito. Boa. Kira aprova.';
        } else {
            resposta = '⚠️ Precisa mais. Amanhã: plano B.';
        }

        // 3. Send Telegram Reply
        const nextTarget = Math.ceil(metaHoje * 1.25);
        const textToSend = `${resposta} Próxima meta: ${nextTarget} tarefas.`;

        console.log(`📡 [Telegram Out] Sending to ${chat_id}: "${textToSend}"`);

        if (process.env.TELEGRAM_BOT_TOKEN) {
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id,
                    text: textToSend,
                })
            });
        } else {
            console.log("   (Skipped real fetch: No TELEGRAM_BOT_TOKEN)");
        }

        return new Response(JSON.stringify({ status: 'OK saved', msg: textToSend }), { status: 200 });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
