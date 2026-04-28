window.addEventListener("load", () => {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();
    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let fragments = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initFragments();
    }

    class Fragment {
        constructor(x, y) {
            this.baseX = x;
            this.baseY = y;
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2; 
            
            // MODIFICATION 1: MUCH LONGER SEGMENTS (v20.0)
            // Was (20-30px), now (25-35px) and thicker line-weight later.
            this.size = Math.random() * 10 + 25; 
        }

        update(time) {
            let dx = this.baseX - mouse.x;
            let dy = this.baseY - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            // GRAVITY: Massively increased radius and force
            let gravityRadius = 550; // Increased to 550px for bigger presence
            let influence = Math.max(0, (gravityRadius - dist) / gravityRadius);
            
            // TIDAL LOCK (MODIFICATION 2): Max "Snap"
            // We use Math.pow(x, 5). This means it has an exponential "magnetic" pull.
            // When influence hits 1, the power hits 1 instantly, overriding ALL chaos.
            let power = Math.pow(influence, 5); 

            // 1. CHAOS STATE (Dampened drift for better alignment contrast)
            let noiseX = simplex.noise3D(this.baseX * 0.008, this.baseY * 0.008, time * 0.002) * 20; // Reduced chaos
            let noiseY = simplex.noise3D(this.baseY * 0.008, this.baseX * 0.008, time * 0.002) * 20; // Reduced chaos
            let noiseRot = simplex.noise3D(this.baseX * 0.03, this.baseY * 0.03, time * 0.0005) * Math.PI;

            // 2. FORCED OPS ASSEMBLY (Tidal Lock)
            // If power is near 1, this *perfectly* snaps the coordinate to baseX/baseY.
            this.x = gsap.utils.interpolate(this.baseX + noiseX, this.baseX, power);
            this.y = gsap.utils.interpolate(this.baseY + noiseY, this.baseY, power);
            
            // Snaps from chaotic noise rotation to rigid vertical (PI/2)
            this.currentAngle = gsap.utils.interpolate(this.angle + noiseRot, Math.PI / 2, power);
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.currentAngle);
            ctx.beginPath();
            ctx.moveTo(-this.size / 2, 0);
            ctx.lineTo(this.size / 2, 0);
            ctx.stroke();
            ctx.restore();
        }
    }

    function initFragments() {
        fragments = [];
        const spacingX = 45; // Keep wide spacing so longer lines don't turn into a solid block
        const spacingY = 45; 
        for (let x = 0; x < width; x += spacingX) {
            for (let y = 0; y < height; y += spacingY) {
                fragments.push(new Fragment(x, y));
            }
        }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    resize();

    let time = 0;
    function render() {
        ctx.clearRect(0, 0, width, height);
        
        // Settings for longer, clearer lines
        ctx.strokeStyle = '#426A5A'; 
        ctx.lineWidth = 1.25; // Slightly thinner weight for precision feel

        fragments.forEach(f => {
            f.update(time);
            let dx = f.x - mouse.x;
            let dy = f.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            // Dynamic Alpha: When aligned (near mouse), they become perfectly clear (globalAlpha 1)
            // When disorganized, they are almost invisible (globalAlpha 0.1)
            ctx.globalAlpha = gsap.utils.interpolate(0.1, 1, Math.pow(f.currentAngle / (Math.PI / 2), 10));
            // Ensure aligned state is highly visible
            if (Math.abs(f.currentAngle - Math.PI / 2) < 0.01) ctx.globalAlpha = 0.8; 
            
            f.draw();
        });

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- Keep your Color Blobs & Text Rotation Logic below ---
    // (Ensure you bump version to 20.0 for a clean load)
    gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "5vw", y: "10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

    const stack = document.querySelector(".stack");
    const windowEl = document.querySelector(".window");
    let currentIndex = 0;

    function rotate() {
        currentIndex++;
        const jumpHeight = windowEl.clientHeight;
        gsap.to(stack, {
            y: -(jumpHeight * currentIndex),
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                if (currentIndex >= document.querySelectorAll(".rotate").length - 1) {
                    gsap.set(stack, { y: 0 });
                    currentIndex = 0;
                }
            }
        });
    }
    setInterval(rotate, 3000);
});
