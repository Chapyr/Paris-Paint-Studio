'use client';

import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../app/dashboard.css';

const STATUS_LABELS = {
    pending: 'En attente',
    accepted: 'Acceptée',
    in_progress: 'En cours',
    done: 'Terminée',
    delivered: 'Livrée',
};

const TIER_LABELS = {
    standard: 'Standard',
    premium: 'Premium',
    competition: 'Compétition',
};

export default function DashboardClient({ user, profile, orders }) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="dashboard-layout">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Bonjour, {profile?.full_name || user.email} 👋</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Bienvenue dans votre espace client
                        </p>
                    </div>
                    <div className="dashboard-header-actions">
                        <Link href="/" className="btn btn-outline">Retour au site</Link>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-label">Commandes</div>
                        <div className="stat-card-value">{orders.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">En cours</div>
                        <div className="stat-card-value">
                            {orders.filter(o => ['pending', 'accepted', 'in_progress'].includes(o.status)).length}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">Terminées</div>
                        <div className="stat-card-value">
                            {orders.filter(o => ['done', 'delivered'].includes(o.status)).length}
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-cream)', marginBottom: '20px' }}>
                    Mes Commandes
                </h2>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3>Aucune commande</h3>
                        <p>Vous n&apos;avez pas encore de commande. Contactez-nous pour votre premier projet !</p>
                        <Link href="/#contact" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            Demander un devis
                        </Link>
                    </div>
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Niveau</th>
                                    <th>Figurines</th>
                                    <th>Statut</th>
                                    <th>Prix</th>
                                    <th>Paiement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td>{TIER_LABELS[order.tier] || order.tier}</td>
                                        <td>{order.figurine_count}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status}`}>
                                                {STATUS_LABELS[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)' }}>
                                            {order.total_price ? `${order.total_price}€` : '—'}
                                        </td>
                                        <td>
                                            {order.paid ? (
                                                <span className="paid-badge">✓ Payé</span>
                                            ) : order.total_price ? (
                                                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.65rem' }}>
                                                    Payer
                                                </button>
                                            ) : (
                                                <span className="unpaid-badge">En attente de devis</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
