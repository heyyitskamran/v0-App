-- Remove authentication-based RLS policies and make the app fully public

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow public read access" ON pastes;
DROP POLICY IF EXISTS "Allow users to view their own pastes" ON pastes;
DROP POLICY IF EXISTS "Allow users to create pastes" ON pastes;
DROP POLICY IF EXISTS "Allow users to update their own pastes" ON pastes;
DROP POLICY IF EXISTS "Allow users to delete their own pastes" ON pastes;

-- Create new simplified policies for public access
CREATE POLICY "Allow public read access to all pastes" ON pastes
FOR SELECT USING (true);

CREATE POLICY "Allow anyone to create pastes" ON pastes
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anyone to update any paste" ON pastes
FOR UPDATE USING (true);

CREATE POLICY "Allow anyone to delete any paste" ON pastes
FOR DELETE USING (true);

-- Keep RLS enabled but with permissive policies
ALTER TABLE pastes ENABLE ROW LEVEL SECURITY;
