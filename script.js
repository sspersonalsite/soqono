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
            this.angle = Math.random() * Math.PI * 2; // Random initial rotation
            this.size = Math.random() * 15 + 5; // Length of the dash
        }

        update(time) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let influence = Math.max(0, (200 - dist) / 200);

            // 1. Organic Drift (The "Chaos" state)
            let noise = simplex.noise3D(this.baseX * 0.01, this.baseY * 0.01, time * 0.002) * 20;
            this.x = this.baseX + noise;
            
            // 2. Assembly Logic (The "Ops" state)
            // If mouse is near, rotate to 90 degrees (vertical) and snap to grid
            let targetAngle = (dist < 150) ? Math.PI / 2 : this.angle + (time * 0.01);
            
            // Smoothly interpolate rotation
            this.currentAngle = gsap.utils.interpolate(this.angle + (noise * 0.1), Math.PI / 2, influence);
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
        const spacing = 40;
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
        ctx.globalAlpha = 0.2;

        fragments.forEach(f => {
            f.update(time);
            f.draw();
        });

        time++;
        requestAnimationFrame(render);
    }
    render();

    // --- RETAIN ALL PREVIOUS LOGIC BELOW ---
    // (Background Blobs, Magnetic Hover, and Text Rotation)
    
    gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { x: "-10vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { x: "5vw", y: "10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });

    const items = document.querySelectorAll(".industry-item");
    items.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
            gsap.to(item, { x: x, y: y, duration: 0.3 });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    });

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
