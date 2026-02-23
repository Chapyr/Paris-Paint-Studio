import { Suspense } from 'react';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const metadata = {
    title: 'Mon Espace — Paris Paint Studio',
};

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch user's orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}>
            <DashboardClient
                user={user}
                profile={profile}
                orders={orders || []}
            />
        </Suspense>
    );
}

