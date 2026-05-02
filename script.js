window.addEventListener("load", () => {
    // 1. WAVE CANVAS ENGINE
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

    // 2. MECHANICAL DISPLAY (FLIP BOARD)
    const words = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    let wordIndex = 0;

    // Load the audio
    const clickSound = new Audio('click.mp3');
    clickSound.volume = 0.1;

    // Setup the Tick Flip Instance
    const board = Tick.DOM.create(document.getElementById('flip-board'), {
        value: words[0]
    });

    // Sound engine for the "rat-tat-tat" effect
    function playMechanicalClatter(duration) {
        const interval = 75; // speed of each click in ms
        let elapsed = 0;
        const loop = setInterval(() => {
            clickSound.cloneNode().play();
            elapsed += interval;
            if (elapsed >= duration) clearInterval(loop);
        }, interval);
    }

    function rotateWords() {
        wordIndex = (wordIndex + 1) % words.length;
        const nextWord = words[wordIndex];
        
        // Update the visual board
        board.value = nextWord;
        
        // Trigger sound effect for roughly 1 second during transition
        playMechanicalClatter(1000);
    }

    // Interval to change words
    setInterval(rotateWords, 3500);

    // 3. UTILITIES (CLOCK & BLOBS)
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
