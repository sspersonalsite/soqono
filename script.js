window.addEventListener("load", () => {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let scanY = 0; // Position of the scanning bar

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
        
        const lineCount = 80;
        const step = width / lineCount;
        
        // 1. UPDATE SCANNER POSITION
        scanY += 2.5; // Speed of the scan
        if (scanY > height) scanY = -50; // Reset scanner to top

        // 2. DRAW VERTICAL INFRASTRUCTURE
        for (let i = 0; i <= lineCount; i++) {
            let xBase = i * step;
            
            ctx.beginPath();
            ctx.setLineDash([2, 5]); // Technical dotted look
            ctx.strokeStyle = '#426A5A';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.15;

            for (let y = 0; y <= height; y += 20) {
                // Subtle organic wave
                let noise = simplex.noise3D(xBase * 0.002, y * 0.002, time * 0.003) * 30;
                
                // Mouse Interaction (Push)
                let dx = xBase - mouse.x;
                let dy = y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (250 - dist) / 250);
                
                let x = xBase + noise + (dx * mag * 0.4);

                // Check intersection with scanner line
                let isScanning = Math.abs(y - scanY) < 15;

                if (y === 0) ctx.moveTo(x, y);
                else {
                    // Highlight the line if the scanner is passing over it
                    if (isScanning && Math.random() > 0.5) {
                        ctx.save();
                        ctx.globalAlpha = 0.8;
                        ctx.strokeStyle = '#EF6F6C'; // Coral highlight
                        ctx.stroke();
                        ctx.restore();
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }
            ctx.stroke();
        }

        // 3. DRAW THE HORIZONTAL SCANNER BAR
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.strokeStyle = '#EF6F6C';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        ctx.stroke();

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- RE-INTEGRATE STABLE LOGIC ---
    gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "5vw", y: "10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.clientHeight;
        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                if (currentIndex >= document.querySelectorAll(".rotate").length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }
    setInterval(rotate, 3000);
});
