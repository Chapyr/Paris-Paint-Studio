-- ============================================
-- PARIS PAINT STUDIO — Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: Check admin role without triggering RLS (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'done', 'delivered')),
  tier TEXT NOT NULL CHECK (tier IN ('standard', 'premium', 'competition')),
  description TEXT,
  figurine_count INTEGER DEFAULT 1,
  total_price DECIMAL(10,2),
  stripe_payment_id TEXT,
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Messages (contact form)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles: admins can view all profiles (uses is_admin() to avoid recursion)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Orders: clients can view their own orders
CREATE POLICY "Clients can view own orders"
  ON orders FOR SELECT
  USING (client_id = auth.uid());

-- Orders: clients can create their own orders
CREATE POLICY "Clients can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- Orders: admins can do everything with orders
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (public.is_admin());

-- Messages: only admins can view messages
CREATE POLICY "Admins can view messages"
  ON messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update messages"
  ON messages FOR UPDATE
  USING (public.is_admin());

-- Messages: anyone can insert (contact form)
CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 5. Gallery Styles (dynamic gallery entries)
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('empire', 'heretique', 'alien', 'universel')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gallery_styles ENABLE ROW LEVEL SECURITY;

-- Public can read gallery styles
CREATE POLICY "Anyone can view gallery styles"
  ON gallery_styles FOR SELECT
  USING (true);

-- Admins can manage gallery styles
CREATE POLICY "Admins can manage gallery styles"
  ON gallery_styles FOR ALL
  USING (public.is_admin());
