import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <a href="/" className="footer-logo">
                        Paris <span>Paint Studio</span>
                    </a>
                    <p className="footer-text">
                        © 2026 Paris Paint Studio · Tous droits réservés ·{' '}
                        <a href="/mentions-legales" style={{ color: 'var(--color-text-muted)' }}>
                            Mentions légales
                        </a>
                    </p>
                    <div className="footer-social">
                        <a href="#" aria-label="Instagram" title="Instagram">📷</a>
                        <a href="#" aria-label="Facebook" title="Facebook">📘</a>
                        <a href="#" aria-label="Discord" title="Discord">💬</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
