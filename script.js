window.addEventListener("load", () => {
    // 1. STAGGERED ENTRANCE FOR STATIC ROWS
    // Select the top and bottom rows
    const staticRows = document.querySelectorAll('.text-row:not(.rotate)');
    
    staticRows.forEach(row => {
        const text = row.innerText;
        row.innerHTML = ''; // Clear text
        // Wrap each letter in a span
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.innerText = char;
            span.style.display = 'inline-block';
            row.appendChild(span);
        });

        // GSAP Stagger animation
        gsap.from(row.querySelectorAll('span'), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.7)"
        });
    });

    // 2. MOUSE PARALLAX (The "Thinking Man" shifts with mouse)
    window.addEventListener("mousemove", (e) => {
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        // Move the background position slightly based on mouse
        gsap.to(".text-row", {
            backgroundPosition: `${50 + (xPos * 8)}% ${50 + (yPos * 8)}%`,
            duration: 1,
            ease: "power2.out"
        });
    });

    // 3. VERTICAL ROTATION (The existing logic)
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
