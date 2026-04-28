window.addEventListener("load", () => {
    // --- 1. VERTICAL FLOWING WAVES (Right to Left) ---
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
        
        const lineCount = 60; 
        const step = width / lineCount;
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#426A5A';
        ctx.globalAlpha = 0.15;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            // Start the x position based on step + a time-based offset for "flow"
            let xBase = (i * step - (time * 1.5)) % width;
            if (xBase < 0) xBase += width; // Wrap around to stay right-to-left

            for (let y = 0; y <= height; y += 15) {
                // Vertical wave noise
                let noise = simplex.noise3D(xBase * 0.002, y * 0.002, time * 0.002) * 40;
                
                // Mouse gravity interaction
                let dx = xBase - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (300 - dist) / 300);
                
                let x = xBase + noise + (dx * mag * 0.5);

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

    // --- 3. TERMINAL SCRAMBLE ---
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
        }, 30);
    }
    setInterval(scrambleText, 3000);
});
