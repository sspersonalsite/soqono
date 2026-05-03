window.addEventListener("load", () => {
    // 1. Audio Logic with Concurrency Limiter
    const clickSound = new Audio('ai_click_short.m4a');
    let soundEnabled = false;
    let activeSounds = 0;
    const MAX_CONCURRENT_SOUNDS = 3; // Prevents "audio mess"

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.onclick = function() {
            soundEnabled = this.classList.toggle('is-active');
            if (soundEnabled) {
                clickSound.play().then(() => { clickSound.pause(); }).catch(() => {});
            }
        };
    }

    const playClick = () => { 
        if (soundEnabled && activeSounds < MAX_CONCURRENT_SOUNDS) { 
            activeSounds++;
            const s = clickSound.cloneNode(); 
            s.volume = 0.08; 
            s.onended = () => activeSounds--;
            s.play().catch(() => { activeSounds--; }); 
        } 
    };

    // 2. Mechanical Flap Engine
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    const rows = [
        { id: 'tick-technical', word: 'TECHNICAL', len: 10 },
        { id: 'tick-research', word: 'RESEARCH', len: 10 },
        { id: 'tick-operations', word: 'OPERATIONS', len: 10 }
    ];

    const controllers = rows.map(r => {
        const el = document.getElementById(r.id);
        if (!el) return null;
        el.innerHTML = '<div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div>';
        const instance = Tick.DOM.create(el, { value: " ".repeat(r.len) });
        return { ...r, instance, current: " ".repeat(r.len).split("") };
    }).filter(c => c !== null);

    function flipToWord(ctrl, targetWord) {
        if (!ctrl.instance || ctrl.instance.value === undefined) return;
        const targetArr = targetWord.padEnd(ctrl.len, " ").toUpperCase().split("");
        
        targetArr.forEach((char, i) => {
            if (i >= ctrl.len) return;
            setTimeout(() => {
                const runner = setInterval(() => {
                    if (ctrl.current[i] === char) {
                        clearInterval(runner);
                        return;
                    }
                    const currChar = ctrl.current[i];
                    const nextIdx = (charSet.indexOf(currChar) + 1) % charSet.length;
                    ctrl.current[i] = charSet[nextIdx];
                    
                    if (ctrl.instance && ctrl.instance.value !== undefined) {
                        ctrl.instance.value = ctrl.current.join("");
                        playClick();
                    }
                }, 45); // Smooth flip speed
            }, i * 90);
        });
    }

    setTimeout(() => {
        controllers.forEach(c => flipToWord(c, c.word));
    }, 1200);

    let wordIdx = 0;
    setInterval(() => {
        wordIdx = (wordIdx + 1) % researchWords.length;
        if (controllers[1]) flipToWord(controllers[1], researchWords[wordIdx]);
    }, 8000);

    // 3. Simple Clock
    const updateClock = () => {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        clock.innerText = `PT ${new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(new Date())}`;
    };
    setInterval(updateClock, 1000);
    updateClock();
});
