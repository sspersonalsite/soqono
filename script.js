window.addEventListener("load", () => {
    // 1. Audio Logic
    const clickSound = new Audio('click2.m4a');
    let soundEnabled = false;
    const soundBtn = document.getElementById('sound-toggle');

    if (soundBtn) {
        soundBtn.onclick = function() {
            soundEnabled = this.classList.toggle('is-active');
            if (soundEnabled) {
                clickSound.play().then(() => { clickSound.pause(); });
            }
        };
    }

    const playClick = () => { 
        if (soundEnabled) { 
            const s = clickSound.cloneNode(); 
            s.volume = 0.12; 
            s.play().catch(() => {}); 
        } 
    };

    // 2. Mechanical Flap Logic
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
        
        // Build inner HTML for the library
        el.innerHTML = '<div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div>';
        
        // Initialize instance
        const instance = Tick.DOM.create(el, { value: " ".repeat(r.len) });
        return { ...r, instance, current: " ".repeat(r.len).split("") };
    }).filter(c => c !== null);

    function flipToWord(ctrl, targetWord) {
        // ULTIMATE FAILSAFE: Check if the instance exists AND the value property is available
        if (!ctrl.instance || ctrl.instance.value === undefined) return;

        const targetArr = targetWord.padEnd(ctrl.len, " ").toUpperCase().split("");
        
        targetArr.forEach((char, i) => {
            setTimeout(() => {
                const runner = setInterval(() => {
                    if (ctrl.current[i] === char) {
                        clearInterval(runner);
                        return;
                    }
                    const currChar = ctrl.current[i];
                    const nextIdx = (charSet.indexOf(currChar) + 1) % charSet.length;
                    ctrl.current[i] = charSet[nextIdx];
                    
                    // Final check before pushing to DOM
                    if (ctrl.instance && ctrl.instance.value !== undefined) {
                        ctrl.instance.value = ctrl.current.join("");
                        playClick();
                    }
                }, 40);
            }, i * 80);
        });
    }

    // Start with a 1-second delay to ensure Tick library is 100% ready
    setTimeout(() => {
        controllers.forEach(c => flipToWord(c, c.word));
    }, 1200);

    // Loop the middle row (RESEARCH)
    let wordIdx = 0;
    setInterval(() => {
        wordIdx = (wordIdx + 1) % researchWords.length;
        // The research row is at index 1 in our controllers array
        if (controllers[1]) {
            flipToWord(controllers[1], researchWords[wordIdx]);
        }
    }, 8000);

    // 3. Simple Clock
    const updateClock = () => {
        const clock = document.getElementById('local-clock');
        if (!clock) return;
        const now = new Date();
        clock.innerText = `PT ${new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(now)}`;
    };
    setInterval(updateClock, 1000);
    updateClock();
});
