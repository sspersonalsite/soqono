window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const windowEl = document.querySelector(".word-window");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;
    const totalWords = words.length;

    function rotate() {
        currentIndex++;
        
        // Measure the window height at the moment of animation
        const jump = windowEl.offsetHeight;

        gsap.to(stack, {
            y: -(jump * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                if (currentIndex >= totalWords - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    setInterval(rotate, 3000);
});
