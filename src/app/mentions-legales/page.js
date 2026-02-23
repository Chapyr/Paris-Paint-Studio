import Link from 'next/link';

export const metadata = {
    title: 'Mentions Légales — Paris Paint Studio',
    description: 'Mentions légales, politique de confidentialité et conditions d\'utilisation de Paris Paint Studio.',
};

export default function MentionsLegales() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">

                    <Link href="/" className="legal-back">← Retour au site</Link>

                    <h1 className="legal-title">Mentions Légales</h1>
                    <span className="gold-line" style={{ marginLeft: 0 }}></span>

                    {/* ── Éditeur ── */}
                    <section className="legal-section">
                        <h2>1. Éditeur du site</h2>
                        <p>
                            <strong>Paris Paint Studio</strong><br />
                            Entrepreneur individuel<br />
                            Adresse : Paris, France<br />
                            Email : contact@parispaintstudio.fr<br />
                            Directeur de la publication : Charles Fazi
                        </p>
                    </section>

                    {/* ── Hébergement ── */}
                    <section className="legal-section">
                        <h2>2. Hébergement</h2>
                        <p>
                            Ce site est hébergé par <strong>Vercel Inc.</strong><br />
                            440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
                            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
                        </p>
                    </section>

                    {/* ── Données personnelles ── */}
                    <section className="legal-section">
                        <h2>3. Protection des données personnelles (RGPD)</h2>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données (RGPD)
                            et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous
                            disposez des droits suivants concernant vos données personnelles :
                        </p>
                        <ul>
                            <li>Droit d&apos;accès à vos données</li>
                            <li>Droit de rectification</li>
                            <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
                            <li>Droit à la portabilité</li>
                            <li>Droit d&apos;opposition</li>
                            <li>Droit à la limitation du traitement</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, contactez-nous à : <strong>contact@parispaintstudio.fr</strong>
                        </p>
                    </section>

                    {/* ── Données collectées ── */}
                    <section className="legal-section">
                        <h2>4. Données collectées</h2>

                        <h3>Formulaire de contact</h3>
                        <p>
                            Lors de l&apos;envoi d&apos;un message via le formulaire de contact, nous collectons :
                            nom, adresse email, sujet et message. Ces données sont utilisées uniquement
                            pour répondre à votre demande et sont conservées pendant 12 mois maximum.
                        </p>

                        <h3>Création de compte</h3>
                        <p>
                            Lors de l&apos;inscription, nous collectons : nom complet, adresse email et
                            mot de passe (hashé, jamais stocké en clair). Ces données permettent de
                            gérer votre espace client et le suivi de vos commandes.
                        </p>

                        <h3>Paiement</h3>
                        <p>
                            Les paiements sont traités par <strong>Stripe</strong>. Vos informations
                            de carte bancaire ne sont <strong>jamais stockées</strong> sur nos serveurs.
                            Elles sont transmises directement à Stripe de manière sécurisée (SSL/TLS).
                            Consultez la <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer">
                                politique de confidentialité de Stripe</a>.
                        </p>
                    </section>

                    {/* ── Cookies ── */}
                    <section className="legal-section">
                        <h2>5. Cookies</h2>
                        <p>
                            Ce site utilise uniquement des <strong>cookies essentiels</strong> nécessaires
                            au fonctionnement de l&apos;authentification (sessions utilisateur) et du
                            paiement. Aucun cookie publicitaire, analytique ou de traçage n&apos;est utilisé.
                        </p>
                        <table className="legal-table">
                            <thead>
                                <tr>
                                    <th>Cookie</th>
                                    <th>Finalité</th>
                                    <th>Durée</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>sb-*-auth-token</td>
                                    <td>Session d&apos;authentification Supabase</td>
                                    <td>7 jours</td>
                                </tr>
                                <tr>
                                    <td>pps-cookie-consent</td>
                                    <td>Mémoriser votre choix de cookies</td>
                                    <td>Permanent (localStorage)</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* ── Sous-traitants ── */}
                    <section className="legal-section">
                        <h2>6. Sous-traitants</h2>
                        <table className="legal-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Usage</th>
                                    <th>Localisation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Supabase</td>
                                    <td>Base de données et authentification</td>
                                    <td>UE (AWS eu-west)</td>
                                </tr>
                                <tr>
                                    <td>Stripe</td>
                                    <td>Traitement des paiements</td>
                                    <td>UE / USA (conforme RGPD)</td>
                                </tr>
                                <tr>
                                    <td>Vercel</td>
                                    <td>Hébergement du site</td>
                                    <td>Global CDN</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* ── Propriété intellectuelle ── */}
                    <section className="legal-section">
                        <h2>7. Propriété intellectuelle</h2>
                        <p>
                            L&apos;ensemble du contenu de ce site (textes, images, design) est protégé
                            par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite
                            sans autorisation préalable. Warhammer et les noms associés sont des marques
                            déposées de Games Workshop Ltd.
                        </p>
                    </section>

                    {/* ── Droit applicable ── */}
                    <section className="legal-section">
                        <h2>8. Droit applicable</h2>
                        <p>
                            Le présent site est soumis au droit français. En cas de litige, les
                            tribunaux de Paris seront seuls compétents.
                        </p>
                    </section>

                    <p className="legal-updated">
                        Dernière mise à jour : Février 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
