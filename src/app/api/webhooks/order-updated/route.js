import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPriceQuoteEmail } from '@/lib/email';

export async function POST(request) {
    try {
        // ── Verify webhook secret ──
        const webhookSecret = request.headers.get('x-webhook-secret');
        if (!process.env.SUPABASE_WEBHOOK_SECRET || webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
            console.error('❌ Webhook: invalid or missing secret');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Supabase Database Webhook sends: { type, table, record, old_record }
        const { type, record, old_record } = body;

        // Only handle UPDATE on orders where total_price changed from null to a value
        if (type !== 'UPDATE' || !record) {
            return NextResponse.json({ ignored: true });
        }

        const priceChanged = record.total_price && (!old_record?.total_price || record.total_price !== old_record.total_price);

        if (!priceChanged || !record.client_id) {
            return NextResponse.json({ ignored: true });
        }

        // Service role client to fetch user email
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
            return NextResponse.json({ error: 'Server config error' }, { status: 500 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Get client email from auth
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(record.client_id);

        if (!authUser?.user?.email) {
            console.error('❌ Could not find email for client:', record.client_id);
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Get client name from profile
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('full_name')
            .eq('id', record.client_id)
            .single();

        await sendPriceQuoteEmail({
            to: authUser.user.email,
            clientName: profile?.full_name || authUser.user.email,
            orderId: record.id,
            price: record.total_price,
            description: record.description || '',
        });

        return NextResponse.json({ success: true, emailSent: true });
    } catch (err) {
        console.error('Order webhook error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
