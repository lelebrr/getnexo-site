
// src/pages/api/monitor/heat-map.js
import fs from 'fs';
import path from 'path';

export async function GET() {
    // Read the latest status from the file system (simulating DB)
    const filePath = path.join(process.cwd(), 'public', 'kira_status.json');
    let data = {};

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(fileContent);

        // Extract JSON block from report if it exists, or use mock data if legacy report
        // Logic: specific extraction or pre-parsed saving.
        // For simplicity, we'll mock the granular chart data here based on the "latest run" logic.

        data = {
            perf: [98, 97, 99, 98, 99, 98, 100], // Last 7 days
            ranking: [
                { keyword: "suporte IA", pos: 3, var: "+2" },
                { keyword: "chatbot whatsapp", pos: 7, var: "+5" },
                { keyword: "venda automatica", pos: 12, var: "-1" },
                { keyword: "atendimento 24h", pos: 2, var: "0" }
            ],
            conversion: {
                upsell: 34,
                abandon: 12
            },
            heatmap: [
                { page: "/precos", warm: 85 },
                { page: "/funcionalidades", warm: 65 },
                { page: "/blog/ia-vendeu-8k", warm: 92 },
                { page: "/contato", warm: 40 }
            ]
        };

    } catch (e) {
        data = { error: "No data available" };
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
