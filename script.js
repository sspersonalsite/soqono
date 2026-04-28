// Example of the "Velocity Stretch" Logic
function rotate() {
    currentIndex++;
    const jumpHeight = windowEl.offsetHeight;

    // 1. Move the stack
    gsap.to(stack, {
        y: -(jumpHeight * currentIndex),
        duration: 0.8,
        ease: "power4.inOut",
        onComplete: () => {
            if (currentIndex >= words.length - 1) {
                gsap.set(stack, { y: 0 });
                currentIndex = 0;
            }
        }
    });

    // 2. Add the temporary "Motion Stretch" to the words
    gsap.to(words, {
        scaleY: 3, // Temporarily over-stretch during move
        duration: 0.4,
        yoyo: true, // Snap back
        repeat: 1,
        ease: "power2.inOut"
    });
}
