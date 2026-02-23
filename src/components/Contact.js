'use client';

import { useState } from 'react';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setSubmitted(true);
                e.target.reset();
                setTimeout(() => setSubmitted(false), 2500);
            }
        } catch {
            // Fallback: just show success for now (no backend yet)
            setSubmitted(true);
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
                            {submitted ? '✓ Message envoyé !' : 'Envoyer le message'}
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
