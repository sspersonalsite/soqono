window.addEventListener("load", () => {
    // --- WAVE CANVAS ENGINE ---
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
        const lineCount = 300; 
        const margin = width * 0.4;
        const step = (width + margin * 2) / lineCount;
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = '#8D99AE'; 
        ctx.globalAlpha = 0.04;

        for (let i = 0; i <= lineCount; i++) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 20) {
                let xBase = (i * step) - margin;
                let noise = simplex.noise3D(xBase * 0.0008, y * 0.0006, time * 0.005) * 500;
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

    // --- MECHANICAL DISPLAY LOGIC ---
    const words = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    let wordIndex = 0;
    
    // Initialize Tick
    const target = document.getElementById("scramble-target");
    const tickInstance = Tick.DOM.create(target, {
        value: words[0]
    });

    // Sound Engine
    const clickSound = new Audio('click.mp3');
    clickSound.volume = 0.1;

    function playFastClicks(duration) {
        const interval = 70; // High speed for "rat-tat-tat" effect
        let elapsed = 0;
        const loop = setInterval(() => {
            clickSound.cloneNode().play();
            elapsed += interval;
            if (elapsed >= duration) clearInterval(loop);
        }, interval);
    }

    function updateBoard() {
        wordIndex = (wordIndex + 1) % words.length;
        tickInstance.value = words[wordIndex];
        playFastClicks(900); // Plays clicks for roughly the duration of the flip
    }
    
    setInterval(updateBoard, 3500);

    // --- UTILITIES (CLOCK & BLOBS) ---
    function updateClock() {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        const options = { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        clock.innerText = `PT ${new Intl.DateTimeFormat('en-US', options).format(new Date())}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
