window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // If we've reached the end, reset to 0
        if (currentIndex >= words.length) {
            currentIndex = 0;
        }

        // We use the exact height of the first word to define the "jump"
        const jumpDistance = words[0].getBoundingClientRect().height;

        gsap.to(stack, {
            y: -(jumpDistance * currentIndex),
            duration: 0.8,
            ease: "power3.inOut" // Smoother easing
        });
    }

    // Adjust speed here: 2500 = 2.5 seconds
    setInterval(rotate, 2500);
});
