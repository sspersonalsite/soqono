window.addEventListener("load", () => {

    // 1. GRID DRIFT (The constant movement)
    gsap.to(".grid-layer", {
        backgroundPosition: "50px 50px",
        duration: 25,
        repeat: -1,
        ease: "linear"
    });

    // 2. MAGNETIC HOVER FOR INDUSTRY LIST
    const items = document.querySelectorAll(".industry-item");
    items.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(item, { 
                x: x * 0.4, 
                y: y * 0.4, 
                duration: 0.4, 
                ease: "power2.out" 
            });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { 
                x: 0, 
                y: 0, 
                duration: 0.7, 
                ease: "elastic.out(1, 0.3)" 
            });
        });
    });

    // 3. VERTICAL ROTATION + SYSTEM PULSE
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.offsetHeight;

        // THE TEXT JUMP
        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 0.8,
            ease: "back.out(1.2)",
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });

        // THE SYSTEM PULSE
        // Grid flashes bright and then fades back to base opacity
        gsap.fromTo(".grid-layer", 
            { opacity: 0.8 }, 
            { opacity: 0.2, duration: 1.2, ease: "power2.out" }
        );
    }

    // Set interval for every 3 seconds
    setInterval(rotate, 3000);
});
