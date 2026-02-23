'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
            <div className="container">
                <Link href="/" className="nav-logo">
                    Paris <span>Paint Studio</span>
                </Link>
                <ul className={`nav-links${menuOpen ? ' active' : ''}`} id="navLinks">
                    <li><a href="#services" onClick={closeMenu}>Services</a></li>
                    <li><a href="#gallery" onClick={closeMenu}>Galerie</a></li>
                    <li><a href="#about" onClick={closeMenu}>À propos</a></li>
                    <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                </ul>
                <button
                    className={`nav-toggle${menuOpen ? ' active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
