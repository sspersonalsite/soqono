window.addEventListener("load", () => {
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
        
        const lineCount = 100; 
        const step = width / lineCount;
        
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = '#8D99AE'; 
        ctx.globalAlpha = 0.12;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            let xAnchor = i * step;

            for (let y = 0; y <= height; y += 12) {
                let distanceToEdge = Math.min(y, height - y);
                let edgeTaper = Math.min(1, distanceToEdge / (height * 0.25));
                
                let noise = simplex.noise3D(xAnchor * 0.001, y * 0.0012, time * 0.0015) * 55;
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

    const words = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    let wordIndex = 0;
    const target = document.getElementById("scramble-target");
    const chars = "0123456789<>-_\\/[]{}—=+*^?#";

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

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
