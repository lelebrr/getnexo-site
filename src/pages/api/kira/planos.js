
// src/pages/api/kira/planos.js
import fs from 'fs';
import path from 'path';

// Mock KV Store
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

export async function GET() {
    // Check if plan exists
    const db = getKV();
    if (db.plano_atual) {
        return new Response(JSON.stringify({ plan: db.plano_atual, status: 'loaded' }), {
            status: 200, headers: { "Content-Type": "application/json" }
        });
    }

    // If not, generate aggressively
    // Aggressive "General" Prompt
    const prompt = `
    Você é Kira, a IA implacável do JetNexo. O site acabou de lançar. Missão: DOMINAR.
    Gere 3 planos com metas claras, ações brutais (dentro ou fora da lei – mas avisa risco), e checkpoints.
    
    Estrutura:
    1. CURTO PRAZO (7–30 dias)
    - Objetivo principal
    - 5 ações imediatas (com link, post, ferramenta, copy pronta)
    - Checkpoint: o que eu faço depois de fazer
    - Se der errado, o que mudar
    
    2. MÉDIO (30–90)
    - Objetivo
    - Estratégias de escala (SEO, backlink, PBN, guest post, afiliado)
    - Riscos e como tapar
    
    3. LONGO (90–365)
    - Domínio total: ser o nome da categoria
    - Playbook: PR, comunidade, produto de assinatura, IA própria
    
    Tom: militar, curto, sem piedade. Use emojis de fogo, espada, morte quando for agressivo.
    
    Pós-lançamento (Obrigatório incluir):
    - POSTA HOJE: "Acabei de lançar IA que vende sozinha..." (LinkedIn/Twitter).
    - FAÇA 3 guest posts (Copy: "Como dobrei vendas...").
    - COMPRA backlink barato (Aviso de risco).
    - Se falhar em 7 dias: Ativar campanha "Cupom JET10" no WhatsApp.
    `;

    let plano = "";

    // Simulation of AI Call
    // In a real scenario, we would fetch(https://api.x.ai/...)

    // The "Generated" Plan (First Order)
    plano = `
# ⚔️ PLANO DE GUERRA – KIRA
**Data**: 15/01/2026 – 02:41
**Situação**: Site no ar. Primeira venda? Zero. Hora de matar.

## 🔥 CURTO PRAZO – 7 DIAS
**Meta principal**: Fazer a primeira venda.
**Meta atual**: 1 venda → 0% complet

### Ações imediatas:
1. **📢 POSTA HOJE – LinkedIn**:
   > "Mudei o jogo. Lancei uma IA que fecha vendas no chat. Quem quer o primeiro teste grátis? Só 5 vagas."
   ➤ Link: [https://jetnexo.com.br/precos?ref=li](https://jetnexo.com.br/precos?ref=li)
2. **🎟️ Cria cupom – \`JET10\`**: (10% off no primeiro mês). Usa no WhatsApp.
3. **💬 Manda 10 DMs – Grupos de e-commerce no Telegram**:
   > "E aí, quer reduzir abandono de carrinho em 70%? Te mando demo."
4. **🔗 Compra backlink barato**: 3 sites PR 3/4 no Fiverr. Custo: R$120. Risco: baixo.
5. **📊 Instala Plausible.io**: trackea tudo. Manda relatório pra Kira.

**Checkpoint**: Quando fechar a primeira venda, clica **FEITO**.
*Se falhar em 48h*: ativa campanha WhatsApp com cupom \`JET15\` e manda pra 200 contatos.

## 🚀 MÉDIO PRAZO – 30 DIAS
**Meta principal**: 50 vendas recorrentes.
**Meta atual**: 13 vendas → 0% complet

### Estratégias:
*   **20 guest posts** em blogs de e-commerce – copy pronta: *"Como dobrei vendas com IA"*.
*   **Cria PBN interna**: 5 sites .com.br comprados barato, aponta pra JetNexo (risco médio – avisa).
*   **Afiliado**: dá 30% comissão pra quem indicar loja.
*   **Convida 3 influenciadores** (1k–5k segs): troca de teste grátis por post.

## 👑 LONGO PRAZO – 90 DIAS
**Meta principal**: Ser o nome que falam quando dizem ‘suporte que vende’

### Playbook:
*   **Lança curso**: "Vendas com IA – Zero a 100k" – usa o que já gerou.
*   **Cria comunidade no Discord**: "Clube do JetNexo" – IA modera, dá cupom.
*   **PR na Canaltech**: "A IA brasileira que vende sozinha."
*   **Marca própria**: JetNexo Pro – assinatura anual, 499/mês.

### SISTEMA DE ESCALA:
*   **Meta batida antes do prazo?** Aumenta 25%. Ex: 13 vendas → 16 vendas.
*   **Meta estourando?** Reduz 30%, foca no essencial.
*   **Nunca fica sem alvo.** Sempre tem plano. Sempre tem guerra.

**Próximo passo**: Clica em **FEITO** quando postar no LinkedIn. Kira aguarda. E mata.
    `;

    setKV({ plano_atual: plano, fase: 1 });

    return new Response(JSON.stringify({ plan: plano, status: 'generated' }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
