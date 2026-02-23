import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Use service-role client for webhook (no user session)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;

        if (orderId) {
            const { error } = await supabaseAdmin
                .from('orders')
                .update({
                    paid: true,
                    stripe_payment_id: session.payment_intent,
                    status: 'accepted',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', orderId);

            if (error) {
                console.error('Failed to update order after payment:', error);
            } else {
                console.log(`✅ Order ${orderId} marked as paid`);
            }
        }
    }

    return NextResponse.json({ received: true });
}
