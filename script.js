// Wait for the page to load
window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        if (currentIndex >= words.length) {
            // Instant reset to top without the user seeing a slide
            gsap.set(stack, { y: 0 });
            currentIndex = 1; 
        }

        // Calculate height based on the current size of a word
        const wordHeight = words[0].offsetHeight;

        gsap.to(stack, {
            y: -(wordHeight * currentIndex),
            duration: 0.8,
            ease: "power3.inOut"
        });
    }

    // Start the loop
    setInterval(rotate, 2500);
});
