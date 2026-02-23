export default function Services() {
    const tiers = [
        {
            icon: '⚔️',
            level: 'Niveau I',
            name: 'Standard',
            description: 'Peinture propre et soignée, idéale pour les grandes armées de jeu. Couleurs vives, ombrages de base et socle texturé.',
            features: ['Base coating & shading', 'Highlighting principal', 'Socle texturé simple', 'Délai : 5-7 jours'],
            price: 'À partir de 15€',
            note: 'par figurine d\'infanterie',
            featured: false,
        },
        {
            icon: '🛡️',
            level: 'Niveau II',
            name: 'Premium',
            description: 'Finition professionnelle avec techniques avancées. Parfait pour les pièces maîtresses et les personnages héroïques.',
            features: ['Blending & Wet blending', 'Éclairage non-métallique (NMM)', 'Effets de vieillissement', 'Socle décoré avec décors', 'Délai : 10-14 jours'],
            price: 'À partir de 45€',
            note: 'par figurine d\'infanterie',
            featured: true,
        },
        {
            icon: '👑',
            level: 'Niveau III',
            name: 'Compétition',
            description: 'Niveau exposition et concours. Chaque détail est travaillé à la perfection pour les collectionneurs les plus exigeants.',
            features: ['Techniques de studio avancées', 'Freehand & motifs personnalisés', 'OSL (Object Source Lighting)', 'Socle diorama sur mesure', 'Délai : 3-4 semaines'],
            price: 'À partir de 120€',
            note: 'par figurine d\'infanterie',
            featured: false,
        },
    ];

    return (
        <section id="services">
            <div className="container">
                <div className="reveal">
                    <h2 className="section-title">Nos Prestations</h2>
                    <span className="gold-line"></span>
                    <p className="section-subtitle">Trois niveaux de finition pour répondre à chaque ambition</p>
                </div>
                <div className="services-grid">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`service-card reveal${tier.featured ? ' featured' : ''}`}>
                            {tier.featured && <div className="popular-badge">Populaire</div>}
                            <div className="service-icon">{tier.icon}</div>
                            <div className="service-tier">{tier.level}</div>
                            <h3 className="service-name">{tier.name}</h3>
                            <p className="service-description">{tier.description}</p>
                            <ul className="service-features">
                                {tier.features.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>
                            <div className="service-price">{tier.price}</div>
                            <span className="service-price-note">{tier.note}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
