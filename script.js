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
    
    // High line count for dense overlap
    const lineCount = 300; 
    const margin = width * 0.4; // Large margin to ensure no empty edges
    const step = (width + margin * 2) / lineCount;
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = '#8D99AE'; 
    ctx.globalAlpha = 0.04; // Very faint lines to allow for many layers of overlap

    for (let i = 0; i <= lineCount; i++) {
        ctx.beginPath();
        
        for (let y = 0; y <= height; y += 20) {
            let xBase = (i * step) - margin;

            // Removing the anchor: Noise now dictates the primary horizontal flow
            // The 'i * 0.5' creates a unique offset for every single line
            let noise = simplex.noise3D(
                xBase * 0.0008, 
                y * 0.0006, 
                time * 0.005 // Fast, fluid speed
            ) * 500; // High amplitude for deep sweeping movement

            let x = xBase + noise;

            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    time += 1; 
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

    function updateClock() {
    const clock = document.getElementById('local-clock');
    if (!clock) return;

    const now = new Date();
    
    // Formatting for California (Pacific Time)
    const options = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Set to true if you prefer 12-hour format
    };

    const ptTime = new Intl.DateTimeFormat('en-US', options).format(now);
    
    clock.innerText = `PT ${ptTime}`;
}
    // Initialize
    setInterval(updateClock, 1000);
    updateClock();

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
