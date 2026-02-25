'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const supabase = createClient();

        const checkUser = async (currentUser) => {
            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', currentUser.id)
                    .single();
                setIsAdmin(profile?.role === 'admin');
            } else {
                setIsAdmin(false);
            }
        };

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            checkUser(user);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null;
            setUser(u);
            checkUser(u);
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
                    {!loading && user && isAdmin && (
                        <li>
                            <a href="/admin" onClick={closeMenu} className="nav-auth-link" style={{ color: 'var(--color-gold)' }}>
                                Admin 🛡️
                            </a>
                        </li>
                    )}
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
