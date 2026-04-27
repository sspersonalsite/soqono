window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const windowEl = document.querySelector(".word-window");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // Measure the current height of the window box
        const jumpHeight = windowEl.offsetHeight;
        const words = document.querySelectorAll(".rotating-word");

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                // When we reach the decoy (the last word)
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    // Set rotation interval (3 seconds)
    setInterval(rotate, 3000);
});
