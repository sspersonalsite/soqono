window.addEventListener("load", () => {
    // --- 1. CANVAS HUD SCANNER ---
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let scanY = 0;

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
        const lineCount = 85;
        const step = width / lineCount;
        scanY += 2.0; // Slightly slower scan for cleaner feel
        if (scanY > height) scanY = -50;

        for (let i = 0; i <= lineCount; i++) {
            let xBase = i * step;
            ctx.beginPath();
            ctx.setLineDash([2, 5]);
            ctx.strokeStyle = '#426A5A';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.15;

            for (let y = 0; y <= height; y += 20) {
                let noise = simplex.noise3D(xBase * 0.002, y * 0.002, time * 0.003) * 30;
                let dx = xBase - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (250 - dist) / 250);
                let x = xBase + noise + (dx * mag * 0.4);
                let isScanning = Math.abs(y - scanY) < 15;

                if (y === 0) ctx.moveTo(x, y);
                else {
                    if (isScanning && Math.random() > 0.4) {
                        ctx.save();
                        ctx.globalAlpha = 0.7;
                        ctx.strokeStyle = '#EF6F6C';
                        ctx.stroke();
                        ctx.restore();
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                    } else { ctx.lineTo(x, y); }
                }
            }
            ctx.stroke();
        }

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(0, scanY); ctx.lineTo(width, scanY);
        ctx.strokeStyle = '#EF6F6C'; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.2;
        ctx.stroke();

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- 2. COLOR BLOB DRIFT ---
    gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "5vw", y: "10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // --- 3. TERMINAL SCRAMBLE SYSTEM ---
    const words = ["RESEARCH", "DATA", "BUSINESS", "PROGRAM", "STRATEGY", "PRODUCT"];
    let wordIndex = 0;
    const target = document.getElementById("scramble-target");
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    function scrambleText() {
        wordIndex = (wordIndex + 1) % words.length;
        const finalWord = words[wordIndex];
        let iteration = 0;
        
        const interval = setInterval(() => {
            target.innerText = finalWord
                .split("")
                .map((letter, index) => {
                    if (index < iteration) return finalWord[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iteration >= finalWord.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    }
    setInterval(scrambleText, 3000);
});
