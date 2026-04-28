window.addEventListener("load", () => {
    // --- 1. LARGE-SCALE INDEPENDENT VERTICAL WAVES ---
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
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    resize();

    let time = 0;
    function render() {
        ctx.clearRect(0, 0, width, height);
        
        const lineCount = 100; 
        const step = width / lineCount;
        
        ctx.lineWidth = 1.8; // THICKER LINES as requested
        ctx.strokeStyle = '#426A5A';
        ctx.globalAlpha = 0.12;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            
            // Right-to-Left Flow
            let xBase = (i * step - (time * 1.5)) % width;
            if (xBase < 0) xBase += width;

            for (let y = 0; y <= height; y += 15) {
                // MODIFICATION: Large-scale independent noise
                // Reducing the frequency (0.001) makes the curves much larger/wider
                // Adding unique offsets to noise3D ensures different parts of line drift independently
                let noise = simplex.noise3D(xBase * 0.001, y * 0.001, time * 0.002) * 65;
                
                let dx = xBase - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (350 - dist) / 350);
                
                let x = xBase + noise + (dx * mag * 0.6);

                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- 2. BG BLOBS ---
    gsap.to(".blob-1", { x: "10vw", y: "5vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-5vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // --- 3. TERMINAL SCRAMBLE (Modified for single phrase) ---
    const target = document.getElementById("scramble-target");
    const finalPhrase = "GLOBAL_PARTNER // NEXT_GEN_TECH";
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    function scrambleText() {
        let iteration = 0;
        const interval = setInterval(() => {
            target.innerText = finalPhrase.split("").map((letter, index) => {
                if (index < iteration) return finalPhrase[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            if (iteration >= finalPhrase.length) clearInterval(interval);
            iteration += 1 / 2;
        }, 40);
    }
    
    // Initial scramble on load
    scrambleText();
    // Re-scramble every 10 seconds just for visual interest
    setInterval(scrambleText, 10000);
});
