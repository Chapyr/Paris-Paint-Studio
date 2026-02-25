import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const CATEGORIES = {
    empire: {
        title: 'Empire',
        description: 'Les forces loyalistes de l\'Imperium de l\'Humanité. Space Marines, Garde Impériale, Custodes et plus encore.',
    },
    heretique: {
        title: 'Hérétique',
        description: 'Les serviteurs du Chaos. World Eaters, Death Guard, Thousand Sons et toutes les forces corrompues.',
    },
    alien: {
        title: 'Alien',
        description: 'Les races Xenos de la galaxie. Eldars, Tyranides, Tau, Nécrons, Orks et toutes les espèces extraterrestres.',
    },
    universel: {
        title: 'Universel',
        description: 'Au-delà de Warhammer. Age of Sigmar, Donjons & Dragons, jeux historiques et toute figurine que vous souhaitez voir prendre vie.',
    },
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { category } = await params;
    const cat = CATEGORIES[category];
    if (!cat) return { title: 'Catégorie introuvable' };
    return {
        title: `${cat.title} — Galerie Paris Paint Studio`,
        description: cat.description,
    };
}

export default async function CategoryPage({ params }) {
    const { category } = await params;
    const cat = CATEGORIES[category];

    if (!cat) {
        notFound();
    }

    // Fetch styles from Supabase
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: styles } = await supabase
        .from('gallery_styles')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

    return (
        <main className="category-page">
            <div className="container">
                <div className="category-header">
                    <a href="/#gallery" className="category-back">
                        ← Retour à la galerie
                    </a>
                    <h1 className="category-title">{cat.title}</h1>
                    <span className="gold-line"></span>
                    <p className="category-description">{cat.description}</p>
                </div>

                {(!styles || styles.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🎨</p>
                        <p>Aucun style disponible pour le moment dans cette catégorie.</p>
                        <p style={{ fontSize: '0.85rem' }}>Revenez bientôt !</p>
                    </div>
                ) : (
                    <div className="styles-grid">
                        {styles.map((style) => (
                            <div key={style.id} className="style-card">
                                <div className="style-card-image">
                                    <Image
                                        src={style.image_url}
                                        alt={style.title}
                                        width={800}
                                        height={500}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="style-card-content">
                                    <h3 className="style-card-title">{style.title}</h3>
                                    <p className="style-card-text">{style.description}</p>
                                    <a href="/#contact" className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                                        Demander un devis
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
