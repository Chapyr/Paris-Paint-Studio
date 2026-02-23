'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
    const bgRef = useRef(null);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    if (bgRef.current && scrolled < window.innerHeight) {
                        bgRef.current.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="hero-bg" ref={bgRef}></div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-badge">Artisan peintre · Paris</div>
                <h1 className="hero-title">
                    L&apos;art de la <span className="highlight">figurine</span> élevé au rang de chef-d&apos;œuvre
                </h1>
                <p className="hero-description">
                    Peinture sur commande de figurines Warhammer. Chaque pièce est traitée avec le soin
                    et la précision d&apos;une œuvre unique, dans notre atelier parisien.
                </p>
                <a href="#contact" className="hero-cta">
                    Demander un devis
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </a>
            </div>
            <div className="hero-scroll-indicator">
                <span>Scroll</span>
                <div className="scroll-line"></div>
            </div>
        </section>
    );
}
