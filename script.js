// This tells GSAP to move the .word-stack up by one word height every 2 seconds
const words = document.querySelectorAll(".rotating-word");
const totalWords = words.length;
let currentIndex = 0;

function rotateWords() {
    currentIndex++;
    
    // If we reach the end, reset to the first word
    if (currentIndex >= totalWords) {
        currentIndex = 0;
        gsap.to(".word-stack", {
            y: 0, 
            duration: 0.8, 
            ease: "power2.inOut"
        });
    } else {
        // Move the stack up by the height of one word (12vw)
        gsap.to(".word-stack", {
            y: `-${currentIndex * 12}vw`, 
            duration: 0.8, 
            ease: "power2.inOut"
        });
    }
}

// Repeat the rotation every 2.5 seconds
setInterval(rotateWords, 2500);
