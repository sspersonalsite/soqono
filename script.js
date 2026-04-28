function rotate() {
    currentIndex++;
    const jumpHeight = windowEl.offsetHeight;

    // 1. THE TEXT JUMP
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

    // 2. THE SHOCKWAVE PULSE
    // This creates a green oval that "blasts" out from the middle word
    gsap.fromTo(".pulse-ring", 
        { scale: 0, opacity: 1, borderWeight: "4px" }, 
        { 
            scale: 6, // Expands to 6x its size
            opacity: 0, 
            duration: 1.5, 
            ease: "power2.out" 
        }
    );

    // 3. THE GRID FLASH (Enhanced)
    gsap.fromTo(".grid-layer", 
        { opacity: 0.6 }, 
        { opacity: 0.2, duration: 0.8 }
    );
}
