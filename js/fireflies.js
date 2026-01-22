/**
 * F1R3FLY Fireflies Animation
 * Subtle floating fireflies - contained within hero section
 */

(function() {
    'use strict';

    const CONFIG = {
        count: 12,
        minSize: 1.5,
        maxSize: 3,
        minSpeed: 0.08,
        maxSpeed: 0.2,
        glowSize: 8,
        baseOpacity: 0.4,
        maxOpacity: 0.7,
        driftStrength: 0.15,
        pulseMin: 0.3,
        pulseMax: 1.0,
        pulseSpeed: 0.003  // 3x slower than before (was ~0.008-0.02)
    };

    let canvas, ctx;
    let fireflies = [];
    let animationId;
    let heroSection = null;
    let heroBounds = null;

    class Firefly {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            if (!heroBounds) return;
            
            if (initial) {
                this.x = heroBounds.left + Math.random() * heroBounds.width;
                this.y = heroBounds.top + Math.random() * heroBounds.height;
            } else {
                const edge = Math.floor(Math.random() * 4);
                switch(edge) {
                    case 0: 
                        this.x = heroBounds.left - 20; 
                        this.y = heroBounds.top + Math.random() * heroBounds.height; 
                        break;
                    case 1: 
                        this.x = heroBounds.right + 20; 
                        this.y = heroBounds.top + Math.random() * heroBounds.height; 
                        break;
                    case 2: 
                        this.x = heroBounds.left + Math.random() * heroBounds.width; 
                        this.y = heroBounds.top - 20; 
                        break;
                    case 3: 
                        this.x = heroBounds.left + Math.random() * heroBounds.width; 
                        this.y = heroBounds.bottom + 20; 
                        break;
                }
            }

            this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
            this.baseSpeed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
            
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * this.baseSpeed;
            this.vy = Math.sin(angle) * this.baseSpeed;
            
            this.driftAngle = Math.random() * Math.PI * 2;
            this.driftSpeed = 0.003 + Math.random() * 0.006;
            
            this.pulseOffset = Math.random() * Math.PI * 2;
            // Individual variation around the base pulse speed
            this.pulseSpeedMult = 0.8 + Math.random() * 0.4;
            
            this.hue = 50 + Math.random() * 15;
            this.saturation = 70 + Math.random() * 30;
        }

        update() {
            if (!heroBounds) return;
            
            this.driftAngle += this.driftSpeed;
            const driftX = Math.cos(this.driftAngle) * CONFIG.driftStrength;
            const driftY = Math.sin(this.driftAngle) * CONFIG.driftStrength;
            
            this.x += this.vx + driftX;
            this.y += this.vy + driftY;
            
            this.vx += (Math.random() - 0.5) * 0.01;
            this.vy += (Math.random() - 0.5) * 0.01;
            
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > CONFIG.maxSpeed) {
                this.vx = (this.vx / speed) * CONFIG.maxSpeed;
                this.vy = (this.vy / speed) * CONFIG.maxSpeed;
            }
            if (speed < CONFIG.minSpeed) {
                this.vx = (this.vx / speed) * CONFIG.minSpeed;
                this.vy = (this.vy / speed) * CONFIG.minSpeed;
            }
            
            const margin = 50;
            if (this.x < heroBounds.left - margin || 
                this.x > heroBounds.right + margin ||
                this.y < heroBounds.top - margin || 
                this.y > heroBounds.bottom + margin) {
                this.reset(false);
            }
        }

        draw() {
            const pulse = CONFIG.pulseMin + 
                (Math.sin(Date.now() * CONFIG.pulseSpeed * this.pulseSpeedMult + this.pulseOffset) * 0.5 + 0.5) * 
                (CONFIG.pulseMax - CONFIG.pulseMin);
            
            const opacity = CONFIG.baseOpacity * pulse;
            const glowRadius = this.size * CONFIG.glowSize * pulse;
            
            if (opacity <= 0.02) return;
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, glowRadius
            );
            
            const color = `hsla(${this.hue}, ${this.saturation}%, 75%,`;
            gradient.addColorStop(0, color + opacity + ')');
            gradient.addColorStop(0.2, color + (opacity * 0.5) + ')');
            gradient.addColorStop(0.5, color + (opacity * 0.15) + ')');
            gradient.addColorStop(1, color + '0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 95%, ${opacity * 1.2})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function updateHeroBounds() {
        if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            heroBounds = {
                left: 0,
                top: 0,
                right: rect.width,
                bottom: rect.height,
                width: rect.width,
                height: rect.height
            };
        }
    }

    function animate() {
        if (!canvas || !ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const firefly of fireflies) {
            firefly.update();
            firefly.draw();
        }
        
        animationId = requestAnimationFrame(animate);
    }

    function resize() {
        if (!heroSection || !canvas) return;
        
        const rect = heroSection.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        updateHeroBounds();
    }

    function handleScroll() {
        // Clouds layer parallax
        const cloudsLayer = document.querySelector('.hero-clouds');
        if (cloudsLayer) {
            const scrollY = window.scrollY;
            const parallaxSpeed = 0.15; // Clouds move slower than scroll
            cloudsLayer.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }
    }

    function init() {
        heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // Make hero position relative if not already
        const heroPosition = getComputedStyle(heroSection).position;
        if (heroPosition === 'static') {
            heroSection.style.position = 'relative';
        }
        
        canvas = document.createElement('canvas');
        canvas.id = 'fireflies-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 2;
        `;
        
        // Insert after clouds layer if it exists, otherwise at start
        const cloudsLayer = heroSection.querySelector('.hero-clouds');
        if (cloudsLayer) {
            cloudsLayer.after(canvas);
        } else {
            heroSection.insertBefore(canvas, heroSection.firstChild);
        }
        
        ctx = canvas.getContext('2d');
        
        resize();
        
        for (let i = 0; i < CONFIG.count; i++) {
            fireflies.push(new Firefly());
        }
        
        animate();
        
        window.addEventListener('resize', resize);
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
