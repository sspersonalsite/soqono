window.addEventListener("load", () => {
    // --- AUDIO ENGINE ---
    const clickSound = new Audio('click2.m4a');
    clickSound.volume = 0.15;
    let soundEnabled = false;

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.onclick = function() {
            soundEnabled = !this.classList.toggle('is-active');
            if (soundEnabled) {
                clickSound.play().then(() => { 
                    clickSound.pause(); 
                    clickSound.currentTime = 0; 
                }).catch(() => {});
            }
        };
    }

    const playClick = () => { 
        if (soundEnabled) { 
            const s = clickSound.cloneNode(); 
            s.volume = 0.1; 
            s.play().catch(() => {}); 
        } 
    };

    // --- MECHANICAL FLAP ENGINE ---
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    // Explicitly initialize Tick instances and manage them in an array
    const controllers = [
        { id: 'tick-technical', word: 'TECHNICAL', len: 12 },
        { id: 'tick-research', word: 'RESEARCH', len: 12 },
        { id: 'tick-operations', word: 'OPERATIONS', len: 12 }
    ].map(config => {
        const el = document.getElementById(config.id);
        if (!el) return null;
        return {
            ...config,
            instance: Tick.DOM.create(el),
            current: " ".repeat(config.len).split("")
        };
    }).filter(x => x !== null);

    function rotateTo(controller, targetWord) {
        // Defensive check: is the instance initialized and reachable?
        if (!controller || !controller.instance || typeof controller.instance.value === 'undefined') return;

        const targetChars = targetWord.padEnd(controller.len, " ").toUpperCase().split("");
        
        targetChars.forEach((char, i) => {
            if (i >= controller.len) return;

            setTimeout(() => {
                const runner = setInterval(() => {
                    let currIdx = charSet.indexOf(controller.current[i]);
                    if (controller.current[i] === char) return clearInterval(runner);

                    controller.current[i] = charSet[(currIdx + 1) % charSet.length];
                    
                    // Final defensive verification before updating DOM
                    if (controller.instance && typeof controller.instance.value !== 'undefined') {
                        controller.instance.value = controller.current.join("");
                        playClick();
                    }
                }, 40);
            }, i * 110);
        });
    }

    // Delay start to allow the library to finalize DOM state
    setTimeout(() => {
        controllers.forEach(c => rotateTo(c, c.word));
    }, 1500);

    // Continuous loop for Research row
    setInterval(() => {
        const idx = Math.floor(Date.now() / 8000) % researchWords.length;
        const resLine = controllers.find(c => c.id === 'tick-research');
        if (resLine) rotateTo(resLine, researchWords[idx]);
    }, 8000);

    // --- WAVE CANVAS ---
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let width, height, time = 0;

    const resize = () => { 
        width = canvas.width = window.innerWidth; 
        height = canvas.height = window.innerHeight; 
    };
    window.addEventListener('resize', resize);
    resize();

    function render() {
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1.0; ctx.strokeStyle = '#8D99AE'; ctx.globalAlpha = 0.04;
        const margin = width * 0.4;
        const step = (width + margin * 2) / 300;
        for (let i = 0; i <= 300; i++) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 20) {
                let xBase = (i * step) - margin;
                let x = xBase + simplex.noise3D(xBase * 0.0008, y * 0.0006, time * 0.005) * 500;
                if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        time += 1; requestAnimationFrame(render);
    }
    render();

    // --- CLOCK & GSAP ---
    const updateClock = () => {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        clock.innerText = `PT ${new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(new Date())}`;
    };
    setInterval(updateClock, 1000); updateClock();

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
