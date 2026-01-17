// Neuro-Pricing: The Sales Closer
// Detects hesitation (jitter/velocity drop) and offers discounts.

(function () {
    let mouseHistory = [];
    let lastTime = Date.now();
    const HESITATION_THRESHOLD = 2000; // ms
    let hasOfferedDiscount = false;

    // Monitor Mouse
    document.addEventListener('mousemove', (e) => {
        if (hasOfferedDiscount) return;

        const now = Date.now();
        const velocity = Math.hypot(e.movementX, e.movementY) / (now - lastTime);
        lastTime = now;

        // Check for "Jitter" (High frequency low movement - Anxiety/Confusion)
        // Check for Exit Intent (Fast move to top bar)
        if (e.clientY < 10) {
            triggerExitIntent();
        }
    });

    // Exit Intent Handler
    function triggerExitIntent() {
        if (hasOfferedDiscount) return;
        hasOfferedDiscount = true;

        console.log("🧠 Neuro-Engine: Exit Intent Detected. Triggering Dark Modal.");

        // Simulating Modal Injection
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;">
                <div style="background:#111;border:2px solid #ff0033;padding:2rem;text-align:center;color:white;font-family:'JetBrains Mono';max-width:500px;">
                    <h1 style="color:#ff0033">⚠️ ESPERE. NÃO VÁ.</h1>
                    <p>A Kira autorizou uma oferta única.</p>
                    <h2 style="font-size:3rem;color:#00ff00;margin:1rem 0;">-20% OFF</h2>
                    <p style="color:#888">Cupom: <strong>NEURO20</strong> (Expira em 2 min)</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="background:#ff0033;color:white;border:none;padding:1rem 2rem;margin-top:1rem;cursor:pointer;font-weight:bold;">PEGAR OFERTA</button>
                    <button onclick="this.parentElement.parentElement.remove()" style="background:transparent;color:#666;border:none;padding:1rem;margin-top:0.5rem;cursor:pointer;">Ignorar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Haptic Feedback
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    console.log("🧠 Neuro-Pricing loaded. Waiting for anxiety signals...");
})();
