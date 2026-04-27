window.addEventListener("load", () => {
    const stack = document.querySelector("#wordStack");
    const rotatingWords = document.querySelectorAll(".rotating");
    let currentIndex = 0;

    // The distance between the 'y' attributes in the HTML (225 units)
    const jump = 225;

    function rotate() {
        currentIndex++;

        gsap.to(stack, {
            y: -(jump * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                if (currentIndex >= rotatingWords.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    setInterval(rotate, 3000);
});
