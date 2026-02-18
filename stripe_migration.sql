-- ============================================
-- Stripe PromptPay Integration Migration
-- ============================================

-- 1. Add new columns to transactions table
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE,
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'bank_transfer';

-- 2. Create RPC function for webhook to add credits (uses service_role key, bypasses RLS)
CREATE OR REPLACE FUNCTION add_stripe_credits(target_user_id uuid, credit_amount int)
RETURNS boolean AS $$
BEGIN
  UPDATE public.profiles
  SET credits = credits + credit_amount
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Allow service_role to insert transactions (for webhook)
-- The service_role key bypasses RLS by default, so no extra policy needed.
-- But we add a policy for completeness:
DROP POLICY IF EXISTS "Service can insert transactions" ON public.transactions;
CREATE POLICY "Service can insert transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (true);
