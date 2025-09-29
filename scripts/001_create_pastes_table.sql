-- Create the pastes table
CREATE TABLE IF NOT EXISTS public.pastes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;

-- Create policies for CRUD operations
CREATE POLICY "Allow users to view public pastes" ON public.pastes 
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Allow users to view their own pastes" ON public.pastes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own pastes" ON public.pastes 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to update their own pastes" ON public.pastes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own pastes" ON public.pastes 
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_pastes_created_at ON public.pastes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pastes_user_id ON public.pastes(user_id);
