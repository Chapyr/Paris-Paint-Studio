'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../../app/dashboard.css';

export default function LoginForm() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';
    const supabase = createClient();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (error) throw error;
                setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push(redirect);
                router.refresh();
            }
        } catch (err) {
            setError(
                err.message === 'Invalid login credentials'
                    ? 'Email ou mot de passe incorrect.'
                    : err.message === 'User already registered'
                        ? 'Un compte existe déjà avec cet email. Connectez-vous.'
                        : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <a href="/" className="login-logo">
                    Paris <span>Paint Studio</span>
                </a>
                <h1 className="login-title">
                    {isSignUp ? 'Créer un compte' : 'Connexion'}
                </h1>
                <p className="login-subtitle">
                    {isSignUp
                        ? 'Rejoignez-nous pour suivre vos commandes'
                        : 'Accédez à votre espace client'
                    }
                </p>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {isSignUp && (
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Nom complet"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="form-submit login-submit" disabled={loading}>
                        {loading
                            ? 'Chargement...'
                            : isSignUp ? 'Créer mon compte' : 'Se connecter'
                        }
                    </button>
                </form>

                <p className="login-switch">
                    {isSignUp ? 'Déjà inscrit ?' : 'Pas encore de compte ?'}{' '}
                    <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}>
                        {isSignUp ? 'Se connecter' : 'Créer un compte'}
                    </button>
                </p>
            </div>
        </div>
    );
}
