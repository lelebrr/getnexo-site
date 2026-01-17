
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// SECURITY: Simple In-Memory Rate Limiter
const rateLimit = new Map();
const LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimit.get(ip) || { count: 0, start: now };

    if (now - record.start > LIMIT_WINDOW) {
        // Reset window
        record.count = 1;
        record.start = now;
    } else {
        record.count++;
    }

    rateLimit.set(ip, record);
    return record.count <= MAX_REQUESTS;
}

export const prerender = false;

export async function POST({ request, clientAddress }) {
    // 1. Rate Limit Check
    const ip = clientAddress || 'unknown';
    if (!checkRateLimit(ip)) {
        return new Response(JSON.stringify({ error: "Too Many Requests (Rate Limit Exceeded)" }), { status: 429 });
    }

    try {
        console.log(`🤖 api/gerar-artigo: Request from ${ip}`);

        // Execute the python script
        const { stdout, stderr } = await execAsync('python3 /home/lele/usenexo/scripts/autonomous_editor.py');

        console.log("STDOUT:", stdout);

        if (stderr) {
            console.error("STDERR:", stderr);
        }

        // Try to parse the slug from the output
        // The script prints: "💾 Saved: .../blog/{slug}.astro"
        const match = stdout.match(/Saved: .*\/blog\/(.*)\.astro/);
        const slug = match ? match[1] : 'unknown-slug';

        // Try to parse title? Or just return success.
        // Let's assume the script ran fine if no error thrown.

        return new Response(JSON.stringify({
            success: true,
            slug: slug,
            title: "Novo Artigo Gerado (Verificar Blog)",
            log: stdout
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error("Execution Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
