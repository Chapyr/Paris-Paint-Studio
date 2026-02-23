'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
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
    const [payingOrderId, setPayingOrderId] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const paymentStatus = searchParams.get('payment');

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handlePay = async (orderId) => {
        setPayingOrderId(orderId);
        try {
            const res = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Erreur lors du paiement');
                setPayingOrderId(null);
            }
        } catch {
            alert('Erreur de connexion');
            setPayingOrderId(null);
        }
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
                        <h1>Bonjour, {profile?.full_name || user.user_metadata?.full_name || user.email} 👋</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Bienvenue dans votre espace client
                        </p>
                    </div>
                    <div className="dashboard-header-actions">
                        <a href="/" className="btn btn-outline">Retour au site</a>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Déconnexion
                        </button>
                    </div>
                </div>

                {paymentStatus === 'success' && (
                    <div className="login-success" style={{ marginBottom: '24px' }}>
                        ✅ Paiement réussi ! Votre commande a été acceptée.
                    </div>
                )}
                {paymentStatus === 'cancelled' && (
                    <div className="login-error" style={{ marginBottom: '24px' }}>
                        Paiement annulé. Vous pouvez réessayer à tout moment.
                    </div>
                )}

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
                        <a href="/#contact" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            Demander un devis
                        </a>
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
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '8px 16px', fontSize: '0.65rem' }}
                                                    onClick={() => handlePay(order.id)}
                                                    disabled={payingOrderId === order.id}
                                                >
                                                    {payingOrderId === order.id ? 'Redirection...' : 'Payer'}
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                                    ⏳ En attente de devis
                                                </span>
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
