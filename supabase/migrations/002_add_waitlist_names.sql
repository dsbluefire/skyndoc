-- Create waitlist_signups table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  formatted_phone TEXT,
  country_code TEXT DEFAULT '+1',
  box_type TEXT NOT NULL,
  UNIQUE(phone_number)
);

-- Add first_name and last_name to existing table if it already exists
-- (This will fail silently if columns already exist or table doesn't exist)
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.waitlist_signups ADD COLUMN first_name TEXT;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.waitlist_signups ADD COLUMN last_name TEXT;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
END $$;

-- Update existing records to have empty strings if they don't have names
UPDATE public.waitlist_signups 
SET first_name = '', last_name = ''
WHERE first_name IS NULL OR last_name IS NULL;

-- Make columns NOT NULL after updating
ALTER TABLE public.waitlist_signups 
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name SET NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_phone ON public.waitlist_signups(phone_number);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_box_type ON public.waitlist_signups(box_type);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Anyone can insert into waitlist (public signup)
CREATE POLICY IF NOT EXISTS "Anyone can insert into waitlist"
  ON public.waitlist_signups FOR INSERT
  WITH CHECK (true);

-- RLS Policy - Only authenticated users can view waitlist (admin access)
CREATE POLICY IF NOT EXISTS "Authenticated users can view waitlist"
  ON public.waitlist_signups FOR SELECT
  USING (auth.role() = 'authenticated');
