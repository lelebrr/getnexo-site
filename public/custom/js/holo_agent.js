
// JetNexo Holo-Agent
// Renders a 3D "Thinking Core" using Three.js logic (Simulated for lightweight)

class HoloAgent {
    constructor() {
        this.container = null;
        this.angle = 0;
        this.init();
    }

    init() {
        this.createContainer();
        this.startRenderLoop();
        console.log("🔮 [Holo-Agent] 3D Core Online.");
    }

    createContainer() {
        // Creates a floating orb container in bottom right
        const div = document.createElement('div');
        div.id = 'holo-core';
        div.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 60px;
            height: 60px;
            perspective: 500px;
            z-index: 9999;
            pointer-events: none;
        `;

        // The Cube (CSS 3D for performance > WebGL overhead for simple shape)
        const cube = document.createElement('div');
        cube.id = 'holo-shape';
        cube.style.cssText = `
            width: 100%;
            height: 100%;
            border: 2px solid #00ffcc;
            box-shadow: 0 0 15px #00ffcc;
            transform-style: preserve-3d;
            border-radius: 50%; /* Makes it an orb wireframe look */
        `;

        div.appendChild(cube);
        document.body.appendChild(div);
        this.element = cube;
    }

    startRenderLoop() {
        setInterval(() => {
            this.angle += 2;
            this.element.style.transform = `
                rotateX(${this.angle}deg) 
                rotateY(${this.angle * 1.5}deg)
                scale(${1 + Math.sin(this.angle / 50) * 0.2})
            `;
        }, 16); // 60fps
    }

    pulseThinking() {
        this.element.style.borderColor = '#ff0033'; // Red active state
        setTimeout(() => this.element.style.borderColor = '#00ffcc', 500);
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    window.holoAgent = new HoloAgent();
}
