window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // Calculate the exact height of the window to move the stack
        const windowHeight = document.querySelector('.word-window').clientHeight;

        if (currentIndex >= words.length) {
            // Reset to top
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
