'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="login-page">
                <div className="login-card" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Chargement...
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
