import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { sanitizeText } from '@/lib/security';

// GET: fetch all gallery styles (public)
export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('gallery_styles')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

// POST: create a new gallery style (admin only)
export async function POST(request) {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();

    // Sanitize inputs
    const category = body.category?.trim();
    const title = sanitizeText(body.title, 200);
    const description = sanitizeText(body.description, 2000);
    const image_url = body.image_url?.trim()?.slice(0, 500);

    if (!category || !title || !description || !image_url) {
        return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const validCategories = ['empire', 'heretique', 'alien', 'universel'];
    if (!validCategories.includes(category)) {
        return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 });
    }

    // Validate image_url format
    if (!image_url.startsWith('/') && !image_url.startsWith('https://')) {
        return NextResponse.json({ error: 'URL image invalide (doit commencer par / ou https://)' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('gallery_styles')
        .insert({ category, title, description, image_url })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}

// DELETE: remove a gallery style (admin only)
export async function DELETE(request) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const { error } = await supabase
        .from('gallery_styles')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
