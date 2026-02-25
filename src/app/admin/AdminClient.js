'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
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

const CATEGORY_LABELS = {
    empire: 'Empire',
    heretique: 'Hérétique',
    alien: 'Alien',
    universel: 'Universel',
};

export default function AdminClient({ orders, clients, messages, galleryStyles }) {
    const [activeTab, setActiveTab] = useState('orders');
    const [localOrders, setLocalOrders] = useState(orders);
    const [localMessages, setLocalMessages] = useState(messages);
    const [localGallery, setLocalGallery] = useState(galleryStyles);
    const [showGalleryForm, setShowGalleryForm] = useState(false);
    const [galleryForm, setGalleryForm] = useState({
        category: 'empire', title: '', description: '', image_url: '',
    });
    const [galleryLoading, setGalleryLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (res.ok) {
                setLocalOrders(prev =>
                    prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
                );
                if (newStatus === 'done' || newStatus === 'delivered') {
                    alert('📧 Email de notification envoyé au client !');
                }
            }
        } catch (err) {
            console.error('Status update failed:', err);
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

    const handleAddGalleryStyle = async (e) => {
        e.preventDefault();
        setGalleryLoading(true);

        try {
            const res = await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galleryForm),
            });

            if (res.ok) {
                const newStyle = await res.json();
                setLocalGallery(prev => [newStyle, ...prev]);
                setGalleryForm({ category: 'empire', title: '', description: '', image_url: '' });
                setShowGalleryForm(false);
            } else {
                const err = await res.json();
                alert('Erreur : ' + (err.error || 'Impossible d\'ajouter'));
            }
        } catch {
            alert('Erreur de connexion');
        } finally {
            setGalleryLoading(false);
        }
    };

    const handleDeleteGalleryStyle = async (id) => {
        if (!confirm('Supprimer cet encart ?')) return;

        try {
            const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLocalGallery(prev => prev.filter(s => s.id !== id));
            }
        } catch {
            alert('Erreur lors de la suppression');
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
                            Gérez vos commandes, clients, messages et galerie
                        </p>
                    </div>
                    <div className="dashboard-header-actions">
                        <a href="/" className="btn btn-outline">Retour au site</a>
                        <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-label">Commandes</div>
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
                        <div className="stat-card-label">Galerie</div>
                        <div className="stat-card-value">{localGallery.length}</div>
                    </div>
                </div>

                {/* Tabs */}
                <nav className="admin-nav">
                    {[
                        { key: 'orders', label: `Commandes (${localOrders.length})` },
                        { key: 'clients', label: `Clients (${clients.length})` },
                        { key: 'messages', label: `Messages (${unreadCount} non lu${unreadCount > 1 ? 's' : ''})` },
                        { key: 'gallery', label: `Galerie (${localGallery.length})` },
                    ].map(tab => (
                        <a
                            key={tab.key}
                            href="#"
                            className={activeTab === tab.key ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); setActiveTab(tab.key); }}
                        >
                            {tab.label}
                        </a>
                    ))}
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

                {/* ── GALLERY TAB ── */}
                {activeTab === 'gallery' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-cream)', fontSize: '1.2rem' }}>
                                Encarts de la galerie
                            </h2>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowGalleryForm(!showGalleryForm)}
                            >
                                {showGalleryForm ? '✕ Annuler' : '+ Ajouter un encart'}
                            </button>
                        </div>

                        {/* Add Form */}
                        {showGalleryForm && (
                            <form onSubmit={handleAddGalleryStyle} style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                padding: '24px',
                                marginBottom: '24px',
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                                            Catégorie
                                        </label>
                                        <select
                                            value={galleryForm.category}
                                            onChange={e => setGalleryForm(f => ({ ...f, category: e.target.value }))}
                                            className="form-input"
                                            style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg-deep)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                        >
                                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                                            Titre
                                        </label>
                                        <input
                                            type="text"
                                            value={galleryForm.title}
                                            onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))}
                                            placeholder="Ex: Ultramarines — Tabletop+"
                                            required
                                            style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg-deep)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                                        URL de l&apos;image
                                    </label>
                                    <input
                                        type="url"
                                        value={galleryForm.image_url}
                                        onChange={e => setGalleryForm(f => ({ ...f, image_url: e.target.value }))}
                                        placeholder="https://... ou /images/nom.png"
                                        required
                                        style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg-deep)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    />
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>
                                        Utilisez une URL publique ou un chemin vers /images/
                                    </p>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                                        Description
                                    </label>
                                    <textarea
                                        value={galleryForm.description}
                                        onChange={e => setGalleryForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Description détaillée du style de peinture..."
                                        required
                                        rows={3}
                                        style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg-deep)', border: '1px solid var(--color-border)', color: 'var(--color-text)', resize: 'vertical' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={galleryLoading}>
                                    {galleryLoading ? 'Ajout en cours...' : '✓ Ajouter l\'encart'}
                                </button>
                            </form>
                        )}

                        {/* Gallery list by category */}
                        {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                            const catStyles = localGallery.filter(s => s.category === catKey);
                            return (
                                <div key={catKey} style={{ marginBottom: '32px' }}>
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: 'var(--color-gold)',
                                        fontSize: '1rem',
                                        marginBottom: '12px',
                                        letterSpacing: '1px',
                                    }}>
                                        {catLabel} ({catStyles.length})
                                    </h3>
                                    {catStyles.length === 0 ? (
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                            Aucun encart dans cette catégorie
                                        </p>
                                    ) : (
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            {catStyles.map(style => (
                                                <div key={style.id} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    background: 'var(--color-bg-card)',
                                                    border: '1px solid var(--color-border)',
                                                    padding: '12px 16px',
                                                }}>
                                                    <img
                                                        src={style.image_url}
                                                        alt={style.title}
                                                        style={{ width: '80px', height: '60px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
                                                            {style.title}
                                                        </div>
                                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                                                            {style.description.slice(0, 80)}...
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteGalleryStyle(style.id)}
                                                        className="btn btn-danger"
                                                        style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
