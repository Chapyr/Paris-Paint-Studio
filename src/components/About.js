import Image from 'next/image';

export default function About() {
    return (
        <section id="about">
            <div className="container">
                <div className="about-content">
                    <div className="about-image-wrapper reveal">
                        <Image
                            src="/images/collection.png"
                            alt="Atelier Paris Paint Studio"
                            className="about-image"
                            width={600}
                            height={750}
                            style={{ width: '100%', height: 'auto', aspectRatio: '4/5', objectFit: 'cover' }}
                        />
                        <div className="about-image-frame"></div>
                    </div>
                    <div className="about-text reveal">
                        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '4px' }}>
                            L&apos;Atelier
                        </h2>
                        <span className="gold-line" style={{ marginLeft: 0 }}></span>
                        <h3>La passion du détail, au cœur de Paris</h3>
                        <p>
                            Fondé par un passionné du hobby depuis plus de 10 ans, Paris Paint Studio est né
                            de la conviction que chaque figurine mérite d&apos;être traitée comme une œuvre d&apos;art
                            à part entière.
                        </p>
                        <p>
                            Installé dans le cœur de Paris, notre atelier combine techniques traditionnelles
                            et approches modernes pour donner vie à vos armées et personnages. Du simple
                            régiment au diorama d&apos;exposition, nous apportons le même niveau d&apos;exigence
                            à chaque projet.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Figurines peintes</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">10</span>
                                <span className="stat-label">Ans d&apos;expérience</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Clients satisfaits</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
