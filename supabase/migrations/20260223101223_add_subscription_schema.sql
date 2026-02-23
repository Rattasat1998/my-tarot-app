-- Add subscription columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ;

-- Add type column to transactions table for subscription support
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'one_time';
