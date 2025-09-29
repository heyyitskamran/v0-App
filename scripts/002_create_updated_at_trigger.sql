-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_pastes_updated_at ON public.pastes;
CREATE TRIGGER update_pastes_updated_at
    BEFORE UPDATE ON public.pastes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
