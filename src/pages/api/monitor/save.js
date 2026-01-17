
// src/pages/api/monitor/save.js
import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { relatorio, data } = body;

        // In a real Vercel env, use Vercel KV.
        // For this local "Golden Master", we save to a public JSON file 
        // that the admin dashboard can purely read.

        const filePath = path.join(process.cwd(), 'public', 'kira_status.json');

        const statusData = {
            last_run: data,
            report: relatorio,
            history: [] // Could append here
        };

        fs.writeFileSync(filePath, JSON.stringify(statusData, null, 2));

        // Telegram Notification Mock
        console.log(`📠 [Kira] Report Saved. Notification sent to Admin.`);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
