window.addEventListener("load", () => {
    // --- AUDIO ENGINE ---
    const clickSound = new Audio('click2.m4a');
    clickSound.volume = 0.15;
    let soundEnabled = false;

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.onclick = function() {
            soundEnabled = !this.classList.toggle('is-active');
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                clickSound.play().then(() => { clickSound.pause(); clickSound.currentTime = 0; }).catch(() => {});
            }
        };
    }

    function playClick() {
        if (!soundEnabled) return;
        const s = clickSound.cloneNode();
        s.volume = 0.1;
        s.play().catch(() => {});
    }

    // --- MECHANICAL FLAP ENGINE ---
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    const config = [
        { id: 'tick-technical', target: "TECHNICAL", len: 10 },
        { id: 'tick-research', target: "RESEARCH", len: 8 },
        { id: 'tick-operations', target: "OPERATIONS", len: 10 }
    ];

    // Initialize controllers with instances
    const controllers = config.map(item => {
        const el = document.getElementById(item.id);
        if (!el) return null;
        return { 
            ...item, 
            instance: Tick.DOM.create(el), 
            currentArr: " ".repeat(item.len).split("") 
        };
    }).filter(x => x !== null);

    function rotateTo(controller, targetWord) {
        // FAILSAFE: Ensure the instance exists before proceeding
        if (!controller.instance) return;

        const targetChars = targetWord.padEnd(controller.len, " ").toUpperCase().split("");
        
        targetChars.forEach((targetChar, i) => {
            if (i >= controller.len) return;

            setTimeout(() => {
                const runner = setInterval(() => {
                    let currentChar = controller.currentArr[i];
                    let currIdx = charSet.indexOf(currentChar);

                    if (currentChar === targetChar) {
                        clearInterval(runner);
                        return;
                    }

                    let nextIdx = (currIdx + 1) % charSet.length;
                    controller.currentArr[i] = charSet[nextIdx];
                    
                    // ULTIMATE FAILSAFE check inside the interval
                    if (controller.instance && typeof controller.instance.value !== 'undefined') {
                        controller.instance.value = controller.currentArr.join("");
                        playClick();
                    }
                }, 40); 
            }, i * 100); 
        });
    }

    // Initial load flip with a generous delay to ensure library is fully hooked
    setTimeout(() => {
        controllers.forEach(c => rotateTo(c, c.target));
    }, 1000);

    // Continuous loop for Research row
    setInterval(() => {
        const wordIndex = (Math.floor(Date.now() / 8000) % researchWords.length);
        const resLine = controllers.find(c => c.id === 'tick-research');
        if (resLine) rotateTo(resLine, researchWords[wordIndex]);
    }, 8000);

    // --- WAVE CANVAS ---
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
        const step = (width + (width * 0.4) * 2) / 300;
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = '#8D99AE'; 
        ctx.globalAlpha = 0.04;
        for (let i = 0; i <= 300; i++) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 20) {
                let xBase = (i * step) - (width * 0.4);
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

    // --- CLOCK & GSAP ---
    function updateClock() {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        const ptTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(new Date());
        clock.innerText = `PT ${ptTime}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
