window.addEventListener("load", () => {
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // Get precise height of the window container
        const jumpHeight = windowEl.offsetHeight;

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                // If we reach the end (the decoy word), reset to start instantly
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    // Move every 3 seconds
    setInterval(rotate, 3000);
});
