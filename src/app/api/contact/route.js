import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { sanitizeText, isValidEmail, verifyOrigin, rateLimit, getClientIP } from '@/lib/security';

export async function POST(request) {
    try {
        // ── CSRF: Verify origin ──
        if (!verifyOrigin(request)) {
            return NextResponse.json(
                { error: 'Requête non autorisée.' },
                { status: 403 }
            );
        }

        // ── Rate limiting: 5 messages per minute per IP ──
        const ip = getClientIP(request);
        const { allowed, remaining } = rateLimit(`contact:${ip}`, 5, 60000);
        if (!allowed) {
            return NextResponse.json(
                { error: 'Trop de messages envoyés. Réessayez dans une minute.' },
                { status: 429, headers: { 'Retry-After': '60' } }
            );
        }

        const body = await request.json();

        // ── Input validation & sanitization ──
        const name = sanitizeText(body.name, 100);
        const email = body.email?.trim()?.toLowerCase();
        const subject = sanitizeText(body.subject, 200);
        const message = sanitizeText(body.message, 5000);

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Nom, email et message sont requis.' },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Adresse email invalide.' },
                { status: 400 }
            );
        }

        if (name.length < 2) {
            return NextResponse.json(
                { error: 'Le nom doit contenir au moins 2 caractères.' },
                { status: 400 }
            );
        }

        if (message.length < 10) {
            return NextResponse.json(
                { error: 'Le message doit contenir au moins 10 caractères.' },
                { status: 400 }
            );
        }

        // ── Save to Supabase ──
        const supabase = await createClient();
        const { error } = await supabase
            .from('messages')
            .insert({ name, email, subject, message });

        if (error) {
            console.error('Supabase error:', error);
            console.log('📩 Fallback — Nouveau message:', { name, email, subject, message });
        }

        const response = NextResponse.json(
            { success: true, message: 'Message reçu !' }
        );
        response.headers.set('X-RateLimit-Remaining', String(remaining));
        return response;
    } catch (err) {
        console.error('Contact API error:', err);
        return NextResponse.json(
            { error: 'Erreur lors du traitement du message.' },
            { status: 500 }
        );
    }
}
