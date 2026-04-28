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
            // Increased initial chaos: completely random rotations
            this.angle = Math.random() * Math.PI * 2; 
            this.size = Math.random() * 20 + 10; 
            this.randomSpeed = Math.random() * 0.02 + 0.005;
        }

        update(time) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            // SUPERGRAVITY: Increased radius to 450px
            let gravityRadius = 450;
            let influence = Math.max(0, (gravityRadius - dist) / gravityRadius);
            // Squaring the influence makes the "snap" feel more magnetic
            let power = Math.pow(influence, 2); 

            // 1. CLEAR CHAOS (Aggressive noise-based drifting)
            let noiseX = simplex.noise3D(this.baseX * 0.01, this.baseY * 0.01, time * 0.003) * 50;
            let noiseY = simplex.noise3D(this.baseY * 0.01, this.baseX * 0.01, time * 0.003) * 50;
            let noiseRot = simplex.noise3D(this.baseX * 0.05, this.baseY * 0.05, time * 0.001) * Math.PI;

            // 2. ASSEMBLY SNAP
            // Interpolate between the drifting noise state and the vertical "Ops" state
            this.x = gsap.utils.interpolate(this.baseX + noiseX, this.baseX, power);
            this.y = gsap.utils.interpolate(this.baseY + noiseY, this.baseY, power);
            
            // Rotate from chaotic noise rotation to perfect vertical (PI/2)
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
        const spacing = 45; // Slightly wider spacing for better performance with bigger gravity
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
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
        ctx.strokeStyle = '#426A5A';
        ctx.lineWidth = 1.5;
        
        // Dynamic Alpha: Fragments near mouse become more opaque (clearer order)
        fragments.forEach(f => {
            f.update(time);
            let dx = f.x - mouse.x;
            let dy = f.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            ctx.globalAlpha = (dist < 450) ? 0.4 : 0.15;
            f.draw();
        });

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- RETAIN BLOB DRIFT & TEXT ROTATION ---
    // (Same as v18.0)
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
