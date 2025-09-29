-- Remove user_id column and all authentication-related constraints
-- This makes the app completely public without any user tracking

-- First, drop any existing policies
DROP POLICY IF EXISTS "Allow users to view public pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to view their own pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to insert their own pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to update their own pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to delete their own pastes" ON public.pastes;

-- Disable RLS completely
ALTER TABLE public.pastes DISABLE ROW LEVEL SECURITY;

-- Drop the user_id column and its index
DROP INDEX IF EXISTS idx_pastes_user_id;
ALTER TABLE public.pastes DROP COLUMN IF EXISTS user_id;

-- Create simple policies for public access
CREATE POLICY "Allow public read access" ON public.pastes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.pastes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.pastes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.pastes FOR DELETE USING (true);

-- Re-enable RLS with public policies
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;
