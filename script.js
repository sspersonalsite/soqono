window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;
    const totalWords = words.length;

    function rotate() {
        currentIndex++;
        
        // Calculate the height based on the current size of the first word
        const jumpDistance = words[0].getBoundingClientRect().height;

        // Slide the stack UP
        gsap.to(stack, {
            y: -(jumpDistance * currentIndex),
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                // Check if we are on the decoy "RESEARCH" (last index)
                if (currentIndex >= totalWords - 1) {
                    // Instantly snap the stack back to the top Y position
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    // Runs every 2.5 seconds
    setInterval(rotate, 2500);
});
