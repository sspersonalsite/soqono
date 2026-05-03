window.addEventListener("load", () => {
    // --- 1. AUDIO ENGINE ---
    // Ensure 'click2.m4a' is in your root folder
    const clickSound = new Audio('click2.m4a');
    clickSound.volume = 0.15;
    let soundEnabled = false;

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.onclick = function() {
            soundEnabled = !this.classList.toggle('is-active');
            soundEnabled = !soundEnabled; // Toggle boolean
            if (soundEnabled) {
                // Unlock audio context on user gesture
                clickSound.play().then(() => { 
                    clickSound.pause(); 
                    clickSound.currentTime = 0; 
                }).catch(e => console.log("Audio unlock failed", e));
            }
        };
    }

    function playClick() {
        if (!soundEnabled) return;
        const s = clickSound.cloneNode();
        s.volume = 0.15;
        s.play().catch(() => {});
    }

    // --- 2. SPLIT FLAP ENGINE ---
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    const config = [
        { id: 'tick-technical', target: "TECHNICAL", len: 10, loop: false },
        { id: 'tick-research', target: "RESEARCH", len: 8, loop: true },
        { id: 'tick-operations', target: "OPERATIONS", len: 10, loop: false }
    ];

    const controllers = config.map(item => {
        const el = document.getElementById(item.id);
        if (!el) return null;
        const instance = Tick.DOM.create(el, { value: " ".repeat(item.len) });
        return { 
            ...item, 
            instance, 
            currentArr: " ".repeat(item.len).split("") 
        };
    }).filter(x => x !== null);

    function rotateTile(controller, targetWord) {
        const targetChars = targetWord.padEnd(controller.len, " ").toUpperCase().split("");
        
        targetChars.forEach((targetChar, i) => {
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
                    controller.instance.value = controller.currentArr.join("");
                    playClick();
                }, 60); // Flip speed
            }, i * 120); // Stagger letters
        });
    }

    // Initial Trigger
    controllers.forEach(c => setTimeout(() => rotateTile(c, c.target), 500));

    // Continuous Loop for Research
    let researchIdx = 0;
    setInterval(() => {
        researchIdx = (researchIdx + 1) % researchWords.length;
        const researchRow = controllers.find(c => c.id === 'tick-research');
        if (researchRow) rotateTile(researchRow, researchWords[researchIdx]);
    }, 8000);

    // --- 3. WAVE & UI ---
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

    function updateClock() {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        const now = new Date();
        const ptTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(now);
        clock.innerText = `PT ${ptTime}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    gsap.to(".blob-1", { x: "8vw", y: "4vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-8vw", y: "-4vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
});
