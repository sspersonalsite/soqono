window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;
    const totalWords = words.length;

    function rotate() {
        currentIndex++;

        // Get the exact height of a word slot
        const jumpDistance = words[0].getBoundingClientRect().height;

        // Animate the move upward
        gsap.to(stack, {
            y: -(jumpDistance * currentIndex),
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                // If we are on the decoy (the last word), 
                // snap back to the actual first word instantly
                if (currentIndex >= totalWords - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    setInterval(rotate, 2500);
});
