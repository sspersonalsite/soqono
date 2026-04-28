window.addEventListener("load", () => {
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        const jumpHeight = windowEl.offsetHeight;

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.1, // Slightly longer duration to enjoy the physics
            /* back.out(1.7) creates a sophisticated overshoot. 
               The '1.7' controls how much it overshoots. 
            */
            ease: "back.out(1.7)", 
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    // Instant reset to the first word (the decoy)
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    setInterval(rotate, 3000);
});
