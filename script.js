window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;
    const totalWords = words.length;

    function rotate() {
        currentIndex++;
        
        // This measures the height INCLUDING the vertical stretch
        const wordHeight = words[0].getBoundingClientRect().height;

        gsap.to(stack, {
            y: -(wordHeight * currentIndex),
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                if (currentIndex >= totalWords - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }
    // Set to 3000ms (3 seconds) for a more stable, readable feel
    setInterval(rotate, 3000);
});
