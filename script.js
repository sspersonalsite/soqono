window.addEventListener("load", () => {
    // --- 1. TRUE ISIDOR.AI WAVE ENGINE ---
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    function render() {
        ctx.clearRect(0, 0, width, height);
        
        const lineCount = 90; 
        const step = width / lineCount;
        
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#426A5A'; // Strictly palette Dark Green
        ctx.globalAlpha = 0.15;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            let xAnchor = i * step;

            for (let y = 0; y <= height; y += 10) {
                // Isidor Logic: The vertical distortion is strongest in the center (y) 
                // and tapers off toward the top and bottom edges (0 and height).
                let distanceToEdge = Math.min(y, height - y);
                let edgeTaper = Math.min(1, distanceToEdge / (height * 0.3));
                
                // Low-frequency noise for the "billow"
                let noise = simplex.noise3D(xAnchor * 0.001, y * 0.001, time * 0.002) * 50;
                
                // Apply the taper so lines are straighter at header/footer
                let x = xAnchor + (noise * edgeTaper);

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
