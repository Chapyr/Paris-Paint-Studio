'use client';

import { useState } from 'react';
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

export default function AdminClient({ orders, clients, messages }) {
    const [activeTab, setActiveTab] = useState('orders');
    const [localOrders, setLocalOrders] = useState(orders);
    const [localMessages, setLocalMessages] = useState(messages);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (!error) {
            setLocalOrders(prev =>
                prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        }
    };

    const markMessageRead = async (messageId) => {
        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', messageId);

        if (!error) {
            setLocalMessages(prev =>
                prev.map(m => m.id === messageId ? { ...m, read: true } : m)
            );
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const unreadCount = localMessages.filter(m => !m.read).length;

    return (
        <div className="dashboard-layout">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Administration 🛡️</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Gérez vos commandes, clients et messages
                        </p>
                    </div>
                    <div className="dashboard-header-actions">
                        <Link href="/" className="btn btn-outline">Retour au site</Link>
                        <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-label">Commandes totales</div>
                        <div className="stat-card-value">{localOrders.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">En cours</div>
                        <div className="stat-card-value">
                            {localOrders.filter(o => ['pending', 'accepted', 'in_progress'].includes(o.status)).length}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">Clients</div>
                        <div className="stat-card-value">{clients.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">Messages non lus</div>
                        <div className="stat-card-value">{unreadCount}</div>
                    </div>
                </div>

                {/* Tabs */}
                <nav className="admin-nav">
                    <a
                        href="#"
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}
                    >
                        Commandes ({localOrders.length})
                    </a>
                    <a
                        href="#"
                        className={activeTab === 'clients' ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveTab('clients'); }}
                    >
                        Clients ({clients.length})
                    </a>
                    <a
                        href="#"
                        className={activeTab === 'messages' ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveTab('messages'); }}
                    >
                        Messages ({unreadCount} non lu{unreadCount > 1 ? 's' : ''})
                    </a>
                </nav>

                {/* ── ORDERS TAB ── */}
                {activeTab === 'orders' && (
                    localOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <h3>Aucune commande</h3>
                            <p>Les commandes apparaîtront ici.</p>
                        </div>
                    ) : (
                        <div className="orders-table-wrapper">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Client</th>
                                        <th>Niveau</th>
                                        <th>Figurines</th>
                                        <th>Prix</th>
                                        <th>Statut</th>
                                        <th>Payé</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {localOrders.map(order => (
                                        <tr key={order.id}>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>{order.profiles?.full_name || '—'}</td>
                                            <td>{TIER_LABELS[order.tier] || order.tier}</td>
                                            <td>{order.figurine_count}</td>
                                            <td style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)' }}>
                                                {order.total_price ? `${order.total_price}€` : '—'}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${order.status}`}>
                                                    {STATUS_LABELS[order.status]}
                                                </span>
                                            </td>
                                            <td>{order.paid ? <span className="paid-badge">✓</span> : <span className="unpaid-badge">✗</span>}</td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    style={{
                                                        background: 'var(--color-bg-card)',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'var(--color-text)',
                                                        padding: '6px 8px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* ── CLIENTS TAB ── */}
                {activeTab === 'clients' && (
                    clients.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">👥</div>
                            <h3>Aucun client</h3>
                            <p>Les clients inscrits apparaîtront ici.</p>
                        </div>
                    ) : (
                        <div className="orders-table-wrapper">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Téléphone</th>
                                        <th>Rôle</th>
                                        <th>Inscrit le</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map(client => (
                                        <tr key={client.id}>
                                            <td>{client.full_name || '—'}</td>
                                            <td>{client.phone || '—'}</td>
                                            <td>
                                                <span className={`status-badge ${client.role === 'admin' ? 'status-done' : 'status-pending'}`}>
                                                    {client.role}
                                                </span>
                                            </td>
                                            <td>{formatDate(client.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* ── MESSAGES TAB ── */}
                {activeTab === 'messages' && (
                    localMessages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">✉️</div>
                            <h3>Aucun message</h3>
                            <p>Les messages du formulaire de contact apparaîtront ici.</p>
                        </div>
                    ) : (
                        <div>
                            {localMessages.map(msg => (
                                <div key={msg.id} className={`message-card${!msg.read ? ' unread' : ''}`}>
                                    <div className="message-card-header">
                                        <div>
                                            <div className="message-card-sender">{msg.name}</div>
                                            <div className="message-card-email">{msg.email}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span className="message-card-date">{formatDate(msg.created_at)}</span>
                                            {!msg.read && (
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '4px 12px', fontSize: '0.6rem' }}
                                                    onClick={() => markMessageRead(msg.id)}
                                                >
                                                    Marquer lu
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {msg.subject && <div className="message-card-subject">{msg.subject}</div>}
                                    <div className="message-card-body">{msg.message}</div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
