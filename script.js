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
            s.volume = 0.15; 
            s.play().catch(() => {}); 
        } 
    };

    // 2. Mechanical Flap Logic
    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const researchWords = ["RESEARCH", "DATA", "PROGRAM", "STRATEGY", "PRODUCT"];
    
    // Config: Fixed length of 10 for all rows
    const rows = [
        { id: 'tick-technical', word: 'TECHNICAL', len: 10 },
        { id: 'tick-research', word: 'RESEARCH', len: 10 },
        { id: 'tick-operations', word: 'OPERATIONS', len: 10 }
    ];

    const controllers = rows.map(r => {
        const el = document.getElementById(r.id);
        // Inject the required structure for the library
        el.innerHTML = '<div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div>';
        
        // Initialize the Tick instance
        const instance = Tick.DOM.create(el, { value: " ".repeat(r.len) });
        return { ...r, instance, current: " ".repeat(r.len).split("") };
    });

    function flipToWord(ctrl, targetWord) {
        const targetArr = targetWord.padEnd(ctrl.len, " ").toUpperCase().split("");
        
        targetArr.forEach((char, i) => {
            setTimeout(() => {
                const runner = setInterval(() => {
                    if (ctrl.current[i] === char) {
                        clearInterval(runner);
                        return;
                    }
                    const nextIdx = (charSet.indexOf(ctrl.current[i]) + 1) % charSet.length;
                    ctrl.current[i] = charSet[nextIdx];
                    
                    // Safe update
                    if (ctrl.instance) {
                        ctrl.instance.value = ctrl.current.join("");
                        playClick();
                    }
                }, 40);
            }, i * 100);
        });
    }

    // Start initial animations after a small delay
    setTimeout(() => {
        controllers.forEach(c => flipToWord(c, c.word));
    }, 1000);

    // Loop the Research line (Row index 1)
    let wordIdx = 0;
    setInterval(() => {
        wordIdx = (wordIdx + 1) % researchWords.length;
        flipToWord(controllers[1], researchWords[wordIdx]);
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
