'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

const galleryItems = [
    {
        src: '/images/space-marine.png',
        alt: 'Space Marine Ultramarines peint à la main',
        title: 'Ultramarines Intercessor',
        category: 'Warhammer 40K',
    },
    {
        src: '/images/fantasy-knight.png',
        alt: 'Chevalier du Chaos peint avec techniques NMM',
        title: 'Chevalier du Chaos',
        category: 'Age of Sigmar',
    },
    {
        src: '/images/collection.png',
        alt: 'Collection complète de figurines Warhammer peintes',
        title: 'Collection Complète',
        category: 'Commande sur mesure',
    },
];

export default function Gallery() {
    const [lightbox, setLightbox] = useState(null);

    const openLightbox = useCallback((item) => {
        setLightbox(item);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeLightbox = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = '';
    }, []);

    return (
        <>
            <section id="gallery">
                <div className="container">
                    <div className="reveal">
                        <h2 className="section-title">Notre Galerie</h2>
                        <span className="gold-line"></span>
                        <p className="section-subtitle">Quelques réalisations récentes sorties de l&apos;atelier</p>
                    </div>
                    <div className="gallery-grid">
                        {galleryItems.map((item) => (
                            <div
                                key={item.title}
                                className="gallery-item reveal"
                                onClick={() => openLightbox(item)}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={600}
                                    height={600}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div className="gallery-overlay">
                                    <div className="gallery-overlay-text">
                                        <h4>{item.title}</h4>
                                        <p>{item.category}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <div
                className={`lightbox${lightbox ? ' active' : ''}`}
                onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
                onKeyDown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                <button className="lightbox-close" onClick={closeLightbox} aria-label="Fermer">✕</button>
                {lightbox && (
                    <>
                        <Image
                            src={lightbox.src}
                            alt={lightbox.alt}
                            width={1200}
                            height={1200}
                            style={{ maxWidth: '80vw', maxHeight: '85vh', objectFit: 'contain', border: '1px solid var(--color-border)' }}
                        />
                        <div className="lightbox-caption">
                            <h3>{lightbox.title}</h3>
                            <p>{lightbox.category}</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
