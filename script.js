window.addEventListener("load", () => {
    // 1. REVEAL ANIMATION (TECHNICAL & OPERATIONS)
    gsap.from(".static", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    });

    // 2. MOUSE PARALLAX (Subtle image shift)
    window.addEventListener("mousemove", (e) => {
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;
        
        gsap.to(".text-row", {
            backgroundPosition: `${50 + (xPos * 5)}% ${50 + (yPos * 5)}%`,
            duration: 1,
            ease: "power2.out"
        });
    });

    // 3. VERTICAL ROTATION (The Word Stack)
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.offsetHeight;

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1,
            ease: "back.out(1.5)", // Kinetic Elasticity
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }
    setInterval(rotate, 3000);
});
