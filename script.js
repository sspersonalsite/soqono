window.addEventListener("load", () => {
    // --- 1. "FABRIC IN THE WIND" WAVE ENGINE ---
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let width, height;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    resize();

    let time = 0;
    function render() {
        ctx.clearRect(0, 0, width, height);
        
        // Use a grid of 110 lines for the "Fabric" feel
        const lineCount = 110; 
        const step = width / lineCount;
        
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = '#426A5A';
        ctx.globalAlpha = 0.14;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            let xGrid = i * step;

            for (let y = 0; y <= height; y += 15) {
                // WIND LOGIC:
                // noise3D(x, y, time) creates a continuous field.
                // Low frequency (0.0005) makes the folds massive and soft like silk.
                // Multiplying 'time' by 0.0015 makes the "wind" blow steadily.
                let wave1 = simplex.noise3D(xGrid * 0.0005, y * 0.0006, time * 0.0015) * 80;
                let wave2 = simplex.noise3D(xGrid * 0.001, y * 0.001, time * 0.002) * 20; // Subtle micro-folds
                
                let totalNoise = wave1 + wave2;

                // Mouse interaction (Fabric being pushed)
                let dx = xGrid - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (400 - dist) / 400);
                
                // Final position: Grid + Noise + Mouse Displacement
                let x = xGrid + totalNoise + (dx * mag * 0.6);

                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- 2. TERMINAL SCRAMBLE ROTATION ---
    const words = ["RESEARCH", "DATA", "BUSINESS", "PROGRAM", "STRATEGY", "PRODUCT"];
    let wordIndex = 0;
    const target = document.getElementById("scramble-target");
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    function scrambleText() {
        wordIndex = (wordIndex + 1) % words.length;
        const finalWord = words[wordIndex];
        let iteration = 0;
        
        const interval = setInterval(() => {
            target.innerText = finalWord.split("").map((letter, index) => {
                if (index < iteration) return finalWord[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            if (iteration >= finalWord.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 35);
    }
    setInterval(scrambleText, 3500);

    // --- 3. BG BLOBS ---
    gsap.to(".blob-1", { x: "10vw", y: "5vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-5vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
