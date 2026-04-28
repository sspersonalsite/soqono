window.addEventListener("load", () => {
    // 1. BACKGROUND BLOBS (Keep your current settings)
    gsap.to(".blob-1", { x: "20vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-15vw", y: "-20vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "10vw", y: "15vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // 2. THE IMPROVED ROTATION
    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    const words = document.querySelectorAll(".rotate");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        
        // We use clientHeight for real-time accuracy
        const jumpHeight = windowEl.clientHeight;

        // ISIDOR STYLE: Fast slide with a slight "stretch" feel
        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut", // This is the premium "smooth" ease
            onComplete: () => {
                if (currentIndex >= words.length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });

        // Add a temporary "Vertical Stretch" to simulate motion blur
        gsap.fromTo(words, 
            { scaleY: 1 }, 
            { scaleY: 1.4, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut" }
        );
    }

    setInterval(rotate, 3000);
});
