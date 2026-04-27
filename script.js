window.addEventListener("load", () => {
    const stack = document.querySelector(".word-stack");
    const words = document.querySelectorAll(".rotating-word");
    let currentIndex = 0;
    const totalWords = words.length;

    function rotate() {
        currentIndex++;
        
        // Accurate decimal height calculation
        const wordHeight = words[0].getBoundingClientRect().height;

        gsap.to(stack, {
            y: -(wordHeight * currentIndex),
            duration: 0.9,
            ease: "power3.inOut",
            onComplete: () => {
                if (currentIndex >= totalWords - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }
    setInterval(rotate, 2800);
});
