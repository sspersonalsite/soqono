window.addEventListener("load", () => {
    // --- 1. WAVE CANVAS ENGINE ---
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

    // --- 2. MECHANICAL SPLIT FLAP LOGIC ---
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    // Configuration for the 3 rows
    const rows = [
        { id: 'tick-technical', target: "TECHNICAL", len: 10, loop: false },
        { id: 'tick-research', target: "RESEARCH", len: 8, loop: true },
        { id: 'tick-operations', target: "OPERATIONS", len: 10, loop: false }
    ];

    const controllers = rows.map(config => {
        const el = document.getElementById(config.id);
        const instance = Tick.DOM.create(el, { value: " ".repeat(config.len) });
        return { ...config, instance, current: " ".repeat(config.len).split("") };
    });

    function flipTo(controller, targetWord) {
        const paddedTarget = targetWord.padEnd(controller.len, " ").toUpperCase();
        const targetChars = paddedTarget.split("");

        targetChars.forEach((char, i) => {
            setTimeout(() => {
                const runner = setInterval(() => {
                    let curr = controller.current[i];
                    let currIdx = charSet.indexOf(curr);
                    let targetIdx = charSet.indexOf(char);

                    if (curr === char) {
                        clearInterval(runner);
                        return;
                    }

                    let nextIdx = (currIdx + 1) % charSet.length;
                    controller.current[i] = charSet[nextIdx];
                    controller.instance.value = controller.current.join("");
                }, 50); // Speed of flap
            }, i * 80); // Stagger letters
        });
    }

    // Initial Load Flip
    controllers.forEach(c => {
        setTimeout(() => flipTo(c, c.target), 600);
    });

    // Research Row Loop
    let wordIndex = 0;
    setInterval(() => {
        wordIndex = (wordIndex + 1) % researchWords.length;
        const resController = controllers.find(c => c.id === 'tick-research');
        flipTo(resController, researchWords[wordIndex]);
    }, 6000);

    // --- 3. UI EXTRAS (Clock & Blobs) ---
    function updateClock() {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        const now = new Date();
        const options = { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const ptTime = new Intl.DateTimeFormat('en-US', options).format(now);
        clock.innerText = `PT ${ptTime}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
