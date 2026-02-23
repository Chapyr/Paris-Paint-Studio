import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';
import { verifyOrigin, rateLimit, getClientIP } from '@/lib/security';

export async function POST(request) {
    try {
        // ── CSRF: Verify origin ──
        if (!verifyOrigin(request)) {
            return NextResponse.json(
                { error: 'Requête non autorisée.' },
                { status: 403 }
            );
        }

        // ── Rate limiting: 10 checkout attempts per minute per IP ──
        const ip = getClientIP(request);
        const { allowed } = rateLimit(`checkout:${ip}`, 10, 60000);
        if (!allowed) {
            return NextResponse.json(
                { error: 'Trop de tentatives. Réessayez dans une minute.' },
                { status: 429, headers: { 'Retry-After': '60' } }
            );
        }

        // ── Auth check ──
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { orderId } = await request.json();

        // ── Validate orderId format (UUID) ──
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!orderId || !UUID_REGEX.test(orderId)) {
            return NextResponse.json({ error: 'ID de commande invalide' }, { status: 400 });
        }

        // Fetch order (RLS ensures the user can only access their own)
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('client_id', user.id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
        }

        if (order.paid) {
            return NextResponse.json({ error: 'Commande déjà payée' }, { status: 400 });
        }

        if (!order.total_price || order.total_price <= 0) {
            return NextResponse.json({ error: 'Prix non défini pour cette commande' }, { status: 400 });
        }

        const tierLabels = {
            standard: 'Standard',
            premium: 'Premium',
            competition: 'Compétition',
        };

        // ── Create Stripe Checkout session ──
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: user.email,
            metadata: {
                order_id: order.id,
                user_id: user.id,
            },
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Peinture ${tierLabels[order.tier] || order.tier}`,
                            description: `${order.figurine_count} figurine(s)`,
                        },
                        unit_amount: Math.round(order.total_price * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${request.headers.get('origin')}/dashboard?payment=success`,
            cancel_url: `${request.headers.get('origin')}/dashboard?payment=cancelled`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Stripe checkout error:', err);
        return NextResponse.json(
            { error: 'Erreur lors de la création du paiement' },
            { status: 500 }
        );
    }
}
