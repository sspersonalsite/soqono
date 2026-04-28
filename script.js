window.addEventListener("load", () => {
    // 1. STAGGERED ENTRANCE
    const staticRows = document.querySelectorAll('.text-row:not(.rotate)');
    
    staticRows.forEach(row => {
        const text = row.textContent.trim();
        row.textContent = ''; // Clear original text
        
        // Break into letters
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
            span.style.display = 'inline-block';
            span.style.opacity = '0'; // Start hidden
            row.appendChild(span);
        });

        // Animation to bring them in
        gsap.to(row.querySelectorAll('span'), {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out",
            // We start them slightly lower (y: 60) and they rise into place
            startAt: { y: 60, opacity: 0 } 
        });
    });

    // 2. MOUSE PARALLAX
    window.addEventListener("mousemove", (e) => {
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        gsap.to(".text-row", {
            backgroundPosition: `${50 + (xPos * 10)}% ${50 + (yPos * 10)}%`,
            duration: 1.2,
            ease: "power2.out"
        });
    });

    // 3. VERTICAL ROTATION
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.offsetHeight;

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    setInterval(rotate, 3000);
});
