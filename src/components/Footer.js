import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <Link href="/" className="footer-logo">
                        Paris <span>Paint Studio</span>
                    </Link>
                    <p className="footer-text">© 2026 Paris Paint Studio · Tous droits réservés</p>
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
