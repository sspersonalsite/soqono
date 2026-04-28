window.addEventListener("load", () => {

    // 1. GRID DRIFT
    gsap.to(".grid-layer", {
        backgroundPosition: "50px 50px",
        duration: 30,
        repeat: -1,
        ease: "linear"
    });

    // 2. MAGNETIC HOVER
    const items = document.querySelectorAll(".industry-item");
    items.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(item, { x: x * 0.4, y: y * 0.4, duration: 0.3 });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 3. ROTATION + PULSE
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.offsetHeight;

        // Rotation
        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 0.7,
            ease: "power3.inOut",
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });

        // Shockwave Pulse
        gsap.fromTo(".pulse-ring", 
            { scale: 0, opacity: 1 }, 
            { scale: 5, opacity: 0, duration: 1.2, ease: "power2.out" }
        );

        // Grid Flash
        gsap.fromTo(".grid-layer", 
            { opacity: 0.8 }, 
            { opacity: 0.2, duration: 0.8 }
        );
    }

    setInterval(rotate, 3000);
});
