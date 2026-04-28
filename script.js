window.addEventListener("load", () => {
    // --- 1. "SILK FABRIC" WAVE ENGINE ---
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
        
        const lineCount = 110; 
        const step = width / lineCount;
        
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#426A5A';
        ctx.globalAlpha = 0.14;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            let xAnchor = i * step;

            for (let y = 0; y <= height; y += 15) {
                // FABRIC PHYSICS:
                // We use low-frequency noise for massive "folds" (silk)
                // We scroll the noise horizontally (time * 0.0015) to simulate wind.
                let wave1 = simplex.noise3D(xAnchor * 0.0006, y * 0.0006, time * 0.0012) * 85;
                let wave2 = simplex.noise3D(xAnchor * 0.0015, y * 0.0015, time * 0.002) * 20; 
                
                let totalNoise = wave1 + wave2;

                // Mouse Gravity interaction
                let dx = xAnchor - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (350 - dist) / 350);
                
                let x = xAnchor + totalNoise + (dx * mag * 0.55);

                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- 2. TERMINAL SCRAMBLE ---
    const words = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
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
