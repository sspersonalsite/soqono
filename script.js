window.addEventListener("load", () => {
    // --- 1. GENERATIVE WAVE SYSTEM ---
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
    resize();

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    let time = 0;
    function renderWaves() {
        ctx.clearRect(0, 0, width, height);
        const lineCount = 70; 
        const step = width / lineCount;
        
        ctx.strokeStyle = '#426A5A'; // Lines match your text color
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            let xBase = i * step;

            for (let y = 0; y <= height; y += 15) {
                // Organic flow
                let noise = simplex.noise3D(xBase * 0.003, y * 0.003, time * 0.004) * 35;
                
                // Mouse Interaction (Push effect)
                let dx = xBase - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (250 - dist) / 250);
                
                let x = xBase + noise + (dx * mag * 0.4);

                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        time++;
        requestAnimationFrame(renderWaves);
    }
    renderWaves();

    // --- 2. BACKGROUND BLOB DRIFT ---
    gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "5vw", y: "10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // --- 3. MAGNETIC HOVER ---
    const items = document.querySelectorAll(".industry-item");
    items.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
            gsap.to(item, { x: x, y: y, duration: 0.3 });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    });

    // --- 4. TEXT ROTATION ---
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.clientHeight;

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }
    setInterval(rotate, 3000);
});
