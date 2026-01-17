// widget.js - GetNexo Widget (roda no site do cliente)
(function () {
    // Evita duplicação
    if (window.getNexoWidget) return;
    window.getNexoWidget = true;

    // Carrega o core/backend (ajustado para localhost para teste)
    const script = document.createElement('script');
    script.src = 'http://localhost:8080/widget-core.js';  // original: https://getnexo.com.br/core/widget-core.js
    script.async = true;
    document.head.appendChild(script);

    // Configuração via data-bot
    const curScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    const config = {
        botId: curScript.dataset.bot || 'demo',
        theme: curScript.dataset.theme || 'dark'
    };

    // API do e-commerce (ex: Woo, Shopify, custom)
    const ecommerceApi = {
        // Pega produtos do site
        getProducts: async () => {
            // Exemplo: puxa de /api/products do site
            return fetch('/api/products').then(r => r.json()).catch(() => [
                { name: 'Produto Demo 1', price: 99.90 },
                { name: 'Produto Demo 2', price: 149.90 }
            ]);
        },
        // Cria pedido
        createOrder: async (order) => {
            return fetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify(order),
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.json());
        },
        // Verifica carrinho abandonado
        getAbandoned: async () => fetch('/api/abandoned').then(r => r.json())
    };

    // Injeta botão flutuante
    const btn = document.createElement('button');
    btn.id = 'getnexo-chat-btn';
    btn.innerHTML = '💬';
    btn.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    background:#00ff9d; border:none; border-radius:50px;
    width:60px; height:60px; font-size:24px; cursor:pointer;
    box-shadow:0 0 15px rgba(0,255,157,0.7);
    z-index:9999;
    transition:transform 0.2s;
  `;
    btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';
    document.body.appendChild(btn);

    // Injeta janela de chat (escondida)
    const chatWin = document.createElement('div');
    chatWin.id = 'getnexo-chat';
    chatWin.style.cssText = `
    display:none; position:fixed; bottom:90px; right:20px; width:320px; height:500px;
    background:rgba(10,14,23,0.95); border:1px solid #00ff9d55; border-radius:16px;
    color:#e5e7eb; padding:1rem; font-family:Inter, sans-serif;
    box-shadow:0 0 30px rgba(0,255,157,0.3);
    z-index:9998; overflow:hidden;
  `;
    chatWin.innerHTML = `
    <header style="display:flex; justify-content:space-between; color:#00ff9d; margin-bottom:10px; font-weight:bold;">
      <span>💬 Chat GetNexo</span>
      <span onclick="document.getElementById('getnexo-chat').style.display='none'" style="cursor:pointer;">&times;</span>
    </header>
    <div id="chat-body" style="height:calc(100% - 60px); overflow-y:auto; padding:1rem 0; font-size:14px;"></div>
    <input id="chat-input" placeholder="Digite aqui..." style="width:100%; padding:0.8rem; background:#1e293b; border:none; border-radius:8px; color:white; outline:none;" />
  `;
    document.body.appendChild(chatWin);

    // Ao clicar no botão, abre
    btn.onclick = () => {
        chatWin.style.display = 'block';
    };

    // Simula conversa inicial
    const chat = chatWin.querySelector('#chat-body');
    chat.innerHTML = `<p style="color:#00d4ff;">Olá! Em que posso te ajudar hoje?</p>`;

    // Envia mensagem
    chatWin.querySelector('#chat-input').addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const msg = e.target.value;
            if (!msg.trim()) return;
            chat.innerHTML += `<p style="text-align:right; color:white;"><strong>Você:</strong> ${msg}</p>`;
            e.target.value = '';

            // Feedback visual
            const loadingId = Date.now();
            chat.innerHTML += `<p id="${loadingId}" style="color:#aaa;"><em>Digitando...</em></p>`;
            chat.scrollTop = chat.scrollHeight;

            setTimeout(async () => {
                document.getElementById(loadingId).remove();

                if (msg.toLowerCase().includes('produto')) {
                    const produtos = await ecommerceApi.getProducts();
                    chat.innerHTML += `<p style="color:#00ff9d;"><strong>Bot:</strong> Olha o que temos:<br>${produtos.map(p => `- ${p.name}: R$${p.price}`).join('<br>')}</p>`;
                } else {
                    chat.innerHTML += `<p style="color:#00ff9d;"><strong>Bot:</strong> Recebi sua mensagem: "${msg}". Em breve um humano responde!</p>`;
                }
                chat.scrollTop = chat.scrollHeight;
            }, 1000);
        }
    });
})();
