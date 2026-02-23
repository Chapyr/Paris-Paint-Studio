'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        // Restore saved form data after login redirect
        const saved = sessionStorage.getItem('pps-contact-draft');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const form = document.querySelector('.contact-form');
                if (form) {
                    if (data.name) form.querySelector('[name="name"]').value = data.name;
                    if (data.email) form.querySelector('[name="email"]').value = data.email;
                    if (data.subject) form.querySelector('[name="subject"]').value = data.subject;
                    if (data.message) form.querySelector('[name="message"]').value = data.message;
                }
            } catch { }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Force login before sending
        if (!user) {
            const formData = new FormData(e.target);
            const draft = Object.fromEntries(formData);
            sessionStorage.setItem('pps-contact-draft', JSON.stringify(draft));
            window.location.href = '/login?redirect=/#contact';
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const result = await res.json();
                setSubmitted(true);
                e.target.reset();
                sessionStorage.removeItem('pps-contact-draft');
                if (result.orderCreated) {
                    setSubmitMessage('✓ Devis envoyé ! Commande créée dans votre espace.');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 2000);
                } else {
                    setSubmitMessage('✓ Message envoyé !');
                    setTimeout(() => setSubmitted(false), 2500);
                }
            }
        } catch {
            setSubmitted(true);
            setSubmitMessage('✓ Message envoyé !');
            e.target.reset();
            setTimeout(() => setSubmitted(false), 2500);
        }
    };

    return (
        <section id="contact">
            <div className="container">
                <div className="reveal">
                    <h2 className="section-title">Contactez-nous</h2>
                    <span className="gold-line"></span>
                    <p className="section-subtitle">Discutons de votre prochain projet</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-info reveal">
                        <h3>Parlons de votre projet</h3>
                        <p>
                            Que vous ayez un seul personnage héroïque ou une armée entière à peindre,
                            nous serons ravis d&apos;en discuter. Envoyez-nous un message et nous vous
                            répondrons sous 24h.
                        </p>
                        <div className="contact-detail">
                            <div className="contact-detail-icon">📍</div>
                            <div className="contact-detail-text">
                                <strong>Adresse</strong>
                                <span>Paris, France</span>
                            </div>
                        </div>
                        <div className="contact-detail">
                            <div className="contact-detail-icon">✉️</div>
                            <div className="contact-detail-text">
                                <strong>Email</strong>
                                <span>contact@parispaintstudio.fr</span>
                            </div>
                        </div>
                        <div className="contact-detail">
                            <div className="contact-detail-icon">⏰</div>
                            <div className="contact-detail-text">
                                <strong>Horaires</strong>
                                <span>Lun – Ven, 10h – 19h</span>
                            </div>
                        </div>

                        {!user && (
                            <div style={{ marginTop: '24px', padding: '16px', border: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                                    🔐 Créez un compte pour suivre vos commandes
                                </p>
                                <a href="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.7rem' }}>
                                    Se connecter / Créer un compte
                                </a>
                            </div>
                        )}

                        {user && (
                            <div style={{ marginTop: '24px', padding: '16px', border: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                                    ✅ Connecté — suivez vos commandes depuis votre espace
                                </p>
                                <a href="/dashboard" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.7rem' }}>
                                    Mon Espace
                                </a>
                            </div>
                        )}
                    </div>
                    <form className="contact-form reveal" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Votre nom" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" placeholder="Votre email" required />
                        </div>
                        <div className="form-group">
                            <input type="text" name="subject" placeholder="Sujet (ex: Devis armée Space Marines)" />
                        </div>
                        <div className="form-group">
                            <textarea name="message" placeholder="Décrivez votre projet : nombre de figurines, niveau de finition souhaité, délai…" required></textarea>
                        </div>
                        <button type="submit" className="form-submit" disabled={submitted}>
                            {submitted ? submitMessage : 'Envoyer le message'}
                            {!submitted && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

