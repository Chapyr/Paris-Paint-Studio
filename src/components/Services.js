export default function Services() {
    const tiers = [
        {
            icon: '🎨',
            name: 'Standard',
            description: 'Peinture propre et soignée pour vos armées de jeu. Couleurs vives, ombrages de base et socle texturé.',
            highlights: ['Base coating & shading', 'Socle texturé', 'Idéal pour les armées'],
            cta: { label: 'Demander un devis', href: '/#contact' },
        },
        {
            icon: '🔍',
            name: 'Détaillé',
            description: 'Finition professionnelle avec techniques avancées. Blending, NMM et weathering pour vos pièces maîtresses.',
            highlights: ['Blending & NMM', 'Effets de vieillissement', 'Socle décoré'],
            cta: { label: 'Demander un devis', href: '/#contact' },
        },
        {
            icon: '🖌️',
            name: 'Style Spécifique',
            description: 'Choisissez un style de peinture dans notre galerie et nous reproduisons ce rendu sur vos figurines.',
            highlights: ['Styles variés', 'Rendu garanti', 'Selon la galerie'],
            cta: { label: 'Voir la galerie', href: '/#gallery' },
        },
        {
            icon: '👑',
            name: 'Sur Mesure',
            description: 'Un projet unique ? Contactez-nous pour une prestation entièrement personnalisée selon vos envies.',
            highlights: ['100% personnalisé', 'Diorama & display', 'Devis sur mesure'],
            cta: { label: 'Nous contacter', href: '/#contact' },
        },
    ];

    return (
        <section id="services">
            <div className="container">
                <div className="reveal">
                    <h2 className="section-title">Nos Prestations</h2>
                    <span className="gold-line"></span>
                    <p className="section-subtitle">Quatre formules pour répondre à chaque ambition</p>
                </div>
                <div className="services-grid">
                    {tiers.map((tier) => (
                        <div key={tier.name} className="service-card reveal">
                            <div className="service-icon">{tier.icon}</div>
                            <h3 className="service-name">{tier.name}</h3>
                            <p className="service-description">{tier.description}</p>
                            <ul className="service-features">
                                {tier.highlights.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                            <a href={tier.cta.href} className="service-cta">
                                {tier.cta.label}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
