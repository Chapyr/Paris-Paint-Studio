import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { sendOrderCompletionEmail } from '@/lib/email';

export async function PATCH(request) {
    try {
        const supabase = await createClient();

        // Verify user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: 'orderId et status requis' }, { status: 400 });
        }

        const validStatuses = ['pending', 'accepted', 'in_progress', 'done', 'delivered'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        // Update the order
        const { data: order, error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select('*, profiles(full_name, id)')
            .single();

        if (error) {
            console.error('Order update error:', error);
            return NextResponse.json({ error: 'Erreur de mise à jour' }, { status: 500 });
        }

        // Send completion email when order is marked as done or delivered
        if (status === 'done' || status === 'delivered') {
            // Get client email from auth.users via the client_id
            const { createClient: createAdminClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );

            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(order.client_id);

            if (authUser?.user?.email) {
                sendOrderCompletionEmail({
                    to: authUser.user.email,
                    clientName: order.profiles?.full_name || authUser.user.email,
                    orderId: order.id,
                }).catch(err => console.error('Completion email failed:', err));
            }
        }

        return NextResponse.json({ success: true, order });
    } catch (err) {
        console.error('Admin order update error:', err);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
