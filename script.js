window.addEventListener("load", () => {
    // 1. REVEAL ANIMATION (TECHNICAL & OPERATIONS)
    // Targeting the h1 rows that don't rotate
    const staticRows = document.querySelectorAll(".static");

    gsap.from(staticRows, {
        x: -100, // Slides in from the left
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "power4.out"
    });

    // 2. VERTICAL ROTATION (The Word Stack)
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // Measure the physical height of the window at this exact screen size
        const jumpHeight = windowEl.offsetHeight;

        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1,
            ease: "back.out(1.5)", // Kinetic Elasticity snap
            onComplete: () => {
                // When we reach the decoy (last word), instantly reset
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }

    // Move every 3 seconds
    setInterval(rotate, 3000);
});
