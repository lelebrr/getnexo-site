
// JetNexo Neuro-Pricing
// "We know when you hesitate."
// Detects micro-movements indicating anxiety and deploys a counter-measure (Discount).

class NeuroPricing {
    constructor() {
        this.history = [];
        this.threshold = 50; // Jitter threshold
        this.triggered = false;
        this.init();
    }

    init() {
        console.log("🧠 [Neuro] Monitoring cursor anxiety...");
        document.addEventListener('mousemove', (e) => this.track(e));
    }

    track(e) {
        if (this.triggered) return;

        const now = Date.now();
        this.history.push({ x: e.clientX, y: e.clientY, t: now });

        // Keep last 1s
        this.history = this.history.filter(h => now - h.t < 1000);

        if (this.history.length > 20) {
            this.analyze();
        }
    }

    analyze() {
        // Calculate jitter (erratic movement in small area)
        let dist = 0;
        let areaX = { min: 9999, max: 0 };
        let areaY = { min: 9999, max: 0 };

        for (let i = 1; i < this.history.length; i++) {
            const p1 = this.history[i - 1];
            const p2 = this.history[i];
            dist += Math.hypot(p2.x - p1.x, p2.y - p1.y);

            areaX.min = Math.min(areaX.min, p2.x);
            areaX.max = Math.max(areaX.max, p2.x);
            areaY.min = Math.min(areaY.min, p2.y);
            areaY.max = Math.max(areaY.max, p2.y);
        }

        const width = areaX.max - areaX.min;
        const height = areaY.max - areaY.min;

        // High distance but small area = Nervous Jitter / Hesitation
        if (dist > 500 && width < 200 && height < 200) {
            this.triggerDiscount();
        }
    }

    triggerDiscount() {
        this.triggered = true;
        console.log("🧠 [Neuro] ANXIETY DETECTED. Deploying Dopamine Hit.");

        // Inject Flash Sale
        const promo = document.createElement('div');
        promo.className = 'fixed bottom-10 right-10 bg-red-600 text-white p-6 rounded-xl shadow-2xl animate-bounce z-50 font-bold';
        promo.innerHTML = `
            <p class="text-sm uppercase">Hesitating?</p>
            <p class="text-2xl">TAKE 10% OFF</p>
            <p class="text-xs mt-1">Code: DECIDE_NOW</p>
        `;
        document.body.appendChild(promo);

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    new NeuroPricing();
}
