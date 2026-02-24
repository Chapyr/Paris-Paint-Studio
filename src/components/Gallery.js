'use client';

import Image from 'next/image';

const categories = [
    {
        slug: 'empire',
        title: 'Empire',
        subtitle: 'Les forces loyalistes de l\'Imperium',
        image: '/images/empire.png',
    },
    {
        slug: 'heretique',
        title: 'Hérétique',
        subtitle: 'Les serviteurs du Chaos',
        image: '/images/heretique.png',
    },
    {
        slug: 'alien',
        title: 'Alien',
        subtitle: 'Les races Xenos',
        image: '/images/alien.png',
    },
    {
        slug: 'universel',
        title: 'Universel',
        subtitle: 'Fantasy, historique et plus',
        image: '/images/universel.png',
    },
];

export default function Gallery() {
    return (
        <section id="gallery">
            <div className="container">
                <div className="reveal">
                    <h2 className="section-title">Notre Galerie</h2>
                    <span className="gold-line"></span>
                    <p className="section-subtitle">Explorez nos univers de peinture</p>
                </div>
                <div className="gallery-grid">
                    {categories.map((cat) => (
                        <a
                            key={cat.slug}
                            href={`/galerie/${cat.slug}`}
                            className="gallery-category-card reveal"
                        >
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                width={600}
                                height={600}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="gallery-overlay">
                                <div className="gallery-overlay-text">
                                    <h4>{cat.title}</h4>
                                    <p>{cat.subtitle}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
