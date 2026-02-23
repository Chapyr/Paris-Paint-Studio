'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('pps-cookie-consent');
        if (!consent) {
            // Small delay so the banner doesn't flash on load
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('pps-cookie-consent', 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem('pps-cookie-consent', 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner" role="alert">
            <div className="cookie-banner-content">
                <p>
                    🍪 Ce site utilise des cookies essentiels au fonctionnement de l&apos;authentification
                    et du paiement. Aucun cookie publicitaire n&apos;est utilisé.{' '}
                    <a href="/mentions-legales">En savoir plus</a>
                </p>
                <div className="cookie-banner-actions">
                    <button onClick={decline} className="cookie-btn cookie-btn-decline">
                        Refuser
                    </button>
                    <button onClick={accept} className="cookie-btn cookie-btn-accept">
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
}
