window.addEventListener("load", () => {
    const stack = document.querySelector("#wordStack");
    const words = document.querySelectorAll(".rotating");
    let currentIndex = 0;
    const totalWords = words.length;
    
    // Each word in the SVG is spaced exactly 140 units apart in the viewBox
    const step = 140; 

    function rotate() {
        currentIndex++;

        gsap.to(stack, {
            y: -(step * currentIndex),
            duration: 1.2,
            ease: "expo.inOut", // Higher quality "Power" move
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
