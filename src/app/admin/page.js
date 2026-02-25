import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const metadata = {
    title: 'Administration — Paris Paint Studio',
};

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') redirect('/dashboard');

    // Fetch all orders with client info
    const { data: orders } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

    // Fetch all clients
    const { data: clients } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch gallery styles (graceful if table doesn't exist yet)
    let galleryStyles = [];
    try {
        const { data } = await supabase
            .from('gallery_styles')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });
        galleryStyles = data || [];
    } catch {
        galleryStyles = [];
    }

    return (
        <AdminClient
            orders={orders || []}
            clients={clients || []}
            messages={messages || []}
            galleryStyles={galleryStyles || []}
        />
    );
}
