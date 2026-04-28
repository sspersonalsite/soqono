window.addEventListener("load", () => {

    // 1. BACKGROUND SCANNING GRID (Constant Drift)
    gsap.to("body", {
        backgroundPosition: "40px 40px",
        duration: 20,
        repeat: -1,
        ease: "linear"
    });

    // 2. MAGNETIC HOVER (Industry List)
    const items = document.querySelectorAll(".industry-item");
    items.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(item, { x: x * 0.3, y: y * 0.5, duration: 0.4, ease: "power2.out" });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 3. REVEAL ANIMATION
    gsap.from(".static", {
        x: -100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "power4.out"
    });

    // 4. VERTICAL ROTATION + SYSTEM PULSE
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.offsetHeight;

        // THE ROTATION
        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1,
            ease: "back.out(1.5)",
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });

        // THE SYSTEM PULSE: Flash the grid opacity when words move
        // This makes the background "react" to the data change
        gsap.fromTo("body", 
            { opacity: 0.6 }, // Briefly dim/brighten the grid
            { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
    }

    setInterval(rotate, 3000);
});
