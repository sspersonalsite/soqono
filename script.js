window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // Use the window's height for the jump
        const windowHeight = document.querySelector('.word-window').offsetHeight;

        if (currentIndex >= words.length) {
            // Instant reset to zero
            gsap.set(stack, { y: 0 });
            currentIndex = 1; 
        }

        gsap.to(stack, {
            y: -(windowHeight * currentIndex),
            duration: 0.8,
            ease: "power2.inOut"
        });
    }

    setInterval(rotate, 2500);
});
