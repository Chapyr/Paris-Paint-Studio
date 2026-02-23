import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Nom, email et message sont requis.' },
                { status: 400 }
            );
        }

        // Save to Supabase
        const supabase = await createClient();
        const { error } = await supabase
            .from('messages')
            .insert({ name, email, subject, message });

        if (error) {
            console.error('Supabase error:', error);
            // Fallback: log to console if Supabase is not configured yet
            console.log('📩 Nouveau message:', { name, email, subject, message });
        }

        return NextResponse.json({ success: true, message: 'Message reçu !' });
    } catch (err) {
        console.error('Contact API error:', err);
        return NextResponse.json(
            { error: 'Erreur lors du traitement du message.' },
            { status: 500 }
        );
    }
}
