'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
            <div className="container">
                <a href="/" className="nav-logo">
                    Paris <span>Paint Studio</span>
                </a>
                <ul className={`nav-links${menuOpen ? ' active' : ''}`} id="navLinks">
                    <li><a href="/#services" onClick={closeMenu}>Services</a></li>
                    <li><a href="/#gallery" onClick={closeMenu}>Galerie</a></li>
                    <li><a href="/#about" onClick={closeMenu}>À propos</a></li>
                    <li><a href="/#contact" onClick={closeMenu}>Contact</a></li>
                    {!loading && (
                        <li>
                            {user ? (
                                <a href="/dashboard" onClick={closeMenu} className="nav-auth-link">
                                    Mon Espace
                                </a>
                            ) : (
                                <a href="/login" onClick={closeMenu} className="nav-auth-link">
                                    Se connecter
                                </a>
                            )}
                        </li>
                    )}
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
