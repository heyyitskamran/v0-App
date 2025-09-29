-- Remove existing RLS policies
DROP POLICY IF EXISTS "Allow users to view public pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to view their own pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to insert their own pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to update their own pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow users to delete their own pastes" ON public.pastes;

-- Disable Row Level Security
ALTER TABLE public.pastes DISABLE ROW LEVEL SECURITY;

-- Create new policies that allow public access to all operations
-- Allow anyone to view all pastes
CREATE POLICY "Allow public read access" ON public.pastes 
  FOR SELECT USING (true);

-- Allow anyone to insert pastes
CREATE POLICY "Allow public insert access" ON public.pastes 
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update any paste
CREATE POLICY "Allow public update access" ON public.pastes 
  FOR UPDATE USING (true);

-- Allow anyone to delete any paste
CREATE POLICY "Allow public delete access" ON public.pastes 
  FOR DELETE USING (true);

-- Re-enable RLS with the new public policies
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;
