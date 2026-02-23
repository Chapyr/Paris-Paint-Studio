'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        // Reset all reveal elements first (in case of client-side navigation)
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach((el) => el.classList.remove('visible'));

        // Small delay to allow DOM to settle after navigation
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
            );
            elements.forEach((el) => observer.observe(el));

            return () => observer.disconnect();
        }, 50);

        // Also re-trigger hero animations by toggling a class
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-cta, .hero-scroll-indicator');
        heroElements.forEach((el) => {
            el.style.animation = 'none';
            el.offsetHeight; // Force reflow
            el.style.animation = '';
        });

        return () => clearTimeout(timer);
    }, [pathname]); // Re-run when the route changes

    return null;
}
