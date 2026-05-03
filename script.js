window.addEventListener("load", () => {
    // --- AUDIO ---
    const clickSound = new Audio('click2.m4a');
    let soundEnabled = false;
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.onclick = function() {
            soundEnabled = !this.classList.toggle('is-active');
            soundEnabled = !soundEnabled;
            if (soundEnabled) { clickSound.play().then(() => { clickSound.pause(); }); }
        };
    }
    const playClick = () => { if (soundEnabled) { const s = clickSound.cloneNode(); s.volume = 0.1; s.play(); } };

    // --- FLAP ENGINE ---
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    const config = [
        { id: 'tick-technical', word: 'TECHNICAL', len: 10 },
        { id: 'tick-research', word: 'RESEARCH', len: 10 },
        { id: 'tick-operations', word: 'OPERATIONS', len: 10 }
    ];

    const controllers = config.map(c => {
        const target = document.getElementById(c.id);
        // Manually inject the required Flip HTML structure
        target.innerHTML = `<div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div>`;
        const instance = Tick.DOM.create(target, { value: " ".repeat(c.len) });
        return { ...c, instance, current: " ".repeat(c.len).split("") };
    });

    function rotate(ctrl, targetWord) {
        if (!ctrl.instance) return;
        const targetArr = targetWord.padEnd(ctrl.len, " ").toUpperCase().split("");
        
        targetArr.forEach((char, i) => {
            setTimeout(() => {
                const runner = setInterval(() => {
                    if (ctrl.current[i] === char) return clearInterval(runner);
                    const nextIdx = (charSet.indexOf(ctrl.current[i]) + 1) % charSet.length;
                    ctrl.current[i] = charSet[nextIdx];
                    ctrl.instance.value = ctrl.current.join("");
                    playClick();
                }, 40);
            }, i * 100);
        });
    }

    // Start Animations
    setTimeout(() => {
        controllers.forEach(c => rotate(c, c.word));
    }, 1000);

    // Loop Research
    setInterval(() => {
        const idx = Math.floor(Date.now() / 8000) % researchWords.length;
        rotate(controllers[1], researchWords[idx]);
    }, 8000);

    // --- CANVAS ---
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let w, h, t = 0;
    const res = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', res); res();

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#8D99AE'; ctx.globalAlpha = 0.04;
        const m = w * 0.4; const s = (w + m * 2) / 300;
        for (let i = 0; i <= 300; i++) {
            ctx.beginPath();
            for (let y = 0; y <= h; y += 20) {
                let x = (i * s) - m + simplex.noise3D(((i * s) - m) * 0.0008, y * 0.0006, t * 0.005) * 500;
                if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        t++; requestAnimationFrame(draw);
    }
    draw();

    const updateClock = () => {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        clock.innerText = `PT ${new Intl.DateTimeFormat('en-US', {timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).format(new Date())}`;
    };
    setInterval(updateClock, 1000); updateClock();
});
