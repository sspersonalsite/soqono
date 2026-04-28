window.addEventListener("load", () => {
    // --- 1. ELEGANT HORIZONTAL FLOWING WAVES ---
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
        
        const lineCount = 40; 
        const step = height / lineCount;
        
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#426A5A';
        ctx.globalAlpha = 0.18;

        for (let i = 0; i < lineCount; i++) {
            ctx.beginPath();
            let yBase = i * step;

            for (let x = 0; x <= width; x += 20) {
                // Smooth Horizontal Flow
                // x*0.001 and time*0.0015 control the "length" and "speed" of the waves
                let noise = simplex.noise3D(x * 0.001, yBase * 0.002, time * 0.0015) * 60;
                
                // Elegant Mouse Interaction
                let dx = x - mouse.x;
                let dy = yBase - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let mag = Math.max(0, (350 - dist) / 350);
                
                let y = yBase + noise + (dy * mag * 0.6);

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- 2. BG BLOBS ---
    gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "5vw", y: "10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

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
