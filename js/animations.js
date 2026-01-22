/**
 * F1R3FLY Scroll Animations
 * - Scroll-triggered fade-in animations for content sections
 */

(function() {
    'use strict';

    // Intersection Observer for scroll animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-in');
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Auto-add animation classes to content sections
    function autoAddAnimations() {
        // Animate labels - slide in from left
        const labels = document.querySelectorAll('.page-content .label');
        labels.forEach(label => {
            if (label.classList.contains('animate-in')) return;
            label.classList.add('animate-in', 'from-left');
        });

        // Animate h2 headings - fade up
        const headings = document.querySelectorAll('.page-content h2');
        headings.forEach(h2 => {
            if (h2.classList.contains('animate-in')) return;
            h2.classList.add('animate-in', 'from-bottom', 'delay-1');
        });

        // Animate paragraphs - fade up with delay
        const paragraphs = document.querySelectorAll('.page-content > p');
        paragraphs.forEach(p => {
            if (p.classList.contains('animate-in')) return;
            p.classList.add('animate-in', 'from-bottom', 'delay-2');
        });

        // Animate cards - staggered from bottom
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            if (card.classList.contains('animate-in')) return;
            card.classList.add('animate-in', 'from-bottom');
            const delay = (index % 3) + 1;
            card.classList.add(`delay-${delay}`);
        });

        // Animate buttons - fade up
        const buttons = document.querySelectorAll('.page-content .gradient-btn');
        buttons.forEach(btn => {
            if (btn.classList.contains('animate-in')) return;
            btn.classList.add('animate-in', 'from-bottom', 'delay-3');
        });
    }

    // Initialize
    function init() {
        autoAddAnimations();
        
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
            initScrollAnimations();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
