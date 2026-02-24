import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = {
    empire: {
        title: 'Empire',
        description: 'Les forces loyalistes de l\'Imperium de l\'Humanité. Space Marines, Garde Impériale, Custodes et plus encore.',
        styles: [
            {
                title: 'Ultramarines — Tabletop+',
                description: 'Peinture de qualité supérieure pour vos Space Marines Ultramarines. Armure bleue riche avec reflets en NMM dorés, bases texturées avec débris urbains. Idéal pour une armée qui se démarque sur la table de jeu.',
                image: '/images/space-marine.png',
            },
            {
                title: 'Garde Impériale — Escouade peinte',
                description: 'Peinture de régiment pour vos soldats de la Garde Impériale. Uniformes détaillés, camouflage réaliste, armes usées et bases thématiques. Chaque figurine reçoit une attention individuelle.',
                image: '/images/empire.png',
            },
        ],
    },
    heretique: {
        title: 'Hérétique',
        description: 'Les serviteurs du Chaos. World Eaters, Death Guard, Thousand Sons et toutes les forces corrompues.',
        styles: [
            {
                title: 'Death Guard — Putréfaction réaliste',
                description: 'Effets de rouille, corrosion et putréfaction hyper-réalistes pour vos Death Guard. Techniques avancées de weathering, fluides nurgle et bases marécageuses pour un rendu pestilentiel.',
                image: '/images/fantasy-knight.png',
            },
            {
                title: 'Chaos Undivided — Armure corrompue',
                description: 'Peinture sombre et menaçante pour vos guerriers du Chaos. Armures noires avec reflets rouges, yeux lumineux en OSL, mutations organiques et symboles corrompus détaillés.',
                image: '/images/heretique.png',
            },
        ],
    },
    alien: {
        title: 'Alien',
        description: 'Les races Xenos de la galaxie. Eldars, Tyranides, Tau, Nécrons, Orks et toutes les espèces extraterrestres.',
        styles: [
            {
                title: 'Tyranides — Essaim bio-organique',
                description: 'Schémas de couleurs organiques et vibrants pour vos essaims Tyranides. Carapaces brillantes, chairs translucides, griffes et crocs détaillés. Chaque créature est unique dans l\'essaim.',
                image: '/images/alien.png',
            },
            {
                title: 'Nécrons — Métal ancien',
                description: 'Finitions métalliques froides et effets de lueur verte pour vos Nécrons. Techniques de dry brush avancées, oxydation réaliste et effets lumineux gauss pour un rendu spectral.',
                image: '/images/collection.png',
            },
        ],
    },
    universel: {
        title: 'Universel',
        description: 'Au-delà de Warhammer. Age of Sigmar, Donjons & Dragons, jeux historiques et toute figurine que vous souhaitez voir prendre vie.',
        styles: [
            {
                title: 'Age of Sigmar — Héros épique',
                description: 'Peinture de personnage héroïque avec un soin extrême apporté aux détails. Capes fluides, armures ornementales, effets magiques en OSL et bases de diorama pour mettre en valeur vos héros.',
                image: '/images/universel.png',
            },
            {
                title: 'D&D / RPG — Personnage sur mesure',
                description: 'Donnez vie à votre personnage de jeu de rôle. Peinture personnalisée selon votre description, avec des détails narratifs uniques. De la figurine générique au personnage inoubliable.',
                image: '/images/fantasy-knight.png',
            },
        ],
    },
};

export async function generateStaticParams() {
    return Object.keys(categories).map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }) {
    const { category } = await params;
    const cat = categories[category];
    if (!cat) return { title: 'Catégorie introuvable' };
    return {
        title: `${cat.title} — Galerie Paris Paint Studio`,
        description: cat.description,
    };
}

export default async function CategoryPage({ params }) {
    const { category } = await params;
    const cat = categories[category];

    if (!cat) {
        notFound();
    }

    return (
        <>
            <Navbar />
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

                    <div className="styles-grid">
                        {cat.styles.map((style, index) => (
                            <div key={index} className="style-card">
                                <div className="style-card-image">
                                    <Image
                                        src={style.image}
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
                </div>
            </main>
            <Footer />
        </>
    );
}
